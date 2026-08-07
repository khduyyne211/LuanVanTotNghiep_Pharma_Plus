package com.pharma.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.KhuyenMai;
import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

/**
 * Repository chỉ đọc khuyến mãi dành cho luồng khách hàng.
 *
 * Không dùng repository này cho chức năng CRUD Admin.
 */
public interface KhuyenMaiKhachHangRepository
        extends Repository<KhuyenMai, Long> {

    @Query("""
            SELECT
                sp.maSanPham AS maSanPham,
                km.maKhuyenMai AS maKhuyenMai,
                km.kieuGiamGia AS kieuGiamGia,
                km.giaTriGiam AS giaTriGiam
            FROM KhuyenMai km
            JOIN km.danhSachSanPham sp
            WHERE sp.maSanPham IN :danhSachMaSanPham
              AND km.loaiKhuyenMai = :loaiKhuyenMai
              AND km.trangThai = true
              AND km.thoiGianBatDau <= :thoiDiem
              AND km.thoiGianKetThuc >= :thoiDiem
            ORDER BY
                sp.maSanPham ASC,
                km.maKhuyenMai ASC
            """)
    List<KhuyenMaiSanPhamProjection> layKhuyenMaiSanPhamDangApDung(
            @Param("danhSachMaSanPham")
            Collection<Long> danhSachMaSanPham,
            @Param("loaiKhuyenMai")
            String loaiKhuyenMai,
            @Param("thoiDiem")
            LocalDateTime thoiDiem);

    interface KhuyenMaiSanPhamProjection {

        Long getMaSanPham();

        Long getMaKhuyenMai();

        KieuGiamGia getKieuGiamGia();

        BigDecimal getGiaTriGiam();
    }
}