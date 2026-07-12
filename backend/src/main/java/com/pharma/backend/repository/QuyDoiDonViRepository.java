package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

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
}