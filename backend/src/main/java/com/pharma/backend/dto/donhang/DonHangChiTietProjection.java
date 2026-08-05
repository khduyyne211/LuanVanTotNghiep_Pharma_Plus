package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DonHangChiTietProjection {

    Long getMaDonHang();
    Long getMaKhachHang();
    String getTenKhachHang();
    String getSoDienThoaiKhachHang();

    Long getMaDiaChi();
    String getTenNguoiNhan();
    String getSoDienThoaiNhan();
    String getThanhPho();
    String getPhuongKhuVuc();
    String getDiaChiChiTiet();

    Long getMaVoucher();
    Long getMaDonThuoc();

    Long getMaNhanVienXuLy();
    String getTenNhanVienXuLy();

    LocalDateTime getNgayDatHang();
    String getLoaiKhach();

    BigDecimal getTongTienHang();
    BigDecimal getPhiGiaoHang();
    BigDecimal getGiamGia();
    BigDecimal getTongThanhToan();

    String getPhuongThucThanhToan();
    String getTrangThaiThanhToan();
    String getTrangThaiDonHang();

    String getTrangThaiKiemDuyet();
    LocalDateTime getNgayKiemDuyet();
    String getGhiChuKiemDuyet();
    String getLyDoTuChoiDuyet();
    String getGhiChu();

    String getAnhDonThuoc();
    String getTrangThaiDonThuoc();
    String getLyDoTuChoiDonThuoc();
    String getGhiChuDonThuoc();

    Integer getCoThuocKeDon();
}
