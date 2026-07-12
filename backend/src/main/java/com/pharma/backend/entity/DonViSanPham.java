package com.pharma.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "don_vi_san_pham")
@Getter
@Setter
public class DonViSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_vi_san_pham")
    private Long maDonViSanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_vi_tinh", nullable = false)
    private DonViTinh donViTinh;

    @Column(name = "gia_ban_theo_don_vi", precision = 12, scale = 2)
    private BigDecimal giaBanTheoDonVi;

    @Column(name = "la_don_vi_co_so", nullable = false)
    private Boolean laDonViCoSo;

    @Column(name = "cho_phep_ban", nullable = false)
    private Boolean choPhepBan;

    @Column(name = "cho_phep_nhap", nullable = false)
    private Boolean choPhepNhap;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;
}