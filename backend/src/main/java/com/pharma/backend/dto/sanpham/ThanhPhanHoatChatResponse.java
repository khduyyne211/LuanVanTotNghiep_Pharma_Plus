package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ThanhPhanHoatChatResponse {

    private Long maThanhPhan;

    private Long maHoatChat;
    private String tenHoatChat;

    private BigDecimal hamLuong;
    private String donViHamLuong;
    private String vaiTroHoatChat;
    private String ghiChu;
}