package com.pharma.backend.dto.thongtincanhan;

import java.time.LocalDate;

import com.pharma.backend.enums.common.GioiTinh;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapNhatThongTinCaNhanRequestDto {

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String hoTen;

    private GioiTinh gioiTinh;

    @PastOrPresent(message = "Ngày sinh không được lớn hơn ngày hiện tại")
    private LocalDate ngaySinh;
}