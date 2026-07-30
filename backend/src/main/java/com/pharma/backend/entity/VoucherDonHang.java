package com.pharma.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "voucher_don_hang")
@Getter
@Setter
public class VoucherDonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maVoucher;

    @Column(name= "ma_giam_gia", nullable = false, length = 10)
    private String maGiamGia;

    @Column(name = "ten_voucher", nullable = false, length = 50)
    private String tenVoucher;

    @Column(name = "loai_giam_gia", nullable = false)
    private String loaiGiamGia;

    @Column(name = "gia_tri_giam")
    private BigDecimal giaTriGiam;

    @Column(name = "so_tien_giam_toi_da")
    private BigDecimal soTienGiamToiDa;

    @Column(name = "don_gia_toi_thieu")
    private BigDecimal donGiaToiThieu;

    @Column(name = "thoi_gian_bat_dau")
    private LocalDateTime thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc")
    private LocalDateTime thoiGianKetThuc;

    @Column(name = "so_luong_su_dung")
    private Integer soLuongSuDung;

    @Column(name= "so_luong_da_su_dung")
    private Integer soLuongDaSuDung;

    @Column(name = "trang_thai")
    private Boolean trangThai;
    
}
