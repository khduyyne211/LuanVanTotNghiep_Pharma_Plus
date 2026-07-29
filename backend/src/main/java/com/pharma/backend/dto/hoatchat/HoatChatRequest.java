package com.pharma.backend.dto.hoatchat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HoatChatRequest {

    @NotBlank(message = "Tên hoạt chất không được để trống")
    @Size(max = 150, message = "Tên hoạt chất không được vượt quá 150 ký tự")
    private String tenHoatChat;

    @Size(max = 50, message = "Đơn vị không được vượt quá 50 ký tự")
    private String donVi;

    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    private String moTa;
}