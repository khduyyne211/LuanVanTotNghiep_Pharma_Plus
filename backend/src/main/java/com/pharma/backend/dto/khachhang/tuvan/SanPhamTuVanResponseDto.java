package com.pharma.backend.dto.khachhang.tuvan;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SanPhamTuVanResponseDto {

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    private Boolean laThuocKeDon;
}