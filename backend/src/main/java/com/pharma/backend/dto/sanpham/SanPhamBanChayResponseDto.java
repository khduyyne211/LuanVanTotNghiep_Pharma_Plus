package com.pharma.backend.dto.sanpham;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SanPhamBanChayResponseDto {

    private SanPhamResponseDto sanPham;
    private Long tongSoLuongDaBan;
}