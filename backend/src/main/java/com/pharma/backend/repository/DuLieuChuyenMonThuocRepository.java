package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.DuLieuChuyenMonThuoc;

public interface DuLieuChuyenMonThuocRepository
        extends JpaRepository<DuLieuChuyenMonThuoc, Long> {

    @Query("""
            SELECT dlcm
            FROM DuLieuChuyenMonThuoc dlcm
            WHERE dlcm.sanPham.maSanPham = :maSanPham
            """)
    Optional<DuLieuChuyenMonThuoc> timTheoMaSanPham(
            @Param("maSanPham") Long maSanPham
    );
}
