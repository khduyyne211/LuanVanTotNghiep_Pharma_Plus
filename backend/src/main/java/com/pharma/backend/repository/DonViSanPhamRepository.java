package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.repository.projection.TuyChonNhapKhoProjection;

public interface DonViSanPhamRepository
        extends JpaRepository<DonViSanPham, Long> {

    List<DonViSanPham> findBySanPham_MaSanPham(
            Long maSanPham
    );

    boolean existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinh(
            Long maSanPham,
            Long maDonViTinh
    );

    boolean existsBySanPham_MaSanPhamAndDonViTinh_MaDonViTinhAndMaDonViSanPhamNot(
            Long maSanPham,
            Long maDonViTinh,
            Long maDonViSanPham
    );

    boolean existsBySanPham_MaSanPhamAndLaDonViCoSoTrue(
            Long maSanPham
    );

    boolean existsBySanPham_MaSanPhamAndLaDonViCoSoTrueAndMaDonViSanPhamNot(
            Long maSanPham,
            Long maDonViSanPham
    );

    @Query("""
            SELECT
                sp.maSanPham AS maSanPham,
                sp.tenSanPham AS tenSanPham,
                dvsp.maDonViSanPham AS maDonViSanPham,
                dvt.maDonViTinh AS maDonViTinh,
                dvt.tenDonViTinh AS tenDonViTinh,
                dvt.kyHieu AS kyHieu
            FROM DonViSanPham dvsp
            JOIN dvsp.sanPham sp
            JOIN dvsp.donViTinh dvt
            WHERE sp.trangThaiSanPham = true
              AND dvsp.trangThai = true
              AND dvsp.choPhepNhap = true
              AND dvt.trangThai = true
            """)
    List<TuyChonNhapKhoProjection>
            findAllTuyChonNhapKho();
}