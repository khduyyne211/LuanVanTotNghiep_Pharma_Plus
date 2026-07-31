package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng quy_doi_don_vi.
 */
@Getter
@Setter
@Entity
@Table(name = "quy_doi_don_vi")
public class QuyDoiDonVi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_quy_doi", nullable = false)
    private Long maQuyDoi;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_vi_nguon", nullable = false)
    private DonViSanPham donViNguon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_vi_dich", nullable = false)
    private DonViSanPham donViDich;

    @Digits(integer = 12, fraction = 3)
    @Column(name = "so_luong_nguon", nullable = false, precision = 15, scale = 3)
    private BigDecimal soLuongNguon;

    @Digits(integer = 12, fraction = 3)
    @Column(name = "so_luong_dich", nullable = false, precision = 15, scale = 3)
    private BigDecimal soLuongDich;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;
}
