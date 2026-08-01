package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Entity ánh xạ bảng nhat_ky_hoat_dong.
 */
@Getter
@Setter
@Entity
@Table(name = "nhat_ky_hoat_dong")
public class NhatKyHoatDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nhat_ky", nullable = false)
    private Long maNhatKy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    @Column(name = "nhom_thao_tac", nullable = true, length = 100)
    private String nhomThaoTac;

    @Column(name = "loai_thao_tac", nullable = false, length = 150)
    private String loaiThaoTac;

    @Column(name = "doi_tuong_tac_dong", nullable = true, length = 100)
    private String doiTuongTacDong;

    @Column(name = "noi_dung_thay_doi", nullable = true, columnDefinition = "TEXT")
    private String noiDungThayDoi;

    @CreationTimestamp
    @Column(name = "thoi_gian_thuc_hien", nullable = false)
    private LocalDateTime thoiGianThucHien;
    
    @Column(name = "dia_chi_ip", nullable = true, length = 50)
    private String diaChiIp;
}
