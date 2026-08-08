package com.pharma.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.dashboard.DashboardDoanhThuResponse;
import com.pharma.backend.dto.dashboard.DashboardLoSapHetHanResponse;
import com.pharma.backend.dto.dashboard.DashboardTonKhoThapResponse;
import com.pharma.backend.dto.dashboard.DashboardTongQuanResponse;
import com.pharma.backend.service.DashboardService;

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
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate tuNgay,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate denNgay
    ) {
        return dashboardService.layDoanhThuTheoKhoang(
                tuNgay,
                denNgay
        );
    }

    @GetMapping("/ton-kho-thap")
    public List<DashboardTonKhoThapResponse> layDanhSachTonKhoThap(
            @RequestParam(defaultValue = "10")
            BigDecimal nguongTon
    ) {
        return dashboardService.layDanhSachTonKhoThap(
                nguongTon
        );
    }

    @GetMapping("/lo-sap-het-han")
    public List<DashboardLoSapHetHanResponse> layDanhSachLoSapHetHan(
            @RequestParam(defaultValue = "30")
            int soNgay
    ) {
        return dashboardService.layDanhSachLoSapHetHan(
                soNgay
        );
    }
}