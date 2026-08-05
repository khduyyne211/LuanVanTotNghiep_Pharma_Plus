package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.pharma.backend.enums.nhapkho.TrangThaiLo;

import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng chi_tiet_phieu_nhap.
 */
@Getter
@Setter
@Entity
@Table(name = "chi_tiet_phieu_nhap")
public class ChiTietPhieuNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_phieu_nhap", nullable = false)
    private Long maChiTietPhieuNhap;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_phieu_nhap", nullable = false)
    private PhieuNhapKho phieuNhapKho;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_vi_san_pham", nullable = false)
    private DonViSanPham donViSanPham;
    
    @Digits(integer = 12, fraction = 3)
    @Column(name = "so_luong_nhap", nullable = false, precision = 15, scale = 3)
    private BigDecimal soLuongNhap;

    @Digits(integer = 12, fraction = 3)
    @Column(name = "so_luong_theo_quy_doi", nullable = false, precision = 15, scale = 3)
    private BigDecimal soLuongTheoQuyDoi;

    @Digits(integer = 12, fraction = 3)
    @Column(name = "so_luong_con_lai_theo_quy_doi", nullable = false, precision = 15, scale = 3)
    private BigDecimal soLuongConLaiTheoQuyDoi = new BigDecimal("0.000");

    @Digits(integer = 13, fraction = 2)
    @Column(name = "don_gia_nhap", nullable = false, precision = 15, scale = 2)
    private BigDecimal donGiaNhap;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "thanh_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal thanhTien;

    @Column(name = "han_su_dung", nullable = false)
    private LocalDate hanSuDung;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_lo", nullable = false, length = 50)
    private TrangThaiLo trangThaiLo;
}
