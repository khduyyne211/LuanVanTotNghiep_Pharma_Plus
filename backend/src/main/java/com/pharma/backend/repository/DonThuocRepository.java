package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.dto.donthuoc.DonThuocDanhSachProjection;
import com.pharma.backend.entity.DonThuoc;

public interface DonThuocRepository extends JpaRepository<DonThuoc, Long> {

    @Query(
        value = """
            SELECT
                dt.ma_don_thuoc AS maDonThuoc,
                dt.ma_khach_hang AS maKhachHang,
                kh.ho_ten AS tenKhachHang,
                tk.email AS emailKhachHang,
                tk.so_dien_thoai AS soDienThoaiKhachHang,
                dt.ma_nhan_vien_duyet AS maNhanVienDuyet,
                nv.ho_ten AS tenNhanVienDuyet,
                dt.anh_don_thuoc AS anhDonThuoc,
                dt.ngay_upload AS ngayUpload,
                dt.trang_thai_don_thuoc AS trangThaiDonThuoc,
                dt.ly_do_tu_choi AS lyDoTuChoi,
                dt.ghi_chu_duoc_si AS ghiChuDuocSi,
                dt.ket_qua_kiem_duyet AS ketQuaKiemDuyet
            FROM don_thuoc dt
            JOIN khach_hang kh
                ON kh.ma_khach_hang = dt.ma_khach_hang
            JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            LEFT JOIN nhan_vien_noi_bo nv
                ON nv.ma_nhan_vien = dt.ma_nhan_vien_duyet
            WHERE (
                :trangThai IS NULL
                OR :trangThai = ''
                OR dt.trang_thai_don_thuoc = :trangThai
            )
            AND (
                :keyword IS NULL
                OR :keyword = ''
                OR LOWER(kh.ho_ten) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(tk.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR tk.so_dien_thoai LIKE CONCAT('%', :keyword, '%')
            )
            ORDER BY dt.ngay_upload DESC
            """,
        countQuery = """
            SELECT COUNT(*)
            FROM don_thuoc dt
            JOIN khach_hang kh
                ON kh.ma_khach_hang = dt.ma_khach_hang
            JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            WHERE (
                :trangThai IS NULL
                OR :trangThai = ''
                OR dt.trang_thai_don_thuoc = :trangThai
            )
            AND (
                :keyword IS NULL
                OR :keyword = ''
                OR LOWER(kh.ho_ten) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(tk.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR tk.so_dien_thoai LIKE CONCAT('%', :keyword, '%')
            )
            """,
        nativeQuery = true
    )
    Page<DonThuocDanhSachProjection> timKiemDonThuoc(
        @Param("trangThai") String trangThai,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    @Query(
        value = """
            SELECT
                dt.ma_don_thuoc AS maDonThuoc,
                dt.ma_khach_hang AS maKhachHang,
                kh.ho_ten AS tenKhachHang,
                tk.email AS emailKhachHang,
                tk.so_dien_thoai AS soDienThoaiKhachHang,
                dt.ma_nhan_vien_duyet AS maNhanVienDuyet,
                nv.ho_ten AS tenNhanVienDuyet,
                dt.anh_don_thuoc AS anhDonThuoc,
                dt.ngay_upload AS ngayUpload,
                dt.trang_thai_don_thuoc AS trangThaiDonThuoc,
                dt.ly_do_tu_choi AS lyDoTuChoi,
                dt.ghi_chu_duoc_si AS ghiChuDuocSi,
                dt.ket_qua_kiem_duyet AS ketQuaKiemDuyet
            FROM don_thuoc dt
            JOIN khach_hang kh
                ON kh.ma_khach_hang = dt.ma_khach_hang
            JOIN tai_khoan tk
                ON tk.ma_tai_khoan = kh.ma_tai_khoan
            LEFT JOIN nhan_vien_noi_bo nv
                ON nv.ma_nhan_vien = dt.ma_nhan_vien_duyet
            WHERE dt.ma_don_thuoc = :maDonThuoc
            """,
        nativeQuery = true
    )
    Optional<DonThuocDanhSachProjection> timChiTietDonThuoc(
        @Param("maDonThuoc") long maDonThuoc
    );
}
