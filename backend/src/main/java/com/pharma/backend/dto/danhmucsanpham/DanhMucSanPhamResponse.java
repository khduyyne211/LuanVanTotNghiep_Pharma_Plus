package com.pharma.backend.dto.danhmucsanpham;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DanhMucSanPhamResponse {

    private Long maDanhMuc;
    private Long maDanhMucCha;
    private String tenDanhMucCha;
    private String tenDanhMuc;
    private String moTa;
    private Integer thuTuHienThi;
    private Boolean trangThaiHienThi;
}