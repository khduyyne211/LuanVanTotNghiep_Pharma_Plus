package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "khuyen_mai")
public class KhuyenMai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_khuyen_mai", nullable = false)
    private Long maKhuyenMai;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nhan_vien_tao", nullable = false)
    private NhanVienNoiBo nhanVienTao;

    @Column(name = "ten_chuong_trinh", nullable = false, length = 200)
    private String tenChuongTrinh;

    @Column(name = "loai_khuyen_mai", nullable = false, length = 50)
    private String loaiKhuyenMai;

    @Enumerated(EnumType.STRING)
    @Column(name = "kieu_giam_gia", nullable = false, length = 50)
    private KieuGiamGia kieuGiamGia;

    @Column(name = "gia_tri_giam", nullable = false, precision = 15, scale = 2)
    private BigDecimal giaTriGiam;

    @Column(name = "thoi_gian_bat_dau", nullable = false)
    private LocalDateTime thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc", nullable = false)
    private LocalDateTime thoiGianKetThuc;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "khuyen_mai_san_pham",
        joinColumns = @JoinColumn(name = "ma_khuyen_mai"),
        inverseJoinColumns = @JoinColumn(name = "ma_san_pham")
    )
    private Set<SanPham> danhSachSanPham = new HashSet<>();
}
