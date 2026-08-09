package com.pharma.backend.dto.admin.dashboard;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardTonKhoThapResponse {

    private Long maSanPham;

    private String tenSanPham;

    private BigDecimal tongSoLuongTon;

    private BigDecimal nguongTon;
}