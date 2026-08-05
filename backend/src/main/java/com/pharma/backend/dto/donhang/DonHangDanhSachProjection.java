package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DonHangDanhSachProjection {

    Long getMaDonHang();
    Long getMaKhachHang();
    String getTenKhachHang();
    String getSoDienThoaiKhachHang();

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

    Integer getCoThuocKeDon();
}
