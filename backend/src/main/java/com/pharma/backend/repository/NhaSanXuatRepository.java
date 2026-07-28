package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.NhaSanXuat;

public interface NhaSanXuatRepository extends JpaRepository<NhaSanXuat, Long> {

    @Query("""
            SELECT nsx
            FROM NhaSanXuat nsx
            ORDER BY nsx.tenNhaSanXuat ASC
            """)
    List<NhaSanXuat> findAllByOrderByTenNhaSanXuatAsc();

    @Query("""
            SELECT CASE WHEN COUNT(nsx) > 0 THEN true ELSE false END
            FROM NhaSanXuat nsx
            WHERE nsx.tenNhaSanXuat = :tenNhaSanXuat
            """)
    boolean existsByTenNhaSanXuat(
            @Param("tenNhaSanXuat") String tenNhaSanXuat
    );

    @Query("""
            SELECT CASE WHEN COUNT(nsx) > 0 THEN true ELSE false END
            FROM NhaSanXuat nsx
            WHERE nsx.tenNhaSanXuat = :tenNhaSanXuat
              AND nsx.maNhaSanXuat <> :maNhaSanXuat
            """)
    boolean existsByTenNhaSanXuatAndMaNhaSanXuatNot(
            @Param("tenNhaSanXuat") String tenNhaSanXuat,
            @Param("maNhaSanXuat") Long maNhaSanXuat
    );
}