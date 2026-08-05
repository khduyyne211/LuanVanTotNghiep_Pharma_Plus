package com.pharma.backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "vai_tro")
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_vai_tro", nullable = false)
    private Long maVaiTro;

    @Column(name = "ten_vai_tro", nullable = false, length = 50)
    private String tenVaiTro;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @ManyToMany(mappedBy = "danhSachVaiTro", fetch = FetchType.LAZY)
    private Set<TaiKhoan> danhSachTaiKhoan = new HashSet<>();
}