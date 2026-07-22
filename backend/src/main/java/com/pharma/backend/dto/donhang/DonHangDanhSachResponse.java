package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonHangDanhSachResponse {

    private Long maDonHang;
    private Long maKhachHang;
    private String tenKhachHang;
    private String emailKhachHang;
    private String soDienThoaiKhachHang;

    private Long maDonThuoc;
    private Long maNhanVienXuLy;
    private String tenNhanVienXuLy;

    private LocalDateTime ngayDatHang;
    private String loaiKhach;

    private BigDecimal tongTienHang;
    private BigDecimal phiGiaoHang;
    private BigDecimal giamGia;
    private BigDecimal tongThanhToan;

    private String phuongThucThanhToan;
    private String trangThaiThanhToan;
    private String trangThaiDonHang;
    private String trangThaiKiemDuyet;

    private Boolean coThuocKeDon;
}
