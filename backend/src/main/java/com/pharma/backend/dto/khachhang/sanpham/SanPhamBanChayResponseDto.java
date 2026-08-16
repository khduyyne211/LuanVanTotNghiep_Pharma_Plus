package com.pharma.backend.dto.khachhang.sanpham;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SanPhamBanChayResponseDto {

    private SanPhamResponseDto sanPham;

    /**
     * Số đơn hàng hoàn thành khác nhau có chứa sản phẩm
     * trong khoảng thời gian thống kê bán chạy.
     */
    private Long soLuotMua;
}