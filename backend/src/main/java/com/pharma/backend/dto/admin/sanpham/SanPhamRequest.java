package com.pharma.backend.dto.admin.sanpham;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SanPhamRequest {

    private Long maDanhMuc;
    private Long maNhaSanXuat;

    private String tenSanPham;
    private String hinhAnh;
    private Boolean laThuocKeDon;
    private String moTaNgan;
    private String moTa;
}