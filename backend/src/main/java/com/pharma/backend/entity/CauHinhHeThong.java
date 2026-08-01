package com.pharma.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng cau_hinh_he_thong.
 */
@Getter
@Setter
@Entity
@Table(name = "cau_hinh_he_thong")
public class CauHinhHeThong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_cau_hinh", nullable = false)
    private Long maCauHinh;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nhan_vien_cap_nhat", nullable = false)
    private NhanVienNoiBo nhanVienCapNhat;

    @Column(name = "nhom_cau_hinh", nullable = false, length = 100)
    private String nhomCauHinh;

    @Column(name = "ten_cau_hinh", nullable = false, length = 150)
    private String tenCauHinh;

    @Column(name = "gia_tri_cau_hinh", nullable = false, columnDefinition = "TEXT")
    private String giaTriCauHinh;
    
    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;
}
