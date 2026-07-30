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
@Table(name = "vai_tro")
@Getter
@Setter
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham")
    private Long maVaiTro;

    @Column(name = "ten_vai_tro", nullable = false, length = 50)
    private String tenVaiTro;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Integer trangThai;
}