package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.VaiTro;

public interface VaiTroRepository extends JpaRepository<VaiTro, Long>{
    @Query("""
            SELECT vt
            FROM VaiTro vt
            ORDER BY vt.tenVaiTro ASC
            """)
    List<VaiTro> findAllOrderByTenVaiTroAsc();

    @Query("""
            SELECT CASE WHEN COUNT(vt) > 0 THEN true ELSE false END
            FROM VaiTro vt
            WHERE vt.tenVaiTro = :tenVaiTro
            """)
    boolean existsByTenVaiTro(
            @Param("tenVaiTro") String tenVaiTro
    );

    @Query("""
            SELECT CASE WHEN COUNT(vt) > 0 THEN true ELSE false END
            FROM VaiTro vt
            WHERE vt.tenVaiTro = :tenVaiTro
              AND vt.maVaiTro <> :maVaiTro
            """)
    boolean existsByTenVaiTroAndMaVaiTroNot(
            @Param("tenVaiTro") String tenVaiTro,
            @Param("maVaiTro") Long maVaiTro
    );
}
