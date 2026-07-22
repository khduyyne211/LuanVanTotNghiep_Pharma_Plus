package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SanPhamBanTaiQuayResponse {

    private Long maDonViSanPham;
    private Long maSanPham;
    private String tenSanPham;
    private String hinhAnh;
    private Boolean laThuocKeDon;

    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;

    private BigDecimal giaBanTheoDonVi;
}
