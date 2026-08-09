package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

// ChuanBiThanhToanZaloPayService
// → trả kết quả kiểm tra đơn

// ThanhToanZaloPayService
// → dùng kết quả để gọi ZaloPay
@Getter
@AllArgsConstructor
public class DuLieuChuanBiThanhToanZaloPay {

    private final Long maDonHang;

    private final BigDecimal tongThanhToan;

    private final Long thoiGianHieuLucGiay;

    private final boolean daHetHan;
}