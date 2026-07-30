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
@Table(name = "nha_cung_cap")
@Getter
@Setter
public class NhaCungCap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nha_cung_cap")
    private Long maNhaCungCap;

    @Column(name = "ten_nha_cung_cap", nullable = false, length = 150)
    private String tenNhaCungCap;

    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "trang_thai_hop_tac", nullable = false)
    private Boolean trangThaiHopTac;
}