package com.pharma.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.donthuoc.DonThuocDanhSachProjection;
import com.pharma.backend.dto.donthuoc.DonThuocKiemDuyetRequest;
import com.pharma.backend.dto.donthuoc.DonThuocResponse;
import com.pharma.backend.entity.DonThuoc;
import com.pharma.backend.repository.DonThuocRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonThuocService {

    private static final String TRANG_THAI_CHO_DUYET = "CHO_DUYET";
    private static final String TRANG_THAI_DA_DUYET = "DA_DUYET";
    private static final String TRANG_THAI_TU_CHOI = "TU_CHOI";

    private static final String KET_QUA_HOP_LE = "HOP_LE";
    private static final String KET_QUA_KHONG_HOP_LE = "KHONG_HOP_LE";

    private final DonThuocRepository donThuocRepository;

    @Transactional(readOnly = true)
    public PhanTrangResponse<DonThuocResponse> layDanhSachDonThuocPhanTrang(
            int page,
            int size,
            String trangThai,
            String keyword
    ) {
        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 50) {
            size = 50;
        }

        String trangThaiDaXuLy = xuLyChuoiLoc(trangThai);
        String keywordDaXuLy = xuLyChuoiLoc(keyword);

        Pageable pageable = PageRequest.of(page, size);

        Page<DonThuocDanhSachProjection> donThuocPage =
                donThuocRepository.timKiemDonThuoc(
                        trangThaiDaXuLy,
                        keywordDaXuLy,
                        pageable
                );

        return PhanTrangResponse.<DonThuocResponse>builder()
                .content(
                        donThuocPage.getContent()
                                .stream()
                                .map(this::toResponse)
                                .toList()
                )
                .page(donThuocPage.getNumber())
                .size(donThuocPage.getSize())
                .totalElements(donThuocPage.getTotalElements())
                .totalPages(donThuocPage.getTotalPages())
                .first(donThuocPage.isFirst())
                .last(donThuocPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public DonThuocResponse layChiTietDonThuoc(long maDonThuoc) {
        DonThuocDanhSachProjection donThuoc =
                donThuocRepository.timChiTietDonThuoc(maDonThuoc)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Không tìm thấy đơn thuốc"
                                )
                        );

        return toResponse(donThuoc);
    }

    @Transactional
    public DonThuocResponse duyetDonThuoc(
            long maDonThuoc,
            DonThuocKiemDuyetRequest request
    ) {
        DonThuoc donThuoc = layDonThuocChoKiemDuyet(maDonThuoc);
        long maNhanVienDuyet = layMaNhanVienDuyet(request);

        donThuoc.setMaNhanVienDuyet(maNhanVienDuyet);
        donThuoc.setTrangThaiDonThuoc(TRANG_THAI_DA_DUYET);
        donThuoc.setKetQuaKiemDuyet(KET_QUA_HOP_LE);
        donThuoc.setGhiChuDuocSi(
                xuLyChuoiLuu(request.getGhiChuDuocSi())
        );
        donThuoc.setLyDoTuChoi(null);

        donThuocRepository.save(donThuoc);

        return layChiTietDonThuoc(maDonThuoc);
    }

    @Transactional
    public DonThuocResponse tuChoiDonThuoc(
            long maDonThuoc,
            DonThuocKiemDuyetRequest request
    ) {
        DonThuoc donThuoc = layDonThuocChoKiemDuyet(maDonThuoc);
        long maNhanVienDuyet = layMaNhanVienDuyet(request);
        String lyDoTuChoi = layLyDoTuChoi(request);

        donThuoc.setMaNhanVienDuyet(maNhanVienDuyet);
        donThuoc.setTrangThaiDonThuoc(TRANG_THAI_TU_CHOI);
        donThuoc.setKetQuaKiemDuyet(KET_QUA_KHONG_HOP_LE);
        donThuoc.setLyDoTuChoi(lyDoTuChoi);
        donThuoc.setGhiChuDuocSi(
                xuLyChuoiLuu(request.getGhiChuDuocSi())
        );

        donThuocRepository.save(donThuoc);

        return layChiTietDonThuoc(maDonThuoc);
    }

    private DonThuoc layDonThuocChoKiemDuyet(long maDonThuoc) {
        DonThuoc donThuoc = donThuocRepository.findById(maDonThuoc)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy đơn thuốc"
                        )
                );

        if (!TRANG_THAI_CHO_DUYET.equals(
                donThuoc.getTrangThaiDonThuoc()
        )) {
            throw new IllegalArgumentException(
                    "Chỉ đơn thuốc đang chờ duyệt mới được kiểm duyệt"
            );
        }

        return donThuoc;
    }

    private long layMaNhanVienDuyet(
            DonThuocKiemDuyetRequest request
    ) {
        if (
            request == null
            || request.getMaNhanVienDuyet() == null
            || request.getMaNhanVienDuyet() <= 0
        ) {
            throw new IllegalArgumentException(
                    "Mã nhân viên duyệt không hợp lệ"
            );
        }

        return request.getMaNhanVienDuyet();
    }

    private String layLyDoTuChoi(
            DonThuocKiemDuyetRequest request
    ) {
        String lyDoTuChoi = request != null
                ? xuLyChuoiLuu(request.getLyDoTuChoi())
                : null;

        if (lyDoTuChoi == null) {
            throw new IllegalArgumentException(
                    "Lý do từ chối không được để trống"
            );
        }

        return lyDoTuChoi;
    }

    private String xuLyChuoiLoc(String giaTri) {
        if (giaTri == null || giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }

    private String xuLyChuoiLuu(String giaTri) {
        if (giaTri == null || giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }

    private DonThuocResponse toResponse(
            DonThuocDanhSachProjection donThuoc
    ) {
        return DonThuocResponse.builder()
                .maDonThuoc(donThuoc.getMaDonThuoc())
                .maKhachHang(donThuoc.getMaKhachHang())
                .tenKhachHang(donThuoc.getTenKhachHang())
                .emailKhachHang(donThuoc.getEmailKhachHang())
                .soDienThoaiKhachHang(
                        donThuoc.getSoDienThoaiKhachHang()
                )
                .maNhanVienDuyet(donThuoc.getMaNhanVienDuyet())
                .tenNhanVienDuyet(
                        donThuoc.getTenNhanVienDuyet()
                )
                .anhDonThuoc(donThuoc.getAnhDonThuoc())
                .ngayUpload(donThuoc.getNgayUpload())
                .trangThaiDonThuoc(
                        donThuoc.getTrangThaiDonThuoc()
                )
                .lyDoTuChoi(donThuoc.getLyDoTuChoi())
                .ghiChuDuocSi(donThuoc.getGhiChuDuocSi())
                .ketQuaKiemDuyet(
                        donThuoc.getKetQuaKiemDuyet()
                )
                .build();
    }
}