package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.NhanVienNoiBo;

public interface NhanVienNoiBoRepository
        extends JpaRepository<NhanVienNoiBo, Long> {

    @Query("""
            SELECT nv
            FROM NhanVienNoiBo nv
            JOIN FETCH nv.taiKhoan tk
            WHERE tk.maTaiKhoan = :maTaiKhoan
              AND nv.trangThaiLamViec = true
            """)
    Optional<NhanVienNoiBo> timNhanVienDangHoatDongTheoTaiKhoan(
            @Param("maTaiKhoan") Long maTaiKhoan
    );
}
