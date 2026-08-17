package com.pharma.backend.dto.khachhang.voucher;

import java.util.List;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangLocalRequestDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiemTraVoucherRequestDto {

    @NotBlank(message = "Mã voucher không được để trống.")
    @Size(
            max = 50,
            message = "Mã voucher không được vượt quá 50 ký tự."
    )
    private String maGiamGia;

    @NotEmpty(message = "Giỏ hàng không có sản phẩm.")
    @Valid
    private List<ChiTietGioHangLocalRequestDto>
            danhSachChiTiet;
}