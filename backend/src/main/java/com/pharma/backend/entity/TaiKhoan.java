package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_tai_khoan", nullable = false)
    private Long maTaiKhoan;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column(name = "mat_khau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "trang_thai_tai_khoan", nullable = false)
    private Boolean trangThaiTaiKhoan = true;

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "tai_khoan_vai_tro",
        joinColumns = @JoinColumn(name = "ma_tai_khoan"),
        inverseJoinColumns = @JoinColumn(name = "ma_vai_tro")
    )
    private Set<VaiTro> danhSachVaiTro = new HashSet<>();

    @OneToOne(mappedBy = "taiKhoan", fetch = FetchType.LAZY)
    private KhachHang khachHang;

    @OneToOne(mappedBy = "taiKhoan", fetch = FetchType.LAZY)
    private NhanVienNoiBo nhanVienNoiBo;
}