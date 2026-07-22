package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonHangChiTietResponse {

    private Long maDonHang;

    private Long maKhachHang;
    private String tenKhachHang;
    private String emailKhachHang;
    private String soDienThoaiKhachHang;

    private Long maDiaChi;
    private String tenNguoiNhan;
    private String soDienThoaiNhan;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String diaChiChiTiet;

    private Long maVoucher;
    private Long maDonThuoc;

    private Long maNhanVienXuLy;
    private String tenNhanVienXuLy;

    private Long maDuocSiDuyet;
    private String tenDuocSiDuyet;

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
    private LocalDateTime ngayKiemDuyet;
    private String ghiChuKiemDuyet;
    private String lyDoTuChoiDuyet;

    private String ghiChu;

    private String anhDonThuoc;
    private String trangThaiDonThuoc;
    private String ketQuaKiemDuyetDonThuoc;

    private Boolean coThuocKeDon;

    private List<ChiTietDonHangResponse> danhSachChiTiet;
}
