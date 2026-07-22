package com.pharma.backend.entity.donhang;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chi_tiet_don_hang")
@Getter
@Setter
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_don_hang")
    private Long maChiTietDonHang;

    @Column(name = "ma_don_hang", nullable = false)
    private Long maDonHang;

    @Column(name = "ma_san_pham", nullable = false)
    private Long maSanPham;

    @Column(name = "ma_don_vi_san_pham", nullable = false)
    private Long maDonViSanPham;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "don_gia", nullable = false, precision = 12, scale = 2)
    private BigDecimal donGia;

    @Column(name = "giam_gia", precision = 12, scale = 2)
    private BigDecimal giamGia;

    @Column(name = "thanh_tien", nullable = false, precision = 12, scale = 2)
    private BigDecimal thanhTien;

    @Column(name = "cach_tinh_gia", length = 100)
    private String cachTinhGia;
}
