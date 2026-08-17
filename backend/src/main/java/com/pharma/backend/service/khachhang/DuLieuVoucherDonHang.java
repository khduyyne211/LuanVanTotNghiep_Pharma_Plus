package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;

import com.pharma.backend.entity.VoucherDonHang;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DuLieuVoucherDonHang {

    /*
     * null nếu khách không sử dụng voucher.
     */
    private final VoucherDonHang voucherDonHang;

    /*
     * Số tiền giảm thực tế của voucher.
     *
     * Không bao gồm khuyến mãi sản phẩm.
     */
    private final BigDecimal soTienGiam;
}