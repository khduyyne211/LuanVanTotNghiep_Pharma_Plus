package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pharma.backend.entity.DanhMucSanPham;

public interface DanhMucSanPhamRepository extends JpaRepository<DanhMucSanPham, Long> {

    List<DanhMucSanPham> findAllByOrderByThuTuHienThiAscTenDanhMucAsc();

    boolean existsByTenDanhMuc(String tenDanhMuc);

    boolean existsByTenDanhMucAndMaDanhMucNot(String tenDanhMuc, Long maDanhMuc);

    @EntityGraph(attributePaths = "danhMucCha")
    @Query("""
            SELECT dm
            FROM DanhMucSanPham dm
            WHERE dm.trangThaiHienThi = true
            ORDER BY dm.thuTuHienThi ASC,
                     dm.tenDanhMuc ASC
            """)
    List<DanhMucSanPham> timDanhMucHienThiChoMenu();

    @Query("""
            SELECT dm.maDanhMuc AS maDanhMuc,
                   dm.tenDanhMuc AS tenDanhMuc,
                   COUNT(sp.maSanPham) AS soLuongSanPham
            FROM SanPham sp
            JOIN sp.danhMuc dm
            WHERE dm.danhMucCha IS NOT NULL
              AND dm.trangThaiHienThi = true
              AND sp.trangThaiSanPham = true
            GROUP BY dm.maDanhMuc,
                     dm.tenDanhMuc,
                     dm.thuTuHienThi
            ORDER BY COUNT(sp.maSanPham) DESC,
                     COALESCE(dm.thuTuHienThi, 2147483647) ASC,
                     dm.maDanhMuc ASC
            """)
    List<DanhMucNoiBatProjection> timDanhMucNoiBat(Pageable pageable);

    interface DanhMucNoiBatProjection {

        Long getMaDanhMuc();

        String getTenDanhMuc();

        Long getSoLuongSanPham();
    }
}
