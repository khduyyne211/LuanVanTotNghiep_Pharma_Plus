package com.pharma.backend.dto.donhang;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChiTietDonHangResponseDto {

    private Long maChiTietDonHang;

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    private Long maDonViSanPham;

    private String tenDonViTinh;

    private Integer soLuong;

    private BigDecimal donGia;

    private BigDecimal giamGia;

    private BigDecimal thanhTien;
}
