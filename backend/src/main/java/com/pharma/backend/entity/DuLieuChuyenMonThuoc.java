package com.pharma.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng du_lieu_chuyen_mon_thuoc.
 */
@Getter
@Setter
@Entity
@Table(name = "du_lieu_chuyen_mon_thuoc")
public class DuLieuChuyenMonThuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_du_lieu_chuyen_mon", nullable = false)
    private Long maDuLieuChuyenMon;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private SanPham sanPham;

    @Column(name = "dang_bao_che", nullable = true, length = 100)
    private String dangBaoChe;

    @Column(name = "cong_dung_tham_khao", nullable = true, columnDefinition = "TEXT")
    private String congDungThamKhao;

    @Column(name = "cach_dung_tham_khao", nullable = true, columnDefinition = "TEXT")
    private String cachDungThamKhao;

    @Column(name = "canh_bao_an_toan", nullable = true, columnDefinition = "TEXT")
    private String canhBaoAnToan;

    @Column(name = "phan_loai_thuoc", nullable = true, length = 100)
    private String phanLoaiThuoc;
    
    @Column(name = "trang_thai_xac_nhan", nullable = false)
    private Boolean trangThaiXacNhan = false;
}
