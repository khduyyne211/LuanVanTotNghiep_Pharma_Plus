package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.donvisanpham.DonViSanPhamResponse;
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
    public List<DonViSanPhamResponse> layDanhSachDonViTheoSanPham(Long maSanPham) {
        return donViSanPhamRepository.findBySanPham_MaSanPham(maSanPham)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DonViSanPhamResponse layChiTietDonViSanPham(Long maDonViSanPham) {
        DonViSanPham donViSanPham = donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị sản phẩm"));

        return toResponse(donViSanPham);
    }

    @Transactional
    public DonViSanPhamResponse themDonViSanPham(DonViSanPhamRequest request) {
        SanPham sanPham = laySanPham(request.getMaSanPham());
        DonViTinh donViTinh = layDonViTinh(request.getMaDonViTinh());

        boolean biTrungDonVi = donViSanPhamRepository
                .existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinh(
                        request.getMaSanPham(),
                        request.getMaDonViTinh()
                );

        if (biTrungDonVi) {
            throw new IllegalArgumentException("Sản phẩm này đã có đơn vị tính này rồi");
        }

        Boolean laDonViCoSo = request.getLaDonViCoSo() != null
                ? request.getLaDonViCoSo()
                : false;

        if (laDonViCoSo) {
            boolean daCoDonViCoSo = donViSanPhamRepository
                    .existsBySanPham_MaSanPhamAndLaDonViCoSoTrue(request.getMaSanPham());

            if (daCoDonViCoSo) {
                throw new IllegalArgumentException("Sản phẩm này đã có đơn vị cơ sở");
            }
        }

        DonViSanPham donViSanPham = new DonViSanPham();
        donViSanPham.setSanPham(sanPham);
        donViSanPham.setDonViTinh(donViTinh);
        donViSanPham.setGiaBanTheoDonVi(request.getGiaBanTheoDonVi());
        donViSanPham.setLaDonViCoSo(laDonViCoSo);
        donViSanPham.setChoPhepBan(request.getChoPhepBan() != null ? request.getChoPhepBan() : true);
        donViSanPham.setChoPhepNhap(request.getChoPhepNhap() != null ? request.getChoPhepNhap() : true);
        donViSanPham.setTrangThai(true);

        DonViSanPham saved = donViSanPhamRepository.save(donViSanPham);

        return toResponse(saved);
    }

    @Transactional
    public DonViSanPhamResponse capNhatDonViSanPham(
            Long maDonViSanPham,
            DonViSanPhamRequest request
    ) {
        DonViSanPham donViSanPham = donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị sản phẩm"));

        SanPham sanPham = laySanPham(request.getMaSanPham());
        DonViTinh donViTinh = layDonViTinh(request.getMaDonViTinh());

        boolean biTrungDonVi = donViSanPhamRepository
                .existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinhAndMaDonViSanPhamNot(
                        request.getMaSanPham(),
                        request.getMaDonViTinh(),
                        maDonViSanPham
                );

        if (biTrungDonVi) {
            throw new IllegalArgumentException("Sản phẩm này đã có đơn vị tính này rồi");
        }

        Boolean laDonViCoSo = request.getLaDonViCoSo() != null
                ? request.getLaDonViCoSo()
                : false;

        if (laDonViCoSo) {
            boolean daCoDonViCoSoKhac = donViSanPhamRepository
                    .existsBySanPham_MaSanPhamAndLaDonViCoSoTrueAndMaDonViSanPhamNot(
                            request.getMaSanPham(),
                            maDonViSanPham
                    );

            if (daCoDonViCoSoKhac) {
                throw new IllegalArgumentException("Sản phẩm này đã có đơn vị cơ sở khác");
            }
        }

        donViSanPham.setSanPham(sanPham);
        donViSanPham.setDonViTinh(donViTinh);
        donViSanPham.setGiaBanTheoDonVi(request.getGiaBanTheoDonVi());
        donViSanPham.setLaDonViCoSo(laDonViCoSo);
        donViSanPham.setChoPhepBan(request.getChoPhepBan() != null ? request.getChoPhepBan() : true);
        donViSanPham.setChoPhepNhap(request.getChoPhepNhap() != null ? request.getChoPhepNhap() : true);

        DonViSanPham updated = donViSanPhamRepository.save(donViSanPham);

        return toResponse(updated);
    }

    @Transactional
    public DonViSanPhamResponse anDonViSanPham(Long maDonViSanPham) {
        DonViSanPham donViSanPham = donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị sản phẩm"));

        donViSanPham.setTrangThai(false);

        DonViSanPham updated = donViSanPhamRepository.save(donViSanPham);

        return toResponse(updated);
    }

    @Transactional
    public DonViSanPhamResponse hienDonViSanPham(Long maDonViSanPham) {
        DonViSanPham donViSanPham = donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị sản phẩm"));

        donViSanPham.setTrangThai(true);

        DonViSanPham updated = donViSanPhamRepository.save(donViSanPham);

        return toResponse(updated);
    }

    private SanPham laySanPham(Long maSanPham) {
        if (maSanPham == null) {
            throw new IllegalArgumentException("Sản phẩm không được để trống");
        }

        return sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
    }

    private DonViTinh layDonViTinh(Long maDonViTinh) {
        if (maDonViTinh == null) {
            throw new IllegalArgumentException("Đơn vị tính không được để trống");
        }

        return donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính"));
    }

    private DonViSanPhamResponse toResponse(DonViSanPham donViSanPham) {
        SanPham sanPham = donViSanPham.getSanPham();
        DonViTinh donViTinh = donViSanPham.getDonViTinh();

        return DonViSanPhamResponse.builder()
                .maDonViSanPham(donViSanPham.getMaDonViSanPham())
                .maSanPham(sanPham != null ? sanPham.getMaSanPham() : null)
                .tenSanPham(sanPham != null ? sanPham.getTenSanPham() : null)
                .maDonViTinh(donViTinh != null ? donViTinh.getMaDonViTinh() : null)
                .tenDonViTinh(donViTinh != null ? donViTinh.getTenDonViTinh() : null)
                .kyHieu(donViTinh != null ? donViTinh.getKyHieu() : null)
                .giaBanTheoDonVi(donViSanPham.getGiaBanTheoDonVi())
                .laDonViCoSo(donViSanPham.getLaDonViCoSo())
                .choPhepBan(donViSanPham.getChoPhepBan())
                .choPhepNhap(donViSanPham.getChoPhepNhap())
                .trangThai(donViSanPham.getTrangThai())
                .build();
    }
}