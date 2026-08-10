package com.pharma.backend.repository.projection;

import java.math.BigDecimal;

public interface TonKhoThapProjection {

    Long getMaSanPham();

    String getTenSanPham();

    BigDecimal getTongSoLuongTon();
}