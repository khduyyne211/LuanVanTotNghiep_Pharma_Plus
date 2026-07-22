package com.pharma.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "don_thuoc")
@Getter
@Setter
public class DonThuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_thuoc")
    private Long maDonThuoc;

    @Column(name = "ma_khach_hang", nullable = false)
    private Long maKhachHang;

    @Column(name = "ma_nhan_vien_duyet")
    private Long maNhanVienDuyet;

    @Column(name = "anh_don_thuoc", nullable = false, length = 255)
    private String anhDonThuoc;

    @Column(name = "ngay_upload", nullable = false, insertable = false, updatable = false)
    private LocalDateTime ngayUpload;

    @Column(name = "trang_thai_don_thuoc", nullable = false, length = 30)
    private String trangThaiDonThuoc = "CHO_DUYET";

    @Column(name = "ly_do_tu_choi", length = 255)
    private String lyDoTuChoi;

    @Column(name = "ghi_chu_duoc_si", columnDefinition = "TEXT")
    private String ghiChuDuocSi;

    @Column(name = "ket_qua_kiem_duyet", length = 50)
    private String ketQuaKiemDuyet;
}
