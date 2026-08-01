package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng nha_san_xuat.
 */
@Getter
@Setter
@Entity
@Table(name = "nha_san_xuat")
public class NhaSanXuat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nha_san_xuat", nullable = false)
    private Long maNhaSanXuat;

    @Column(name = "ten_nha_san_xuat", nullable = false, length = 150)
    private String tenNhaSanXuat;

    @Column(name = "quoc_gia", nullable = true, length = 100)
    private String quocGia;

    @Column(name = "dia_chi", nullable = true, length = 255)
    private String diaChi;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "nhaSanXuat", fetch = FetchType.LAZY)
    private List<SanPham> danhSachSanPham = new ArrayList<>();
}
