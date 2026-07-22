package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;

public interface ChiTietDonHangProjection {

    Long getMaChiTietDonHang();
    Long getMaSanPham();
    String getTenSanPham();
    Boolean getLaThuocKeDon();
    String getHinhAnh();

    Long getMaDonViSanPham();
    Long getMaDonViTinh();
    String getTenDonViTinh();
    String getKyHieu();

    Integer getSoLuong();
    BigDecimal getDonGia();
    BigDecimal getGiamGia();
    BigDecimal getThanhTien();
    String getCachTinhGia();
}
