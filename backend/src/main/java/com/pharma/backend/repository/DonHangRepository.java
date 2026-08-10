package com.pharma.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.dto.admin.donhang.DonHangChiTietProjection;
import com.pharma.backend.dto.admin.donhang.DonHangDanhSachProjection;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;

import jakarta.persistence.LockModeType;

public interface DonHangRepository extends JpaRepository<DonHang, Long> {

    @Query(
        value = """
            SELECT
                dh.ma_don_hang AS maDonHang,
                dh.ma_khach_hang AS maKhachHang,
                kh.ho_ten AS tenKhachHang,
                tk.so_dien_thoai AS soDienThoaiKhachHang,
                dh.ma_don_thuoc AS maDonThuoc,
                dh.ma_nhan_vien_xu_ly AS maNhanVienXuLy,
                nv.ho_ten AS tenNhanVienXuLy,
                dh.ngay_dat_hang AS ngayDatHang,
                dh.loai_khach AS loaiKhach,
                dh.tong_tien_hang AS tongTienHang,
                dh.phi_giao_hang AS phiGiaoHang,
                dh.giam_gia AS giamGia,
                dh.tong_thanh_toan AS tongThanhToan,
                dh.phuong_thuc_thanh_toan AS phuongThucThanhToan,
                dh.trang_thai_thanh_toan AS trangThaiThanhToan,
                dh.trang_thai_don_hang AS trangThaiDonHang,
                dh.trang_thai_kiem_duyet AS trangThaiKiemDuyet,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM chi_tiet_don_hang ctdh
                        JOIN san_pham sp
                            ON sp.ma_san_pham = ctdh.ma_san_pham
                        WHERE ctdh.ma_don_hang = dh.ma_don_hang
                          AND sp.la_thuoc_ke_don = 1
                    )
                    THEN 1
                    ELSE 0
                END AS coThuocKeDon
            FROM don_hang dh
            LEFT JOIN khach_hang kh
                ON kh.ma_khach_hang = dh.ma_khach_hang
            LEFT JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            LEFT JOIN nhan_vien_noi_bo nv
                ON nv.ma_nhan_vien = dh.ma_nhan_vien_xu_ly
            WHERE (
                :keyword IS NULL
                OR :keyword = ''
                OR CAST(dh.ma_don_hang AS CHAR) LIKE CONCAT('%', :keyword, '%')
                OR LOWER(kh.ho_ten) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR tk.so_dien_thoai LIKE CONCAT('%', :keyword, '%')
            )
            AND (
                :trangThaiDonHang IS NULL
                OR :trangThaiDonHang = ''
                OR dh.trang_thai_don_hang = :trangThaiDonHang
            )
            AND (
                :trangThaiThanhToan IS NULL
                OR :trangThaiThanhToan = ''
                OR dh.trang_thai_thanh_toan = :trangThaiThanhToan
            )
            AND (
                :trangThaiKiemDuyet IS NULL
                OR :trangThaiKiemDuyet = ''
                OR dh.trang_thai_kiem_duyet = :trangThaiKiemDuyet
            )
            ORDER BY dh.ngay_dat_hang DESC
            """,
        countQuery = """
            SELECT COUNT(*)
            FROM don_hang dh
            LEFT JOIN khach_hang kh
                ON kh.ma_khach_hang = dh.ma_khach_hang
            LEFT JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            WHERE (
                :keyword IS NULL
                OR :keyword = ''
                OR CAST(dh.ma_don_hang AS CHAR) LIKE CONCAT('%', :keyword, '%')
                OR LOWER(kh.ho_ten) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR tk.so_dien_thoai LIKE CONCAT('%', :keyword, '%')
            )
            AND (
                :trangThaiDonHang IS NULL
                OR :trangThaiDonHang = ''
                OR dh.trang_thai_don_hang = :trangThaiDonHang
            )
            AND (
                :trangThaiThanhToan IS NULL
                OR :trangThaiThanhToan = ''
                OR dh.trang_thai_thanh_toan = :trangThaiThanhToan
            )
            AND (
                :trangThaiKiemDuyet IS NULL
                OR :trangThaiKiemDuyet = ''
                OR dh.trang_thai_kiem_duyet = :trangThaiKiemDuyet
            )
            """,
        nativeQuery = true
    )
    Page<DonHangDanhSachProjection> timKiemDonHang(
            @Param("keyword") String keyword,
            @Param("trangThaiDonHang") String trangThaiDonHang,
            @Param("trangThaiThanhToan") String trangThaiThanhToan,
            @Param("trangThaiKiemDuyet") String trangThaiKiemDuyet,
            Pageable pageable
    );

    @Query(
        value = """
            SELECT
                dh.ma_don_hang AS maDonHang,
                dh.ma_khach_hang AS maKhachHang,
                kh.ho_ten AS tenKhachHang,
                tk.so_dien_thoai AS soDienThoaiKhachHang,
                dh.ma_dia_chi AS maDiaChi,
                dc.ten_nguoi_nhan AS tenNguoiNhan,
                dc.so_dien_thoai_nhan AS soDienThoaiNhan,
                dc.thanh_pho AS thanhPho,
                dc.phuong_khu_vuc AS phuongKhuVuc,
                dc.dia_chi_chi_tiet AS diaChiChiTiet,
                dh.ma_voucher AS maVoucher,
                dh.ma_don_thuoc AS maDonThuoc,
                dh.ma_nhan_vien_xu_ly AS maNhanVienXuLy,
                nv.ho_ten AS tenNhanVienXuLy,
                dh.ngay_dat_hang AS ngayDatHang,
                dh.loai_khach AS loaiKhach,
                dh.tong_tien_hang AS tongTienHang,
                dh.phi_giao_hang AS phiGiaoHang,
                dh.giam_gia AS giamGia,
                dh.tong_thanh_toan AS tongThanhToan,
                dh.phuong_thuc_thanh_toan AS phuongThucThanhToan,
                dh.trang_thai_thanh_toan AS trangThaiThanhToan,
                dh.trang_thai_don_hang AS trangThaiDonHang,
                dh.trang_thai_kiem_duyet AS trangThaiKiemDuyet,
                dh.ngay_kiem_duyet AS ngayKiemDuyet,
                dh.ghi_chu_kiem_duyet AS ghiChuKiemDuyet,
                dh.ly_do_tu_choi_duyet AS lyDoTuChoiDuyet,
                dh.ghi_chu AS ghiChu,
                dt.anh_don_thuoc AS anhDonThuoc,
                dt.trang_thai_don_thuoc AS trangThaiDonThuoc,
                dt.ly_do_tu_choi AS lyDoTuChoiDonThuoc,
                dt.ghi_chu AS ghiChuDonThuoc,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM chi_tiet_don_hang ctdh
                        JOIN san_pham sp
                            ON sp.ma_san_pham = ctdh.ma_san_pham
                        WHERE ctdh.ma_don_hang = dh.ma_don_hang
                          AND sp.la_thuoc_ke_don = 1
                    )
                    THEN 1
                    ELSE 0
                END AS coThuocKeDon
            FROM don_hang dh
            LEFT JOIN khach_hang kh
                ON kh.ma_khach_hang = dh.ma_khach_hang
            LEFT JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            LEFT JOIN dia_chi_giao_hang dc
                ON dc.ma_dia_chi = dh.ma_dia_chi
            LEFT JOIN nhan_vien_noi_bo nv
                ON nv.ma_nhan_vien = dh.ma_nhan_vien_xu_ly
            LEFT JOIN don_thuoc dt
                ON dt.ma_don_thuoc = dh.ma_don_thuoc
            WHERE dh.ma_don_hang = :maDonHang
            """,
        nativeQuery = true
    )
    Optional<DonHangChiTietProjection> timChiTietDonHang(
            @Param("maDonHang") long maDonHang
    );

    /*
     * =========================
     * KHÁCH HÀNG / ĐƠN HÀNG
     * =========================
     */

    List<DonHang> findByKhachHang_MaKhachHangOrderByNgayDatHangDesc(
            Long maKhachHang
    );

    @Query("""
            SELECT dh
            FROM DonHang dh
            JOIN FETCH dh.khachHang kh
            JOIN FETCH dh.diaChiGiaoHang dc
            WHERE dh.maDonHang = :maDonHang
              AND kh.maKhachHang = :maKhachHang
            """)
    Optional<DonHang> timChiTietDonHangCuaKhachHang(
            @Param("maDonHang") Long maDonHang,
            @Param("maKhachHang") Long maKhachHang
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT dh
            FROM DonHang dh
            WHERE dh.maDonHang = :maDonHang
            """)
    Optional<DonHang> timTheoMaDeCapNhat(
            @Param("maDonHang") Long maDonHang
    );

    @Query("""
            SELECT dh.maDonHang
            FROM DonHang dh
            WHERE dh.phuongThucThanhToan = :phuongThucThanhToan
              AND dh.trangThaiDonHang = :trangThaiDonHang
              AND dh.trangThaiThanhToan = :trangThaiThanhToan
              AND dh.ngayDatHang IS NOT NULL
              AND dh.ngayDatHang <= :thoiDiemGioiHan
            ORDER BY dh.maDonHang ASC
            """)
    List<Long> timMaDonHangZaloPayChoThanhToanQuaHan(
            @Param("phuongThucThanhToan")
            PhuongThucThanhToan phuongThucThanhToan,

            @Param("trangThaiDonHang")
            TrangThaiDonHang trangThaiDonHang,

            @Param("trangThaiThanhToan")
            TrangThaiThanhToan trangThaiThanhToan,

            @Param("thoiDiemGioiHan")
            LocalDateTime thoiDiemGioiHan
    );

    /*
     * =========================
     * DASHBOARD ADMIN
     * =========================
     */

    long countByNgayDatHangGreaterThanEqualAndNgayDatHangLessThan(
            LocalDateTime tuNgay,
            LocalDateTime denNgay
    );

    long countByTrangThaiDonHang(
            TrangThaiDonHang trangThaiDonHang
    );

    @Query("""
            SELECT COALESCE(SUM(dh.tongThanhToan), 0)
            FROM DonHang dh
            WHERE dh.trangThaiDonHang = :trangThaiDonHang
              AND dh.trangThaiThanhToan = :trangThaiThanhToan
              AND dh.ngayDatHang >= :tuNgay
              AND dh.ngayDatHang < :denNgay
            """)
    BigDecimal tinhDoanhThuTrongKhoang(
            @Param("tuNgay") LocalDateTime tuNgay,

            @Param("denNgay") LocalDateTime denNgay,

            @Param("trangThaiDonHang")
            TrangThaiDonHang trangThaiDonHang,

            @Param("trangThaiThanhToan")
            TrangThaiThanhToan trangThaiThanhToan
    );
}