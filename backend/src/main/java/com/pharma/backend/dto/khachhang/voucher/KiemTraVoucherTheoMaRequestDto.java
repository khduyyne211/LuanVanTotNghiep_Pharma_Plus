package com.pharma.backend.dto.khachhang.voucher;

import java.util.List;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangLocalRequestDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiemTraVoucherTheoMaRequestDto {

    @NotNull(message = "Mã voucher không được để trống.")
    @Positive(message = "Mã voucher không hợp lệ.")
    private Long maVoucher;

    @NotEmpty(message = "Giỏ hàng không có sản phẩm.")
    @Valid
    private List<ChiTietGioHangLocalRequestDto> danhSachChiTiet;
}