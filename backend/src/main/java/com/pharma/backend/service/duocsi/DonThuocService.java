package com.pharma.backend.service.duocsi;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocDanhSachProjection;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocKiemDuyetRequest;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocResponse;
import com.pharma.backend.entity.DonThuoc;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.repository.DonThuocRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonThuocService {

    private final DonThuocRepository donThuocRepository;

    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

    @Transactional(readOnly = true)
    public PhanTrangResponse<DonThuocResponse> layDanhSachDonThuocPhanTrang(
            int page,
            int size,
            TrangThaiDonThuoc trangThai,
            String keyword) {

        int pageHopLe = Math.max(
                page,
                0);

        int sizeHopLe = size <= 0
                ? 10
                : Math.min(
                        size,
                        50);

        Pageable pageable = PageRequest.of(
                pageHopLe,
                sizeHopLe);

        Page<DonThuocDanhSachProjection> donThuocPage = donThuocRepository
                .timKiemDonThuoc(
                        trangThai == null
                                ? null
                                : trangThai.name(),

                        xuLyChuoi(
                                keyword),

                        pageable);

        return PhanTrangResponse
                .<DonThuocResponse>builder()
                .content(
                        donThuocPage
                                .getContent()
                                .stream()
                                .map(
                                        this::toResponse)
                                .toList())
                .page(
                        donThuocPage.getNumber())
                .size(
                        donThuocPage.getSize())
                .totalElements(
                        donThuocPage.getTotalElements())
                .totalPages(
                        donThuocPage.getTotalPages())
                .first(
                        donThuocPage.isFirst())
                .last(
                        donThuocPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public DonThuocResponse layChiTietDonThuoc(
            long maDonThuoc) {

        kiemTraMaDonThuoc(
                maDonThuoc);

        DonThuocDanhSachProjection donThuoc = donThuocRepository
                .timChiTietDonThuoc(
                        maDonThuoc)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn thuốc."));

        return toResponse(
                donThuoc);
    }

    @Transactional
    public DonThuocResponse duyetDonThuoc(
            long maDonThuoc,
            Long maNhanVienDuyet,
            DonThuocKiemDuyetRequest request) {

        DonThuoc donThuoc = layDonThuocChoKiemDuyet(
                maDonThuoc);

        NhanVienNoiBo nhanVienDuyet = layNhanVienDuyet(
                maNhanVienDuyet);

        donThuoc.setNhanVienDuyet(
                nhanVienDuyet);

        donThuoc.setTrangThaiDonThuoc(
                TrangThaiDonThuoc.DA_DUYET);

        donThuoc.setLyDoTuChoi(
                null);

        donThuoc.setGhiChu(
                request == null
                        ? null
                        : xuLyChuoi(
                                request.getGhiChu()));

        donThuocRepository.saveAndFlush(
                donThuoc);

        return layChiTietDonThuoc(
                maDonThuoc);
    }

    @Transactional
    public DonThuocResponse tuChoiDonThuoc(
            long maDonThuoc,
            Long maNhanVienDuyet,
            DonThuocKiemDuyetRequest request) {

        DonThuoc donThuoc = layDonThuocChoKiemDuyet(
                maDonThuoc);

        NhanVienNoiBo nhanVienDuyet = layNhanVienDuyet(
                maNhanVienDuyet);

        donThuoc.setNhanVienDuyet(
                nhanVienDuyet);

        donThuoc.setTrangThaiDonThuoc(
                TrangThaiDonThuoc.TU_CHOI);

        donThuoc.setLyDoTuChoi(
                layLyDoTuChoi(
                        request));

        donThuoc.setGhiChu(
                request == null
                        ? null
                        : xuLyChuoi(
                                request.getGhiChu()));

        donThuocRepository.saveAndFlush(
                donThuoc);

        return layChiTietDonThuoc(
                maDonThuoc);
    }

    private DonThuoc layDonThuocChoKiemDuyet(
            long maDonThuoc) {

        kiemTraMaDonThuoc(
                maDonThuoc);

        DonThuoc donThuoc = donThuocRepository
                .timTheoMaDeKiemDuyet(
                        maDonThuoc)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn thuốc."));

        if (donThuoc.getTrangThaiDonThuoc() != TrangThaiDonThuoc.CHO_DUYET) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chỉ đơn thuốc đang chờ duyệt mới được kiểm duyệt.");
        }

        return donThuoc;
    }

    private NhanVienNoiBo layNhanVienDuyet(
            Long maNhanVienDuyet) {

        if (maNhanVienDuyet == null
                || maNhanVienDuyet <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập.");
        }

        return nhanVienNoiBoRepository
                .findById(
                        maNhanVienDuyet)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy Dược sĩ đang đăng nhập."));
    }

    private String layLyDoTuChoi(
            DonThuocKiemDuyetRequest request) {

        String lyDoTuChoi = request == null
                ? null
                : xuLyChuoi(
                        request.getLyDoTuChoi());

        if (lyDoTuChoi == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Lý do từ chối không được để trống.");
        }

        return lyDoTuChoi;
    }

    private void kiemTraMaDonThuoc(
            long maDonThuoc) {

        if (maDonThuoc <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn thuốc không hợp lệ.");
        }
    }

    private String xuLyChuoi(
            String giaTri) {

        if (giaTri == null
                || giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }

    private DonThuocResponse toResponse(
            DonThuocDanhSachProjection donThuoc) {

        return DonThuocResponse
                .builder()
                .maDonThuoc(
                        donThuoc.getMaDonThuoc())
                .maDonHang(
                        donThuoc.getMaDonHang())
                .maKhachHang(
                        donThuoc.getMaKhachHang())
                .tenKhachHang(
                        donThuoc.getTenKhachHang())
                .soDienThoaiKhachHang(
                        donThuoc.getSoDienThoaiKhachHang())
                .maNhanVienDuyet(
                        donThuoc.getMaNhanVienDuyet())
                .tenNhanVienDuyet(
                        donThuoc.getTenNhanVienDuyet())
                .anhDonThuoc(
                        donThuoc.getAnhDonThuoc())
                .ngayUpload(
                        donThuoc.getNgayUpload())
                .trangThaiDonThuoc(
                        chuyenTrangThai(
                                donThuoc.getTrangThaiDonThuoc()))
                .lyDoTuChoi(
                        donThuoc.getLyDoTuChoi())
                .ghiChu(
                        donThuoc.getGhiChu())
                .build();
    }

    private TrangThaiDonThuoc chuyenTrangThai(
            String giaTri) {

        if (giaTri == null
                || giaTri.isBlank()) {
            return null;
        }

        try {
            return TrangThaiDonThuoc.valueOf(
                    giaTri.trim());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(
                    "Giá trị không hợp lệ tại cột trang_thai_don_thuoc: "
                            + giaTri,
                    ex);
        }
    }
}
