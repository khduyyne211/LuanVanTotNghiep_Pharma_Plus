package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DonViBanSanPhamResponseDto {

    private Long maDonViSanPham;

    private Long maDonViTinh;

    private String tenDonViTinh;

    private String kyHieu;

    private BigDecimal giaBanTheoDonVi;

    private Boolean laDonViCoSo;
}