package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng don_vi_tinh.
 */
@Getter
@Setter
@Entity
@Table(name = "don_vi_tinh")
public class DonViTinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_vi_tinh", nullable = false)
    private Long maDonViTinh;

    @Column(name = "ten_don_vi_tinh", nullable = false, length = 50)
    private String tenDonViTinh;

    @Column(name = "ky_hieu", nullable = true, length = 20)
    private String kyHieu;

    @Column(name = "mo_ta", nullable = true, length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "donViTinh", fetch = FetchType.LAZY)
    private List<DonViSanPham> danhSachDonViSanPham = new ArrayList<>();
}
