package com.pharma.backend.dto.danhmucsanpham;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DanhMucSanPhamRequest {

    private Long maDanhMucCha;
    private String tenDanhMuc;
    private String moTa;
    private Integer thuTuHienThi;
}