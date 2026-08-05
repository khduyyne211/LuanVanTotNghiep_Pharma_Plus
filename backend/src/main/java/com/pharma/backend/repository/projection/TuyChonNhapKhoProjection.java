package com.pharma.backend.repository.projection;

public interface TuyChonNhapKhoProjection {

    Long getMaSanPham();

    String getTenSanPham();

    Long getMaDonViSanPham();

    Long getMaDonViTinh();

    String getTenDonViTinh();

    String getKyHieu();
}