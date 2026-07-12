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
@Table(name = "quy_doi_don_vi")
@Getter
@Setter
public class QuyDoiDonVi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_quy_doi")
    private Long maQuyDoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_vi_nguon", nullable = false)
    private DonViSanPham donViNguon;

    @Column(name = "so_luong_nguon", nullable = false, precision = 12, scale = 3)
    private BigDecimal soLuongNguon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_vi_dich", nullable = false)
    private DonViSanPham donViDich;

    @Column(name = "so_luong_dich", nullable = false, precision = 12, scale = 3)
    private BigDecimal soLuongDich;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;
}