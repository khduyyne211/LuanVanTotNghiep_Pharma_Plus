package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuyDoiDonViTaoMoiRequest {

    private Long maDonViTinhNguon;
    private BigDecimal soLuongNguon;

    private Long maDonViTinhDich;
    private BigDecimal soLuongDich;
}