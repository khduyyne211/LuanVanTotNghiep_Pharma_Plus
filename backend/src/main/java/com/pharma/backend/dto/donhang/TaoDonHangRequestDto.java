package com.pharma.backend.dto.donhang;

import com.pharma.backend.enums.donhang.PhuongThucThanhToan;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaoDonHangRequestDto {

    private Long maDiaChi;

    private PhuongThucThanhToan phuongThucThanhToan;

    private String ghiChu;
}
