package com.pharma.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name= "thanh_phan_hoat_chat")
@Getter
@Setter
public class ThanhPhanHoatChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thanh_phan")
    private Long maThanhPhan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_hoat_chat", nullable = false)
    private HoatChat hoatChat;

    @Column(name = "ham_luong", precision = 12, scale = 3)
    private BigDecimal hamLuong;

    @Column(name = "don_vi_ham_luong", length = 50)
    private String donViHamLuong;

    @Column(name = "vai_tro_hoat_chat", length = 100)
    private String vaiTroHoatChat;

    @Column(name = "ghi_chu", length = 255)
    private String ghiChu;
}
