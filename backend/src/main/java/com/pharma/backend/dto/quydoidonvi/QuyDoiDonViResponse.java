package com.pharma.backend.dto.quydoidonvi;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuyDoiDonViResponse {

    private Long maQuyDoi;

    private Long maSanPham;
    private String tenSanPham;

    private Long maDonViNguon;
    private String tenDonViNguon;
    private String kyHieuDonViNguon;
    private BigDecimal soLuongNguon;

    private Long maDonViDich;
    private String tenDonViDich;
    private String kyHieuDonViDich;
    private BigDecimal soLuongDich;

    private Boolean trangThai;
}