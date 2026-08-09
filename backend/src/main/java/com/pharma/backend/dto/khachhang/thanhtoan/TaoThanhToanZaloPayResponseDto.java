package com.pharma.backend.dto.khachhang.thanhtoan;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaoThanhToanZaloPayResponseDto {

    private Long maDonHang;
    private String appTransId;
    private Long soTien;
    private String orderUrl;
    private Long thoiGianHieuLucGiay;
    private String trangThaiThanhToan;
}