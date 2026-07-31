package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng danh_muc_san_pham.
 */
@Getter
@Setter
@Entity
@Table(name = "danh_muc_san_pham")
public class DanhMucSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_muc", nullable = false)
    private Long maDanhMuc;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_danh_muc_cha", nullable = true)
    private DanhMucSanPham danhMucCha;

    @Column(name = "ten_danh_muc", nullable = false, length = 150)
    private String tenDanhMuc;

    @Column(name = "mo_ta", nullable = true, length = 255)
    private String moTa;

    @Column(name = "thu_tu_hien_thi", nullable = true)
    private Integer thuTuHienThi;

    @Column(name = "trang_thai_hien_thi", nullable = false)
    private Boolean trangThaiHienThi = true;

    @OneToMany(mappedBy = "danhMucCha", fetch = FetchType.LAZY)
    private List<DanhMucSanPham> danhSachDanhMucCon = new ArrayList<>();

    @OneToMany(mappedBy = "danhMuc", fetch = FetchType.LAZY)
    private List<SanPham> danhSachSanPham = new ArrayList<>();
}
