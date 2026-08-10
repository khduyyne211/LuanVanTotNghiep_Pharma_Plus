package com.pharma.backend.dto.admin.sanpham;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThanhPhanHoatChatTaoMoiRequest {

    private Long maHoatChat;
    private BigDecimal hamLuong;
    private String donViHamLuong;
    private String vaiTroHoatChat;
    private String ghiChu;
}