package com.pharma.backend.dto.admin.dashboard;

import com.pharma.backend.enums.donhang.TrangThaiDonHang;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardTrangThaiDonHangResponse {

    private TrangThaiDonHang trangThai;

    private long soLuong;
}