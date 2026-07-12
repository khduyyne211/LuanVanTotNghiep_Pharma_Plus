package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViResponse;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuyDoiDonViService {

    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;

    @Transactional(readOnly = true)
    public List<QuyDoiDonViResponse> layDanhSachQuyDoiTheoSanPham(Long maSanPham) {
        return quyDoiDonViRepository.findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(maSanPham)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuyDoiDonViResponse layChiTietQuyDoiDonVi(Long maQuyDoi) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository.findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quy đổi đơn vị"));

        return toResponse(quyDoiDonVi);
    }

    @Transactional
    public QuyDoiDonViResponse themQuyDoiDonVi(QuyDoiDonViRequest request) {
        kiemTraDuLieuRequest(request);

        SanPham sanPham = laySanPham(request.getMaSanPham());
        DonViSanPham donViNguon = layDonViSanPham(request.getMaDonViNguon());
        DonViSanPham donViDich = layDonViSanPham(request.getMaDonViDich());

        kiemTraDonViThuocDungSanPham(
                request.getMaSanPham(),
                donViNguon,
                donViDich
        );

        boolean biTrungQuyDoi = quyDoiDonViRepository
                .existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPham(
                        request.getMaSanPham(),
                        request.getMaDonViNguon(),
                        request.getMaDonViDich()
                );

        if (biTrungQuyDoi) {
            throw new IllegalArgumentException("Quy đổi đơn vị này đã tồn tại");
        }

        QuyDoiDonVi quyDoiDonVi = new QuyDoiDonVi();
        quyDoiDonVi.setSanPham(sanPham);
        quyDoiDonVi.setDonViNguon(donViNguon);
        quyDoiDonVi.setSoLuongNguon(request.getSoLuongNguon());
        quyDoiDonVi.setDonViDich(donViDich);
        quyDoiDonVi.setSoLuongDich(request.getSoLuongDich());
        quyDoiDonVi.setTrangThai(true);

        QuyDoiDonVi saved = quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(saved);
    }

    @Transactional
    public QuyDoiDonViResponse capNhatQuyDoiDonVi(
            Long maQuyDoi,
            QuyDoiDonViRequest request
    ) {
        kiemTraDuLieuRequest(request);

        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository.findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quy đổi đơn vị"));

        SanPham sanPham = laySanPham(request.getMaSanPham());
        DonViSanPham donViNguon = layDonViSanPham(request.getMaDonViNguon());
        DonViSanPham donViDich = layDonViSanPham(request.getMaDonViDich());

        kiemTraDonViThuocDungSanPham(
                request.getMaSanPham(),
                donViNguon,
                donViDich
        );

        boolean biTrungQuyDoi = quyDoiDonViRepository
                .existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPhamAndMaQuyDoiNot(
                        request.getMaSanPham(),
                        request.getMaDonViNguon(),
                        request.getMaDonViDich(),
                        maQuyDoi
                );

        if (biTrungQuyDoi) {
            throw new IllegalArgumentException("Quy đổi đơn vị này đã tồn tại");
        }

        quyDoiDonVi.setSanPham(sanPham);
        quyDoiDonVi.setDonViNguon(donViNguon);
        quyDoiDonVi.setSoLuongNguon(request.getSoLuongNguon());
        quyDoiDonVi.setDonViDich(donViDich);
        quyDoiDonVi.setSoLuongDich(request.getSoLuongDich());

        QuyDoiDonVi updated = quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(updated);
    }

    @Transactional
    public QuyDoiDonViResponse anQuyDoiDonVi(Long maQuyDoi) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository.findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quy đổi đơn vị"));

        quyDoiDonVi.setTrangThai(false);

        QuyDoiDonVi updated = quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(updated);
    }

    @Transactional
    public QuyDoiDonViResponse hienQuyDoiDonVi(Long maQuyDoi) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository.findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quy đổi đơn vị"));

        quyDoiDonVi.setTrangThai(true);

        QuyDoiDonVi updated = quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(updated);
    }

    private void kiemTraDuLieuRequest(QuyDoiDonViRequest request) {
        if (request.getMaSanPham() == null) {
            throw new IllegalArgumentException("Sản phẩm không được để trống");
        }

        if (request.getMaDonViNguon() == null) {
            throw new IllegalArgumentException("Đơn vị nguồn không được để trống");
        }

        if (request.getMaDonViDich() == null) {
            throw new IllegalArgumentException("Đơn vị đích không được để trống");
        }

        if (request.getMaDonViNguon().equals(request.getMaDonViDich())) {
            throw new IllegalArgumentException("Đơn vị nguồn và đơn vị đích không được giống nhau");
        }

        if (request.getSoLuongNguon() == null
                || request.getSoLuongNguon().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số lượng nguồn phải lớn hơn 0");
        }

        if (request.getSoLuongDich() == null
                || request.getSoLuongDich().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số lượng đích phải lớn hơn 0");
        }
    }

    private SanPham laySanPham(Long maSanPham) {
        return sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
    }

    private DonViSanPham layDonViSanPham(Long maDonViSanPham) {
        return donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị sản phẩm"));
    }

    private void kiemTraDonViThuocDungSanPham(
            Long maSanPham,
            DonViSanPham donViNguon,
            DonViSanPham donViDich
    ) {
        Long maSanPhamCuaDonViNguon = donViNguon.getSanPham().getMaSanPham();
        Long maSanPhamCuaDonViDich = donViDich.getSanPham().getMaSanPham();

        if (!maSanPham.equals(maSanPhamCuaDonViNguon)) {
            throw new IllegalArgumentException("Đơn vị nguồn không thuộc sản phẩm đã chọn");
        }

        if (!maSanPham.equals(maSanPhamCuaDonViDich)) {
            throw new IllegalArgumentException("Đơn vị đích không thuộc sản phẩm đã chọn");
        }
    }

    private QuyDoiDonViResponse toResponse(QuyDoiDonVi quyDoiDonVi) {
        SanPham sanPham = quyDoiDonVi.getSanPham();

        DonViSanPham donViNguon = quyDoiDonVi.getDonViNguon();
        DonViTinh donViTinhNguon = donViNguon.getDonViTinh();

        DonViSanPham donViDich = quyDoiDonVi.getDonViDich();
        DonViTinh donViTinhDich = donViDich.getDonViTinh();

        return QuyDoiDonViResponse.builder()
                .maQuyDoi(quyDoiDonVi.getMaQuyDoi())
                .maSanPham(sanPham != null ? sanPham.getMaSanPham() : null)
                .tenSanPham(sanPham != null ? sanPham.getTenSanPham() : null)
                .maDonViNguon(donViNguon != null ? donViNguon.getMaDonViSanPham() : null)
                .tenDonViNguon(donViTinhNguon != null ? donViTinhNguon.getTenDonViTinh() : null)
                .kyHieuDonViNguon(donViTinhNguon != null ? donViTinhNguon.getKyHieu() : null)
                .soLuongNguon(quyDoiDonVi.getSoLuongNguon())
                .maDonViDich(donViDich != null ? donViDich.getMaDonViSanPham() : null)
                .tenDonViDich(donViTinhDich != null ? donViTinhDich.getTenDonViTinh() : null)
                .kyHieuDonViDich(donViTinhDich != null ? donViTinhDich.getKyHieu() : null)
                .soLuongDich(quyDoiDonVi.getSoLuongDich())
                .trangThai(quyDoiDonVi.getTrangThai())
                .build();
    }
}