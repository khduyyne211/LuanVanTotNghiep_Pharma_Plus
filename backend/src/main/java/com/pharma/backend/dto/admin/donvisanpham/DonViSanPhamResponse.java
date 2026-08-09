package com.pharma.backend.dto.admin.donvisanpham;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonViSanPhamResponse {

    private Long maDonViSanPham;

    private Long maSanPham;
    private String tenSanPham;

    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;

    private BigDecimal giaBanTheoDonVi;

    private Boolean laDonViCoSo;
    private Boolean choPhepBan;
    private Boolean choPhepNhap;
    private Boolean trangThai;
}