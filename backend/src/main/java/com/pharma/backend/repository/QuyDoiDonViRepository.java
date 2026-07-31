package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.QuyDoiDonVi;

public interface QuyDoiDonViRepository extends JpaRepository<QuyDoiDonVi, Long> {

    List<QuyDoiDonVi> findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(Long maSanPham);

    boolean existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPham(
            Long maSanPham,
            Long maDonViNguon,
            Long maDonViDich
    );

    boolean existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPhamAndMaQuyDoiNot(
            Long maSanPham,
            Long maDonViNguon,
            Long maDonViDich,
            Long maQuyDoi
    );

    @Query("""
            SELECT qd
            FROM QuyDoiDonVi qd
            JOIN FETCH qd.sanPham sp
            JOIN FETCH qd.donViNguon donViNguon
            JOIN FETCH donViNguon.donViTinh
            JOIN FETCH qd.donViDich donViDich
            JOIN FETCH donViDich.donViTinh
            WHERE sp.maSanPham IN :danhSachMaSanPham
              AND qd.trangThai = true
            ORDER BY sp.maSanPham ASC, qd.maQuyDoi ASC
            """)
    List<QuyDoiDonVi> findBySanPham_MaSanPhamInAndTrangThaiTrue(
            @Param("danhSachMaSanPham") List<Long> danhSachMaSanPham
    );

    @Query("""
            SELECT qd
            FROM QuyDoiDonVi qd
            JOIN FETCH qd.sanPham sp
            JOIN FETCH qd.donViNguon donViNguon
            JOIN FETCH donViNguon.donViTinh
            JOIN FETCH qd.donViDich donViDich
            JOIN FETCH donViDich.donViTinh
            WHERE sp.maSanPham = :maSanPham
              AND qd.trangThai = true
            ORDER BY qd.maQuyDoi ASC
            """)
    List<QuyDoiDonVi> findBySanPham_MaSanPhamAndTrangThaiTrue(
            @Param("maSanPham") Long maSanPham
    );

    @Query("""
            SELECT qd
            FROM QuyDoiDonVi qd
            JOIN FETCH qd.donViNguon donViNguon
            JOIN FETCH donViNguon.donViTinh
            JOIN FETCH qd.donViDich donViDich
            JOIN FETCH donViDich.donViTinh
            WHERE qd.sanPham.maSanPham = :maSanPham
              AND qd.trangThai = true
            ORDER BY qd.maQuyDoi ASC
            """)
    List<QuyDoiDonVi> layDanhSachQuyDoiDangHoatDong(
            @Param("maSanPham") Long maSanPham
    );
}
