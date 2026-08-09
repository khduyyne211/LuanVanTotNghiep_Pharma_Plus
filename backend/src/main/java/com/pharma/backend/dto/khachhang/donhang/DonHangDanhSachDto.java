package com.pharma.backend.dto.khachhang.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.donhang.TrangThaiDonHang;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DonHangDanhSachDto {

    private Long maDonHang;

    private LocalDateTime ngayDatHang;

    private TrangThaiDonHang trangThaiDonHang;

    private BigDecimal tongThanhToan;

    private SanPhamDonHangTomTatDto sanPhamDauTien;

    private Integer soSanPhamKhac;
}
