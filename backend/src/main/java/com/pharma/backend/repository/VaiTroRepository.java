package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.VaiTro;

public interface VaiTroRepository extends JpaRepository<VaiTro, Long> {

    @Query("""
        SELECT vt
        FROM VaiTro vt
        WHERE vt.tenVaiTro = :tenVaiTro
          AND vt.trangThai = true
    """)
    Optional<VaiTro> timVaiTroDangHoatDongTheoTen(
            @Param("tenVaiTro") String tenVaiTro
    );
}