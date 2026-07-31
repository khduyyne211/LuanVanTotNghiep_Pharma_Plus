package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.pharma.backend.enums.giohang.TrangThaiGioHang;

/**
 * Entity ánh xạ bảng gio_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "gio_hang")
public class GioHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_gio_hang", nullable = false)
    private Long maGioHang;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_khach_hang", nullable = false)
    private KhachHang khachHang;

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_gio_hang", nullable = false, length = 30)
    private TrangThaiGioHang trangThaiGioHang = TrangThaiGioHang.DANG_SU_DUNG;

    @OneToMany(mappedBy = "gioHang", fetch = FetchType.LAZY)
    private List<ChiTietGioHang> danhSachChiTietGioHang = new ArrayList<>();

    @OneToOne(mappedBy = "gioHang", fetch = FetchType.LAZY)
    private DonHang donHang;
}
