package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SanPhamDonHangTomTatDto {

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    private Integer soLuong;

    private String tenDonViTinh;

    private BigDecimal donGia;

    private BigDecimal thanhTien;
}
