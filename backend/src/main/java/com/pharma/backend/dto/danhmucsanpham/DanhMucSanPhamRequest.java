package com.pharma.backend.dto.danhmucsanpham;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DanhMucSanPhamRequest {

    private Long maDanhMucCha;

    @NotBlank(message = "Tên danh mục sản phẩm không được để trống")
    @Size(
            max = 150,
            message = "Tên danh mục sản phẩm không được vượt quá 150 ký tự"
    )
    private String tenDanhMuc;

    @Size(
            max = 255,
            message = "Mô tả không được vượt quá 255 ký tự"
    )
    private String moTa;

    private Integer thuTuHienThi;
}