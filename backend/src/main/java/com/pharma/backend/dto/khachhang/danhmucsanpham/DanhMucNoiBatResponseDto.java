package com.pharma.backend.dto.khachhang.danhmucsanpham;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DanhMucNoiBatResponseDto {

    private Long maDanhMuc;
    private String tenDanhMuc;
    private Long soLuongSanPham;
}