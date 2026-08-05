package com.pharma.backend.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface LoSapHetHanProjection {

    Long getMaChiTietPhieuNhap();

    Long getMaPhieuNhap();

    Long getMaSanPham();

    String getTenSanPham();

    Long getMaDonViSanPham();

    String getTenDonViTinh();

    BigDecimal getSoLuongConLai();

    LocalDate getHanSuDung();
}