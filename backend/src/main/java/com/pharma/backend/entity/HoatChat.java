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
@Table(name = "hoat_chat")
@Getter
@Setter
public class HoatChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hoat_chat")
    private Long maHoatChat;

    @Column(
            name = "ten_hoat_chat",
            nullable = false,
            length = 150,
            unique = true
    )
    private String tenHoatChat;

    @Column(name = "don_vi", length = 50)
    private String donVi;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;
}