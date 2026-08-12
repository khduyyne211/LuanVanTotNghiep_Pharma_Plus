package com.pharma.backend.service.admin;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.admin.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.DonViTinhRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonViSanPhamService {

    private final DonViSanPhamRepository donViSanPhamRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonViTinhRepository donViTinhRepository;

    @Transactional(readOnly = true)
    public List<DonViSanPhamResponse> layDanhSachDonViTheoSanPham(
            long maSanPham) {

        return donViSanPhamRepository
                .findBySanPham_MaSanPham(maSanPham)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DonViSanPhamResponse layChiTietDonViSanPham(
            long maDonViSanPham) {

        DonViSanPham donViSanPham = donViSanPhamRepository
                .findById(maDonViSanPham)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn vị sản phẩm"));

        return toResponse(donViSanPham);
    }

    @Transactional
    public DonViSanPhamResponse themDonViSanPham(
            DonViSanPhamRequest request) {

        SanPham sanPham = laySanPham(request.getMaSanPham());

        DonViTinh donViTinh = layDonViTinh(request.getMaDonViTinh());

        boolean biTrungDonVi = donViSanPhamRepository
                .existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinh(
                        request.getMaSanPham(),
                        request.getMaDonViTinh());

        if (biTrungDonVi) {
            throw new IllegalArgumentException(
                    "Sản phẩm này đã có đơn vị tính này rồi");
        }

        boolean laDonViCoSo = Boolean.TRUE.equals(
                request.getLaDonViCoSo());

        boolean laDonViBanMacDinh = Boolean.TRUE.equals(
                request.getLaDonViBanMacDinh());

        boolean choPhepBan = request.getChoPhepBan() != null
                ? request.getChoPhepBan()
                : true;

        boolean choPhepNhap = request.getChoPhepNhap() != null
                ? request.getChoPhepNhap()
                : true;

        if (laDonViCoSo) {
            boolean daCoDonViCoSo = donViSanPhamRepository
                    .existsBySanPham_MaSanPhamAndLaDonViCoSoTrue(
                            request.getMaSanPham());

            if (daCoDonViCoSo) {
                throw new IllegalArgumentException(
                        "Sản phẩm này đã có đơn vị cơ sở");
            }
        }

        kiemTraDonViBanMacDinh(
                request.getMaSanPham(),
                null,
                laDonViBanMacDinh,
                choPhepBan);

        DonViSanPham donViSanPham = new DonViSanPham();

        donViSanPham.setSanPham(sanPham);

        donViSanPham.setDonViTinh(donViTinh);

        donViSanPham.setGiaBanTheoDonVi(
                request.getGiaBanTheoDonVi());

        donViSanPham.setLaDonViCoSo(
                laDonViCoSo);

        donViSanPham.setLaDonViBanMacDinh(
                laDonViBanMacDinh);

        donViSanPham.setChoPhepBan(
                choPhepBan);

        donViSanPham.setChoPhepNhap(
                choPhepNhap);

        donViSanPham.setTrangThai(true);

        DonViSanPham saved = donViSanPhamRepository.save(
                donViSanPham);

        return toResponse(saved);
    }

    @Transactional
    public DonViSanPhamResponse capNhatDonViSanPham(
            long maDonViSanPham,
            DonViSanPhamRequest request) {

        DonViSanPham donViSanPham = donViSanPhamRepository
                .findById(maDonViSanPham)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn vị sản phẩm"));

        SanPham sanPham = laySanPham(request.getMaSanPham());

        DonViTinh donViTinh = layDonViTinh(request.getMaDonViTinh());

        boolean biTrungDonVi = donViSanPhamRepository
                .existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinhAndMaDonViSanPhamNot(
                        request.getMaSanPham(),
                        request.getMaDonViTinh(),
                        maDonViSanPham);

        if (biTrungDonVi) {
            throw new IllegalArgumentException(
                    "Sản phẩm này đã có đơn vị tính này rồi");
        }

        boolean laDonViCoSo = Boolean.TRUE.equals(
                request.getLaDonViCoSo());

        boolean choPhepBan = request.getChoPhepBan() != null
                ? request.getChoPhepBan()
                : true;

        boolean choPhepNhap = request.getChoPhepNhap() != null
                ? request.getChoPhepNhap()
                : true;

        /*
         * Request cũ chưa có field đơn vị bán mặc định
         * thì giữ nguyên dữ liệu hiện tại.
         */
        boolean laDonViBanMacDinh = request.getLaDonViBanMacDinh() != null
                ? request.getLaDonViBanMacDinh()
                : Boolean.TRUE.equals(
                        donViSanPham
                                .getLaDonViBanMacDinh());

        if (laDonViCoSo) {
            boolean daCoDonViCoSoKhac = donViSanPhamRepository
                    .existsBySanPham_MaSanPhamAndLaDonViCoSoTrueAndMaDonViSanPhamNot(
                            request.getMaSanPham(),
                            maDonViSanPham);

            if (daCoDonViCoSoKhac) {
                throw new IllegalArgumentException(
                        "Sản phẩm này đã có đơn vị cơ sở khác");
            }
        }

        kiemTraDonViBanMacDinh(
                request.getMaSanPham(),
                maDonViSanPham,
                laDonViBanMacDinh,
                choPhepBan);

        donViSanPham.setSanPham(sanPham);

        donViSanPham.setDonViTinh(donViTinh);

        donViSanPham.setGiaBanTheoDonVi(
                request.getGiaBanTheoDonVi());

        donViSanPham.setLaDonViCoSo(
                laDonViCoSo);

        donViSanPham.setLaDonViBanMacDinh(
                laDonViBanMacDinh);

        donViSanPham.setChoPhepBan(
                choPhepBan);

        donViSanPham.setChoPhepNhap(
                choPhepNhap);

        DonViSanPham updated = donViSanPhamRepository.save(
                donViSanPham);

        return toResponse(updated);
    }

    @Transactional
    public DonViSanPhamResponse anDonViSanPham(
            long maDonViSanPham) {

        DonViSanPham donViSanPham = donViSanPhamRepository
                .findById(maDonViSanPham)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn vị sản phẩm"));

        donViSanPham.setTrangThai(false);

        DonViSanPham updated = donViSanPhamRepository.save(
                donViSanPham);

        return toResponse(updated);
    }

    @Transactional
    public DonViSanPhamResponse hienDonViSanPham(
            long maDonViSanPham) {

        DonViSanPham donViSanPham = donViSanPhamRepository
                .findById(maDonViSanPham)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn vị sản phẩm"));

        donViSanPham.setTrangThai(true);

        DonViSanPham updated = donViSanPhamRepository.save(
                donViSanPham);

        return toResponse(updated);
    }

    private void kiemTraDonViBanMacDinh(
            Long maSanPham,
            Long maDonViSanPhamHienTai,
            boolean laDonViBanMacDinh,
            boolean choPhepBan) {

        if (!laDonViBanMacDinh) {
            return;
        }

        if (!choPhepBan) {
            throw new IllegalArgumentException(
                    "Đơn vị bán mặc định phải được phép bán");
        }

        boolean daCoDonViBanMacDinhKhac = donViSanPhamRepository
                .findBySanPham_MaSanPham(
                        maSanPham)
                .stream()
                .anyMatch(
                        donVi -> Boolean.TRUE.equals(
                                donVi.getLaDonViBanMacDinh())
                                && !Objects.equals(
                                        donVi.getMaDonViSanPham(),
                                        maDonViSanPhamHienTai));

        if (daCoDonViBanMacDinhKhac) {
            throw new IllegalArgumentException(
                    "Sản phẩm chỉ được có một đơn vị bán mặc định");
        }
    }

    private SanPham laySanPham(
            Long maSanPham) {

        if (maSanPham == null) {
            throw new IllegalArgumentException(
                    "Sản phẩm không được để trống");
        }

        return sanPhamRepository
                .findById(maSanPham)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy sản phẩm"));
    }

    private DonViTinh layDonViTinh(
            Long maDonViTinh) {

        if (maDonViTinh == null) {
            throw new IllegalArgumentException(
                    "Đơn vị tính không được để trống");
        }

        return donViTinhRepository
                .findById(maDonViTinh)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn vị tính"));
    }

    private DonViSanPhamResponse toResponse(
            DonViSanPham donViSanPham) {

        SanPham sanPham = donViSanPham.getSanPham();

        DonViTinh donViTinh = donViSanPham.getDonViTinh();

        return DonViSanPhamResponse
                .builder()
                .maDonViSanPham(
                        donViSanPham
                                .getMaDonViSanPham())
                .maSanPham(
                        sanPham != null
                                ? sanPham.getMaSanPham()
                                : null)
                .tenSanPham(
                        sanPham != null
                                ? sanPham.getTenSanPham()
                                : null)
                .maDonViTinh(
                        donViTinh != null
                                ? donViTinh.getMaDonViTinh()
                                : null)
                .tenDonViTinh(
                        donViTinh != null
                                ? donViTinh.getTenDonViTinh()
                                : null)
                .kyHieu(
                        donViTinh != null
                                ? donViTinh.getKyHieu()
                                : null)
                .giaBanTheoDonVi(
                        donViSanPham
                                .getGiaBanTheoDonVi())
                .laDonViCoSo(
                        donViSanPham
                                .getLaDonViCoSo())
                .laDonViBanMacDinh(
                        donViSanPham
                                .getLaDonViBanMacDinh())
                .choPhepBan(
                        donViSanPham
                                .getChoPhepBan())
                .choPhepNhap(
                        donViSanPham
                                .getChoPhepNhap())
                .trangThai(
                        donViSanPham
                                .getTrangThai())
                .build();
    }
}