package com.pharma.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;

/**
 * Entity ánh xạ bảng don_hang.
 */
@Getter
@Setter
@Entity
@Table(name = "don_hang")
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_hang", nullable = false)
    private Long maDonHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_khach_hang", nullable = true)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_dia_chi", nullable = true)
    private DiaChiGiaoHang diaChiGiaoHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_voucher", nullable = true)
    private VoucherDonHang voucherDonHang;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_don_thuoc", nullable = true)
    private DonThuoc donThuoc;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_yeu_cau_tu_van", nullable = true, unique = true)
    private YeuCauTuVan yeuCauTuVan;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_gio_hang", nullable = true)
    private GioHang gioHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_nhan_vien_xu_ly", nullable = true)
    private NhanVienNoiBo nhanVienXuLy;

    @CreationTimestamp
    @Column(name = "ngay_dat_hang", nullable = false)
    private LocalDateTime ngayDatHang;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_khach", nullable = true, length = 30)
    private LoaiKhachHang loaiKhach;

    @Digits(integer = 13, fraction = 2)
    @Column(name = "tong_tien_hang", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongTienHang = new BigDecimal("0.00");

    @Digits(integer = 13, fraction = 2)
    @Column(name = "phi_giao_hang", nullable = false, precision = 15, scale = 2)
    private BigDecimal phiGiaoHang = new BigDecimal("0.00");

    @Digits(integer = 13, fraction = 2)
    @Column(name = "giam_gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal giamGia = new BigDecimal("0.00");

    @Digits(integer = 13, fraction = 2)
    @Column(name = "tong_thanh_toan", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongThanhToan = new BigDecimal("0.00");

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan", length = 50)
    private PhuongThucThanhToan phuongThucThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_thanh_toan", nullable = false, length = 30)
    private TrangThaiThanhToan trangThaiThanhToan = TrangThaiThanhToan.CHO_THANH_TOAN;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_don_hang", nullable = false, length = 30)
    private TrangThaiDonHang trangThaiDonHang = TrangThaiDonHang.CHO_XU_LY;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_kiem_duyet", nullable = false, length = 30)
    private TrangThaiKiemDuyetDonHang trangThaiKiemDuyet = TrangThaiKiemDuyetDonHang.KHONG_CAN_DUYET;

    @Column(name = "ngay_kiem_duyet", nullable = true)
    private LocalDateTime ngayKiemDuyet;

    @Column(name = "ghi_chu_kiem_duyet", nullable = true, length = 255)
    private String ghiChuKiemDuyet;

    @Column(name = "ly_do_tu_choi_duyet", nullable = true, length = 255)
    private String lyDoTuChoiDuyet;

    @Column(name = "ghi_chu", nullable = true, length = 255)
    private String ghiChu;

    @OneToMany(mappedBy = "donHang", fetch = FetchType.LAZY)
    private List<ChiTietDonHang> danhSachChiTietDonHang = new ArrayList<>();
}
