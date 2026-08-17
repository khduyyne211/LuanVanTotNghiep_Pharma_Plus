package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.pharma.backend.enums.tuvan.HinhThucLienHe;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

/**
 * Entity ánh xạ bảng yeu_cau_tu_van.
 */
@Getter
@Setter
@Entity
@Table(name = "yeu_cau_tu_van")
public class YeuCauTuVan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_yeu_cau_tu_van", nullable = false)
    private Long maYeuCauTuVan;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_khach_hang", nullable = true)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_nhan_vien_tiep_nhan", nullable = true)
    private NhanVienNoiBo nhanVienTiepNhan;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_san_pham", nullable = true)
    private SanPham sanPham;

    @Column(name = "ten_khach_hang", nullable = false, length = 100)
    private String tenKhachHang;

    @Column(name = "noi_dung_can_tu_van", nullable = false, columnDefinition = "TEXT")
    private String noiDungCanTuVan;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    @Enumerated(EnumType.STRING)
    @Column(name = "hinh_thuc_lien_he", length = 50)
    private HinhThucLienHe hinhThucLienHe;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_tu_van", nullable = false, length = 30)
    private TrangThaiTuVan trangThaiTuVan = TrangThaiTuVan.CHO_TIEP_NHAN;

    @Column(name = "ket_qua_tu_van", nullable = true, columnDefinition = "TEXT")
    private String ketQuaTuVan;

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @OneToOne(mappedBy = "yeuCauTuVan", fetch = FetchType.LAZY)
    private DonHang donHang;
}
