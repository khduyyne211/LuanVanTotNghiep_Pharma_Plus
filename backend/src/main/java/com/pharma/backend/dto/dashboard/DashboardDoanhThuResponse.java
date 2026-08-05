package com.pharma.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardDoanhThuResponse {

    private LocalDate tuNgay;

    private LocalDate denNgay;

    private BigDecimal doanhThu;
}