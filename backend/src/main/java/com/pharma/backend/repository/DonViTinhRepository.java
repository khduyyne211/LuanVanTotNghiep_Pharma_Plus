package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.DonViTinh;

public interface DonViTinhRepository extends JpaRepository<DonViTinh, Long> {

    @Query("""
            SELECT dvt
            FROM DonViTinh dvt
            ORDER BY dvt.tenDonViTinh ASC
            """)
    List<DonViTinh> findAllOrderByTenDonViTinhAsc();

    @Query("""
            SELECT CASE WHEN COUNT(dvt) > 0 THEN true ELSE false END
            FROM DonViTinh dvt
            WHERE dvt.tenDonViTinh = :tenDonViTinh
            """)
    boolean existsByTenDonViTinh(
            @Param("tenDonViTinh") String tenDonViTinh
    );

    @Query("""
            SELECT CASE WHEN COUNT(dvt) > 0 THEN true ELSE false END
            FROM DonViTinh dvt
            WHERE dvt.tenDonViTinh = :tenDonViTinh
              AND dvt.maDonViTinh <> :maDonViTinh
            """)
    boolean existsByTenDonViTinhAndMaDonViTinhNot(
            @Param("tenDonViTinh") String tenDonViTinh,
            @Param("maDonViTinh") Long maDonViTinh
    );
}