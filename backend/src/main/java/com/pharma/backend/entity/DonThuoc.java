package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;

/**
 * Entity ánh xạ bảng don_thuoc.
 */
@Getter
@Setter
@Entity
@Table(name = "don_thuoc")
public class DonThuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_thuoc", nullable = false)
    private Long maDonThuoc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_khach_hang", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_nhan_vien_duyet", nullable = true)
    private NhanVienNoiBo nhanVienDuyet;

    @Column(name = "anh_don_thuoc", nullable = false, length = 500)
    private String anhDonThuoc;

    @CreationTimestamp
    @Column(name = "ngay_upload", nullable = false)
    private LocalDateTime ngayUpload;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_don_thuoc", nullable = false, length = 30)
    private TrangThaiDonThuoc trangThaiDonThuoc = TrangThaiDonThuoc.CHO_DUYET;

    @Column(name = "ly_do_tu_choi", nullable = true, length = 255)
    private String lyDoTuChoi;

    @Column(name = "ghi_chu", nullable = true, columnDefinition = "TEXT")
    private String ghiChu;

    @OneToOne(mappedBy = "donThuoc", fetch = FetchType.LAZY)
    private DonHang donHang;
}
