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
@Table(name = "khuyen_mai")
@Getter
@Setter
public class KhuyenMai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_khuyen_mai")
    private Long maKhuyenMai;

    @Column(name = "ten_chuong_trinh", nullable = false, length = 150)
    private String tenChuongTrinh;

    @Column(name = "loai_khuyen_mai", length = 50)
    private String loaiKhuyenMai;

    @Column(name = "giam_gia", precision = 12, scale = 2)
    private BigDecimal giamGia;

    @Column(name = "gia_tri_giam", precision = 12, scale = 2)
    private BigDecimal giaTriGiam;

    @Column(name = "thoi_gian_bat_dau", nullable = false)
    private LocalDateTime thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc", nullable = false)
    private LocalDateTime thoiGianKetThuc;

    @Column(name = "trang_thai_khuyen_mai", nullable = false, length = 30)
    private String trangThaiKhuyenMai = "CHUA_BAT_DAU";
}