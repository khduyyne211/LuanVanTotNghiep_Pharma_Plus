package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;

public interface SanPhamBanTaiQuayProjection {

    Long getMaDonViSanPham();
    Long getMaSanPham();
    String getTenSanPham();
    String getHinhAnh();
    Boolean getLaThuocKeDon();

    Long getMaDonViTinh();
    String getTenDonViTinh();
    String getKyHieu();

    BigDecimal getGiaBanTheoDonVi();
}
