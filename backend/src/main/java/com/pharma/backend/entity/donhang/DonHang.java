package com.pharma.backend.entity.donhang;

import java.math.BigDecimal;
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
@Table(name = "don_hang")
@Getter
@Setter
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_hang")
    private Long maDonHang;

    @Column(name = "ma_khach_hang")
    private Long maKhachHang;

    @Column(name = "ma_dia_chi")
    private Long maDiaChi;

    @Column(name = "ma_voucher")
    private Long maVoucher;

    @Column(name = "ma_don_thuoc")
    private Long maDonThuoc;

    @Column(name = "ma_nhan_vien_xu_ly")
    private Long maNhanVienXuLy;

    @Column(name = "ma_duoc_si_duyet")
    private Long maDuocSiDuyet;

    @Column(name = "ngay_dat_hang", nullable = false)
    private LocalDateTime ngayDatHang;

    @Column(name = "loai_khach", length = 30)
    private String loaiKhach;

    @Column(name = "tong_tien_hang", nullable = false, precision = 12, scale = 2)
    private BigDecimal tongTienHang;

    @Column(name = "phi_giao_hang", precision = 12, scale = 2)
    private BigDecimal phiGiaoHang;

    @Column(name = "giam_gia", precision = 12, scale = 2)
    private BigDecimal giamGia;

    @Column(name = "tong_thanh_toan", nullable = false, precision = 12, scale = 2)
    private BigDecimal tongThanhToan;

    @Column(name = "phuong_thuc_thanh_toan", length = 50)
    private String phuongThucThanhToan;

    @Column(name = "trang_thai_thanh_toan", length = 30)
    private String trangThaiThanhToan;

    @Column(name = "trang_thai_don_hang", nullable = false, length = 30)
    private String trangThaiDonHang;

    @Column(name = "trang_thai_kiem_duyet", nullable = false, length = 30)
    private String trangThaiKiemDuyet;

    @Column(name = "ngay_kiem_duyet")
    private LocalDateTime ngayKiemDuyet;

    @Column(name = "ghi_chu_kiem_duyet", length = 255)
    private String ghiChuKiemDuyet;

    @Column(name = "ly_do_tu_choi_duyet", length = 255)
    private String lyDoTuChoiDuyet;

    @Column(name = "ghi_chu", length = 255)
    private String ghiChu;
}
