package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SanPhamResponseDto {

    private Long maSanPham;
    private String tenSanPham;
    private String hinhAnh;
    private BigDecimal giaBan;
    private Boolean laThuocKeDon;
    private String tenNhaSanXuat;
    private Long maDanhMuc;
    private String tenDanhMuc;
    private String moTaNgan;
    private String moTaQuyDoi;
    private List<DonViBanSanPhamResponseDto> danhSachDonViBan;
}
