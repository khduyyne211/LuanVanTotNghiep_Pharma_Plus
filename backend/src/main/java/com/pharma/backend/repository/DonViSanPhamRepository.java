package com.pharma.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

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

    @EntityGraph(attributePaths = {
            "sanPham",
            "donViTinh"
    })
    List<DonViSanPham> findBySanPham_MaSanPhamAndChoPhepBanTrueAndTrangThaiTrue(
            Long maSanPham
    );

    @EntityGraph(attributePaths = {
            "sanPham",
            "donViTinh"
    })
    List<DonViSanPham> findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
            List<Long> danhSachMaSanPham
    );

    Optional<DonViSanPham> findBySanPham_MaSanPhamAndLaDonViCoSoTrueAndTrangThaiTrue(
            Long maSanPham
    );
}
