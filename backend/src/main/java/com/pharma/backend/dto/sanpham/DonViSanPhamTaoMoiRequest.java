package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonViSanPhamTaoMoiRequest {
    private Long maDonViTinh;
    private BigDecimal giaBanTheoDonVi;
    private Boolean laDonViCoSo;
    private Boolean choPhepBan;
    private Boolean choPhepNhap;
}
