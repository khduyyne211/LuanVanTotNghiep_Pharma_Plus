package com.pharma.backend.dto.khachhang.sanpham;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ThanhPhanHoatChatResponseDto {

    private Long maThanhPhan;

    private Long maHoatChat;

    private String tenHoatChat;

    private BigDecimal hamLuong;

    private String donViHamLuong;

    private String vaiTroHoatChat;

    private String ghiChu;
}