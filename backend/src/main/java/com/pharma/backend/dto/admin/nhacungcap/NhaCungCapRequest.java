package com.pharma.backend.dto.admin.nhacungcap;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NhaCungCapRequest {

    @NotBlank(message = "Tên nhà cung cấp không được để trống")
    @Size(max = 150, message = "Tên nhà cung cấp không được vượt quá 150 ký tự")
    private String tenNhaCungCap;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    @Pattern(
            regexp = "^$|^(?:0\\d{9,10})$",
            message = "Số điện thoại không đúng định dạng"
    )
    private String soDienThoai;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String diaChi;

    @Email(message = "Email không đúng định dạng")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;
}