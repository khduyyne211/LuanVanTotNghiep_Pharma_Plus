package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng chi_tiet_don_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "chi_tiet_don_hang")
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_don_hang", nullable = false)
    private Long maChiTietDonHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_hang", nullable = false)
    private DonHang donHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_vi_san_pham", nullable = false)
    private DonViSanPham donViSanPham;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "don_gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal donGia;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "giam_gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal giamGia = new BigDecimal("0.00");

    @Digits(integer = 13, fraction = 2)
    @Column(name = "thanh_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal thanhTien;
    
    @Column(name = "cach_tinh_gia", nullable = true, length = 100)
    private String cachTinhGia;
}
