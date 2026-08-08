package com.pharma.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardLoSapHetHanResponse {

    private Long maChiTietPhieuNhap;

    private Long maPhieuNhap;

    private Long maSanPham;

    private String tenSanPham;

    private Long maDonViSanPham;

    private String tenDonViTinh;

    private BigDecimal soLuongConLai;

    private LocalDate hanSuDung;

    private long soNgayConLai;

    private String mucCanhBao;
}