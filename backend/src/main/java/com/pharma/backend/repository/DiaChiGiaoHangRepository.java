package com.pharma.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharma.backend.entity.DiaChiGiaoHang;

@Repository
public interface DiaChiGiaoHangRepository
        extends JpaRepository<DiaChiGiaoHang, Long> {

    @Query("""
        SELECT dc
        FROM DiaChiGiaoHang dc
        WHERE dc.khachHang.maKhachHang = :maKhachHang
          AND dc.trangThaiSuDung = true
        ORDER BY dc.laMacDinh DESC, dc.maDiaChi DESC
    """)
    List<DiaChiGiaoHang>
        findByKhachHang_MaKhachHangAndTrangThaiSuDungTrueOrderByLaMacDinhDescMaDiaChiDesc(
            @Param("maKhachHang") Long maKhachHang
        );

    @Query("""
        SELECT dc
        FROM DiaChiGiaoHang dc
        WHERE dc.maDiaChi = :maDiaChi
          AND dc.khachHang.maKhachHang = :maKhachHang
          AND dc.trangThaiSuDung = true
    """)
    Optional<DiaChiGiaoHang>
        findByMaDiaChiAndKhachHang_MaKhachHangAndTrangThaiSuDungTrue(
            @Param("maDiaChi") Long maDiaChi,
            @Param("maKhachHang") Long maKhachHang
        );
}