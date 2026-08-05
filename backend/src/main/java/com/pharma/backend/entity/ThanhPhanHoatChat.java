package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng thanh_phan_hoat_chat.
 */
@Getter
@Setter
@Entity
@Table(name = "thanh_phan_hoat_chat")
public class ThanhPhanHoatChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thanh_phan", nullable = false)
    private Long maThanhPhan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_hoat_chat", nullable = false)
    private HoatChat hoatChat;

    @Digits(integer = 12, fraction = 3)
    @Column(name = "ham_luong", nullable = true, precision = 15, scale = 3)
    private BigDecimal hamLuong;

    @Column(name = "don_vi_ham_luong", nullable = true, length = 50)
    private String donViHamLuong;

    @Column(name = "vai_tro_hoat_chat", nullable = true, length = 100)
    private String vaiTroHoatChat;
    
    @Column(name = "ghi_chu", nullable = true, length = 255)
    private String ghiChu;
}
