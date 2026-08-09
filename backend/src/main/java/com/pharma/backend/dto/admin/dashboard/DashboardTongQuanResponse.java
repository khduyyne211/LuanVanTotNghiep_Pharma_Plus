package com.pharma.backend.dto.admin.dashboard;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardTongQuanResponse {

    private long tongSanPham;

    private long tongKhachHang;

    private long tongNhanVien;

    private long donMoiHomNay;

    private long donDangXuLy;

    private BigDecimal doanhThuHomNay;

    private BigDecimal doanhThuThangNay;
}