package com.pharma.backend.dto.admin.quydoidonvi;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuyDoiDonViRequest {

    private Long maSanPham;

    private Long maDonViNguon;
    private BigDecimal soLuongNguon;

    private Long maDonViDich;
    private BigDecimal soLuongDich;
}