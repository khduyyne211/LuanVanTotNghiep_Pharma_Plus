package com.pharma.backend.service;

import java.math.BigDecimal;

/**
 * Kết quả tính giá của một đơn vị sản phẩm tại một thời điểm xác định.
 */
public record KetQuaTinhGiaSanPham(
        Long maSanPham,
        Long maDonViSanPham,
        BigDecimal giaGoc,
        BigDecimal tongPhanTramGiam,
        BigDecimal tongSoTienGiam,
        BigDecimal soTienGiamMoiDonVi,
        BigDecimal giaSauKhuyenMai,
        boolean coKhuyenMai,
        String cachTinhGia
) {
}