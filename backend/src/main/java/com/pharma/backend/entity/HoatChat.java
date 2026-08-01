package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng hoat_chat.
 */
@Getter
@Setter
@Entity
@Table(name = "hoat_chat")
public class HoatChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hoat_chat", nullable = false)
    private Long maHoatChat;

    @Column(name = "ten_hoat_chat", nullable = false, length = 150)
    private String tenHoatChat;

    @Column(name = "don_vi", nullable = true, length = 50)
    private String donVi;

    @Column(name = "mo_ta", nullable = true, length = 255)
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "hoatChat", fetch = FetchType.LAZY)
    private List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat = new ArrayList<>();
}
