package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng don_vi_san_pham.
 */
@Getter
@Setter
@Entity
@Table(name = "don_vi_san_pham")
public class DonViSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_vi_san_pham", nullable = false)
    private Long maDonViSanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_don_vi_tinh", nullable = false)
    private DonViTinh donViTinh;

    @Column(name = "la_don_vi_co_so", nullable = false)
    private Boolean laDonViCoSo = false;

    @Column(name = "la_don_vi_ban_mac_dinh", nullable = false)
    private Boolean laDonViBanMacDinh = false;

    @Column(name = "cho_phep_nhap", nullable = false)
    private Boolean choPhepNhap = false;

    @Column(name = "cho_phep_ban", nullable = false)
    private Boolean choPhepBan = false;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "gia_ban_theo_don_vi", nullable = true, precision = 15, scale = 2)
    private BigDecimal giaBanTheoDonVi;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "donViNguon", fetch = FetchType.LAZY)
    private List<QuyDoiDonVi> danhSachQuyDoiNguon = new ArrayList<>();

    @OneToMany(mappedBy = "donViDich", fetch = FetchType.LAZY)
    private List<QuyDoiDonVi> danhSachQuyDoiDich = new ArrayList<>();

    @OneToMany(mappedBy = "donViSanPham", fetch = FetchType.LAZY)
    private List<ChiTietGioHang> danhSachChiTietGioHang = new ArrayList<>();

    @OneToMany(mappedBy = "donViSanPham", fetch = FetchType.LAZY)
    private List<ChiTietDonHang> danhSachChiTietDonHang = new ArrayList<>();

    @OneToMany(mappedBy = "donViSanPham", fetch = FetchType.LAZY)
    private List<ChiTietPhieuNhap> danhSachChiTietPhieuNhap = new ArrayList<>();
}
