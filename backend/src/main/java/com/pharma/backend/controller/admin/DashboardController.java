package com.pharma.backend.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.dashboard.DashboardTongQuanResponse;
import com.pharma.backend.service.admin.DashboardService;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import com.pharma.backend.dto.admin.dashboard.DashboardDoanhThuResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/tong-quan")
    public DashboardTongQuanResponse layTongQuan() {
        return dashboardService.layTongQuan();
    }

    @GetMapping("/doanh-thu")
    public DashboardDoanhThuResponse layDoanhThuTheoKhoang(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay) {
        return dashboardService.layDoanhThuTheoKhoang(
                tuNgay,
                denNgay);
    }
}