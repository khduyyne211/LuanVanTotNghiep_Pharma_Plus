package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharma.backend.entity.YeuCauTuVan;

@Repository
public interface YeuCauTuVanRepository
        extends JpaRepository<YeuCauTuVan, Long> {

    @Query(
        value = """
                SELECT yctv
                FROM YeuCauTuVan yctv
                WHERE yctv.khachHang.maKhachHang = :maKhachHang
                ORDER BY yctv.ngayTao DESC, yctv.maYeuCauTuVan DESC
                """,
        countQuery = """
                SELECT COUNT(yctv)
                FROM YeuCauTuVan yctv
                WHERE yctv.khachHang.maKhachHang = :maKhachHang
                """
    )
    Page<YeuCauTuVan> timDanhSachCuaKhachHang(
            @Param("maKhachHang") Long maKhachHang,
            Pageable pageable
    );

    @Query("""
            SELECT yctv
            FROM YeuCauTuVan yctv
            LEFT JOIN FETCH yctv.nhanVienTiepNhan
            LEFT JOIN FETCH yctv.sanPham
            WHERE yctv.maYeuCauTuVan = :maYeuCauTuVan
              AND yctv.khachHang.maKhachHang = :maKhachHang
            """)
    Optional<YeuCauTuVan> timChiTietCuaKhachHang(
            @Param("maYeuCauTuVan") Long maYeuCauTuVan,
            @Param("maKhachHang") Long maKhachHang
    );
}