package com.pharma.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.PhieuNhapKho;

public interface PhieuNhapKhoRepository
        extends JpaRepository<PhieuNhapKho, Long> {

    @Query("""
            SELECT pn
            FROM PhieuNhapKho pn
            JOIN FETCH pn.nhaCungCap
            JOIN FETCH pn.nhanVienLap
            ORDER BY pn.ngayNhap DESC
            """)
    List<PhieuNhapKho> findAllTongQuanOrderByNgayNhapDesc();

    @Query("""
            SELECT DISTINCT pn
            FROM PhieuNhapKho pn
            JOIN FETCH pn.nhaCungCap
            JOIN FETCH pn.nhanVienLap
            LEFT JOIN FETCH pn.danhSachChiTietPhieuNhap ct
            LEFT JOIN FETCH ct.sanPham sp
            LEFT JOIN FETCH ct.donViSanPham dvsp
            LEFT JOIN FETCH dvsp.donViTinh dvt
            WHERE pn.maPhieuNhap = :maPhieuNhap
            """)
    Optional<PhieuNhapKho> findChiTietByMaPhieuNhap(
            @Param("maPhieuNhap") Long maPhieuNhap
    );
}