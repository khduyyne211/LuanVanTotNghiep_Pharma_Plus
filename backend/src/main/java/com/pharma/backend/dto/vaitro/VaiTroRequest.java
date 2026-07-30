package com.pharma.backend.dto.vaitro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VaiTroRequest {

    @NotBlank(message = "Tên vai trò không được để trống")
    @Size(max = 150, message = "Tên vai trò không được vượt quá 50 ký tự")
    private String tenVaiTro;

    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    private String moTa;
}