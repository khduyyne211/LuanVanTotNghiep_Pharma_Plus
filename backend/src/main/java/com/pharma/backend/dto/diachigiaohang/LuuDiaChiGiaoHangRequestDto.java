package com.pharma.backend.dto.diachigiaohang;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LuuDiaChiGiaoHangRequestDto {

    @NotBlank(message = "Họ tên người nhận không được để trống")
    @Size(
        max = 100,
        message = "Họ tên người nhận không được vượt quá 100 ký tự"
    )
    private String tenNguoiNhan;

    @NotBlank(message = "Số điện thoại người nhận không được để trống")
    @Pattern(
        regexp = "^0\\d{9}$",
        message = "Số điện thoại người nhận phải gồm 10 chữ số và bắt đầu bằng 0"
    )
    private String soDienThoaiNhan;

    @NotBlank(message = "Thành phố không được để trống")
    @Size(
        max = 100,
        message = "Thành phố không được vượt quá 100 ký tự"
    )
    private String thanhPho;

    @NotBlank(message = "Phường hoặc khu vực không được để trống")
    @Size(
        max = 150,
        message = "Phường hoặc khu vực không được vượt quá 150 ký tự"
    )
    private String phuongKhuVuc;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    @Size(
        max = 255,
        message = "Địa chỉ chi tiết không được vượt quá 255 ký tự"
    )
    private String diaChiChiTiet;

    @NotNull(message = "Vui lòng xác định địa chỉ có phải mặc định hay không")
    private Boolean laMacDinh;
}