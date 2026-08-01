package com.pharma.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@Table(name = "san_pham")
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham", nullable = false)
    private Long maSanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_danh_muc", nullable = false)
    private DanhMucSanPham danhMuc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nha_san_xuat", nullable = false)
    private NhaSanXuat nhaSanXuat;

    @Column(name = "ten_san_pham", nullable = false, length = 150)
    private String tenSanPham;

    @Column(name = "hinh_anh", length = 500)
    private String hinhAnh;

    @Column(name = "la_thuoc_ke_don", nullable = false)
    private Boolean laThuocKeDon = false;

    @Column(name = "trang_thai_san_pham", nullable = false)
    private Boolean trangThaiSanPham = true;

    @Column(name = "mo_ta_ngan", length = 255)
    private String moTaNgan;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<DonViSanPham> danhSachDonViSanPham = new ArrayList<>();

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat = new ArrayList<>();

    @OneToOne(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private DuLieuChuyenMonThuoc duLieuChuyenMonThuoc;

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<QuyDoiDonVi> danhSachQuyDoiDonVi = new ArrayList<>();

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<ChiTietGioHang> danhSachChiTietGioHang = new ArrayList<>();

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<ChiTietDonHang> danhSachChiTietDonHang = new ArrayList<>();

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<ChiTietPhieuNhap> danhSachChiTietPhieuNhap = new ArrayList<>();

    @ManyToMany(mappedBy = "danhSachSanPham", fetch = FetchType.LAZY)
    private Set<KhuyenMai> danhSachKhuyenMai = new HashSet<>();

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<YeuCauTuVan> danhSachYeuCauTuVan = new ArrayList<>();
}
