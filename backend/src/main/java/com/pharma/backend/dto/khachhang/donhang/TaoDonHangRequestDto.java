package com.pharma.backend.dto.khachhang.donhang;

import com.pharma.backend.enums.donhang.PhuongThucThanhToan;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaoDonHangRequestDto {

    private Long maDiaChi;

    private PhuongThucThanhToan phuongThucThanhToan;

    private Long maVoucher;

    private String ghiChu;
}
