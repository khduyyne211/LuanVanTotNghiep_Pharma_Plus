package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.pharma.backend.enums.common.GioiTinh;

import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng khach_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "khach_hang")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_khach_hang", nullable = false)
    private Long maKhachHang;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh", length = 20)
    private GioiTinh gioiTinh;

    @Column(name = "ngay_sinh", nullable = true)
    private LocalDate ngaySinh;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<DiaChiGiaoHang> danhSachDiaChiGiaoHang = new ArrayList<>();

    @OneToOne(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private GioHang gioHang;

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<DonHang> danhSachDonHang = new ArrayList<>();

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<DonThuoc> danhSachDonThuoc = new ArrayList<>();

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<YeuCauTuVan> danhSachYeuCauTuVan = new ArrayList<>();
}
