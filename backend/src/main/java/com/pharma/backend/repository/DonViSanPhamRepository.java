package com.pharma.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.DonViSanPham;

public interface DonViSanPhamRepository extends JpaRepository<DonViSanPham, Long> {

    List<DonViSanPham> findBySanPham_MaSanPham(Long maSanPham);

    boolean existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinh(
            Long maSanPham,
            Long maDonViTinh
    );

    boolean existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinhAndMaDonViSanPhamNot(
            Long maSanPham,
            Long maDonViTinh,
            Long maDonViSanPham
    );

    boolean existsBySanPham_MaSanPhamAndLaDonViCoSoTrue(Long maSanPham);

    boolean existsBySanPham_MaSanPhamAndLaDonViCoSoTrueAndMaDonViSanPhamNot(
            Long maSanPham,
            Long maDonViSanPham
    );

    @EntityGraph(attributePaths = {"sanPham", "donViTinh"})
    @Query("""
            SELECT dvsp
            FROM DonViSanPham dvsp
            WHERE dvsp.sanPham.maSanPham = :maSanPham
              AND dvsp.choPhepBan = true
              AND dvsp.trangThai = true
            ORDER BY CASE
                         WHEN dvsp.laDonViBanMacDinh = true THEN 0
                         WHEN dvsp.laDonViCoSo = true THEN 1
                         ELSE 2
                     END,
                     dvsp.maDonViSanPham ASC
            """)
    List<DonViSanPham> findBySanPham_MaSanPhamAndChoPhepBanTrueAndTrangThaiTrue(
            @Param("maSanPham") Long maSanPham
    );

    @EntityGraph(attributePaths = {"sanPham", "donViTinh"})
    @Query("""
            SELECT dvsp
            FROM DonViSanPham dvsp
            WHERE dvsp.sanPham.maSanPham IN :danhSachMaSanPham
              AND dvsp.choPhepBan = true
              AND dvsp.trangThai = true
            ORDER BY dvsp.sanPham.maSanPham ASC,
                     CASE
                         WHEN dvsp.laDonViBanMacDinh = true THEN 0
                         WHEN dvsp.laDonViCoSo = true THEN 1
                         ELSE 2
                     END,
                     dvsp.maDonViSanPham ASC
            """)
    List<DonViSanPham> findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
            @Param("danhSachMaSanPham") List<Long> danhSachMaSanPham
    );

    Optional<DonViSanPham> findBySanPham_MaSanPhamAndLaDonViCoSoTrueAndTrangThaiTrue(
            Long maSanPham
    );

    Optional<DonViSanPham>
            findBySanPham_MaSanPhamAndLaDonViBanMacDinhTrueAndChoPhepBanTrueAndTrangThaiTrue(
                    Long maSanPham
            );
}
