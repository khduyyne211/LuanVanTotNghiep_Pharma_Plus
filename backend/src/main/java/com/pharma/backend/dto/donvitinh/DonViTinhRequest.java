package com.pharma.backend.dto.donvitinh;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonViTinhRequest {

    @NotBlank(message = "Tên đơn vị tính không được để trống")
    @Size(max = 50, message = "Tên đơn vị tính không được vượt quá 50 ký tự")
    private String tenDonViTinh;

    @Size(max = 20, message = "Ký hiệu không được vượt quá 20 ký tự")
    private String kyHieu;

    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    private String moTa;
}