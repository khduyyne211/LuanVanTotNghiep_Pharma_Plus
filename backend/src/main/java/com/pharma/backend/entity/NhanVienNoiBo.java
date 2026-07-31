package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng nhan_vien_noi_bo.
 */
@Getter
@Setter
@Entity
@Table(name = "nhan_vien_noi_bo")
public class NhanVienNoiBo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nhan_vien", nullable = false)
    private Long maNhanVien;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;
    
    @Column(name = "trang_thai_lam_viec", nullable = false)
    private Boolean trangThaiLamViec = true;

    @OneToMany(mappedBy = "nhanVienCapNhat", fetch = FetchType.LAZY)
    private List<CauHinhHeThong> danhSachCauHinhHeThongCapNhat = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienXuLy", fetch = FetchType.LAZY)
    private List<DonHang> danhSachDonHangXuLy = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienDuyet", fetch = FetchType.LAZY)
    private List<DonThuoc> danhSachDonThuocDuyet = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienTao", fetch = FetchType.LAZY)
    private List<KhuyenMai> danhSachKhuyenMaiTao = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienTao", fetch = FetchType.LAZY)
    private List<NoiDungSo> danhSachNoiDungSoTao = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienLap", fetch = FetchType.LAZY)
    private List<PhieuNhapKho> danhSachPhieuNhapKhoLap = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienTao", fetch = FetchType.LAZY)
    private List<VoucherDonHang> danhSachVoucherTao = new ArrayList<>();

    @OneToMany(mappedBy = "nhanVienTiepNhan", fetch = FetchType.LAZY)
    private List<YeuCauTuVan> danhSachYeuCauTuVanTiepNhan = new ArrayList<>();
}
