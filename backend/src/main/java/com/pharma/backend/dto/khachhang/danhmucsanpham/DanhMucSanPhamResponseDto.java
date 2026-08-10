package com.pharma.backend.dto.khachhang.danhmucsanpham;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DanhMucSanPhamResponseDto {

    private Long maDanhMuc;

    private String tenDanhMuc;

    private List<DanhMucSanPhamResponseDto> danhSachDanhMucCon;
}