package com.pharma.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardDoanhThuTheoNgayResponse {

    private LocalDate ngay;

    private BigDecimal doanhThu;
}
