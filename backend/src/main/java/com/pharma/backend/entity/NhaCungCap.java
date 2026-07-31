package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng nha_cung_cap.
 */
@Getter
@Setter
@Entity
@Table(name = "nha_cung_cap")
public class NhaCungCap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nha_cung_cap", nullable = false)
    private Long maNhaCungCap;

    @Column(name = "ten_nha_cung_cap", nullable = false, length = 200)
    private String tenNhaCungCap;

    @Column(name = "so_dien_thoai", nullable = true, length = 20)
    private String soDienThoai;

    @Column(name = "dia_chi", nullable = true, length = 255)
    private String diaChi;

    @Column(name = "email", nullable = true, length = 255)
    private String email;

    @Column(name = "trang_thai_hop_tac", nullable = false)
    private Boolean trangThaiHopTac = true;

    @OneToMany(mappedBy = "nhaCungCap", fetch = FetchType.LAZY)
    private List<PhieuNhapKho> danhSachPhieuNhapKho = new ArrayList<>();
}
