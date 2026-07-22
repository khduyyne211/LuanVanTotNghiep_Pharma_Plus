package com.pharma.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "don_vi_tinh")
@Getter
@Setter
public class DonViTinh {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_vi_tinh")
    private Long maDonViTinh;

    @Column(name = "ten_don_vi_tinh", nullable = false, length = 50, unique = true)
    private String tenDonViTinh;

    @Column(name = "ky_hieu", length = 20)
    private String kyHieu;


    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;

}
