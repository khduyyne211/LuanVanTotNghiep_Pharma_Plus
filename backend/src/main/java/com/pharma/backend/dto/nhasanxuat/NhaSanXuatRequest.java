package com.pharma.backend.dto.nhasanxuat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NhaSanXuatRequest {

    @NotBlank(message = "Tên nhà sản xuất không được để trống")
    @Size(max = 150, message = "Tên nhà sản xuất không được vượt quá 150 ký tự")
    private String tenNhaSanXuat;

    @Size(max = 100, message = "Quốc gia không được vượt quá 100 ký tự")
    private String quocGia;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String diaChi;
}