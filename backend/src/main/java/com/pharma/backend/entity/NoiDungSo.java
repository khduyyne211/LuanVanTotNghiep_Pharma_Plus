package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.pharma.backend.enums.noidung.LoaiNoiDung;

/**
 * Entity ánh xạ bảng noi_dung_so.
 */
@Getter
@Setter
@Entity
@Table(name = "noi_dung_so")
public class NoiDungSo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_noi_dung", nullable = false)
    private Long maNoiDung;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nhan_vien_tao", nullable = false)
    private NhanVienNoiBo nhanVienTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_noi_dung", nullable = false, length = 50)
    private LoaiNoiDung loaiNoiDung;

    @Column(name = "tieu_de", nullable = false, length = 255)
    private String tieuDe;

    @Column(name = "noi_dung", nullable = true, columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "hinh_anh", nullable = true, length = 500)
    private String hinhAnh;

    @Column(name = "vi_tri_hien_thi", nullable = true, length = 100)
    private String viTriHienThi;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true;

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;
}
