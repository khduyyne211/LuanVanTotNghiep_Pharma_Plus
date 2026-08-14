package com.pharma.backend.dto.admin.taikhoan;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaiKhoanNhanVienCapNhatRequest {

    @NotBlank(message = "Họ tên nhân viên không được để trống")
    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
    private String hoTen;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^0\\d{9,10}$",
            message = "Số điện thoại không đúng định dạng"
    )
    private String soDienThoai;

    @NotEmpty(message = "Phải chọn ít nhất một vai trò")
    private Set<Long> danhSachMaVaiTro;
}