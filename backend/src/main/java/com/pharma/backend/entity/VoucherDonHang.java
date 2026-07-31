package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng voucher_don_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "voucher_don_hang")
public class VoucherDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_voucher", nullable = false)
    private Long maVoucher;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nhan_vien_tao", nullable = false)
    private NhanVienNoiBo nhanVienTao;

    @Column(name = "ma_giam_gia", nullable = false, length = 50)
    private String maGiamGia;

    @Column(name = "ten_voucher", nullable = false, length = 200)
    private String tenVoucher;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_giam_gia", nullable = false, length = 50)
    private KieuGiamGia loaiGiamGia;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "gia_tri_giam", nullable = false, precision = 15, scale = 2)
    private BigDecimal giaTriGiam;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "so_tien_giam_toi_da", nullable = true, precision = 15, scale = 2)
    private BigDecimal soTienGiamToiDa;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "don_gia_toi_thieu", nullable = false, precision = 15, scale = 2)
    private BigDecimal donGiaToiThieu = new BigDecimal("0.00");

    @Column(name = "thoi_gian_bat_dau", nullable = false)
    private LocalDateTime thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc", nullable = false)
    private LocalDateTime thoiGianKetThuc;

    @Column(name = "so_luong_su_dung", nullable = false)
    private Integer soLuongSuDung;

    @Column(name = "so_luong_da_su_dung", nullable = false)
    private Integer soLuongDaSuDung = 0;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "voucherDonHang", fetch = FetchType.LAZY)
    private List<DonHang> danhSachDonHang = new ArrayList<>();
}
