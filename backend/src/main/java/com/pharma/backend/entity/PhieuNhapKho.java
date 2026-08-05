package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.pharma.backend.enums.nhapkho.TrangThaiPhieuNhap;

/**
 * Entity ánh xạ bảng phieu_nhap_kho.
 */
@Getter
@Setter
@Entity
@Table(name = "phieu_nhap_kho")
public class PhieuNhapKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_nhap", nullable = false)
    private Long maPhieuNhap;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nha_cung_cap", nullable = false)
    private NhaCungCap nhaCungCap;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nhan_vien_lap", nullable = false)
    private NhanVienNoiBo nhanVienLap;

    @CreationTimestamp
    @Column(name = "ngay_nhap", nullable = false)
    private LocalDateTime ngayNhap;
    
    @Digits(integer = 13, fraction = 2)
    @Column(name = "tong_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongTien = new BigDecimal("0.00");

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_phieu_nhap", nullable = false, length = 50)
    private TrangThaiPhieuNhap trangThaiPhieuNhap = TrangThaiPhieuNhap.CHO_XAC_NHAN;

    @Column(name = "ghi_chu", nullable = true, columnDefinition = "TEXT")
    private String ghiChu;

    @OneToMany(mappedBy = "phieuNhapKho", fetch = FetchType.LAZY)
    private List<ChiTietPhieuNhap> danhSachChiTietPhieuNhap = new ArrayList<>();
}
