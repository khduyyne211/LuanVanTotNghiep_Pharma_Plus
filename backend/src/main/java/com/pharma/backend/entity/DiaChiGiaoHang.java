package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng dia_chi_giao_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "dia_chi_giao_hang")
public class DiaChiGiaoHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_dia_chi", nullable = false)
    private Long maDiaChi;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_khach_hang", nullable = false)
    private KhachHang khachHang;
    
    @Column(name = "ten_nguoi_nhan", nullable = false, length = 100)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai_nhan", nullable = false, length = 20)
    private String soDienThoaiNhan;

    @Column(name = "thanh_pho", nullable = false, length = 100)
    private String thanhPho;

    @Column(name = "phuong_khu_vuc", nullable = false, length = 150)
    private String phuongKhuVuc;

    @Column(name = "dia_chi_chi_tiet", nullable = true, length = 255)
    private String diaChiChiTiet;

    @Column(name = "la_mac_dinh", nullable = false)
    private Boolean laMacDinh = false;
    
    @Column(name = "trang_thai_su_dung", nullable = false)
    private Boolean trangThaiSuDung = true;

    @OneToMany(mappedBy = "diaChiGiaoHang", fetch = FetchType.LAZY)
    private List<DonHang> danhSachDonHang = new ArrayList<>();
}
