package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.dto.donhang.ChiTietDonHangProjection;
import com.pharma.backend.entity.ChiTietDonHang;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;

public interface ChiTietDonHangRepository
        extends JpaRepository<ChiTietDonHang, Long> {

    @Query(
        value = """
            SELECT
                ctdh.ma_chi_tiet_don_hang AS maChiTietDonHang,
                ctdh.ma_san_pham AS maSanPham,
                sp.ten_san_pham AS tenSanPham,
                sp.la_thuoc_ke_don AS laThuocKeDon,
                sp.hinh_anh AS hinhAnh,
                ctdh.ma_don_vi_san_pham AS maDonViSanPham,
                dvt.ma_don_vi_tinh AS maDonViTinh,
                dvt.ten_don_vi_tinh AS tenDonViTinh,
                dvt.ky_hieu AS kyHieu,
                ctdh.so_luong AS soLuong,
                ctdh.don_gia AS donGia,
                ctdh.giam_gia AS giamGia,
                ctdh.thanh_tien AS thanhTien,
                ctdh.cach_tinh_gia AS cachTinhGia
            FROM chi_tiet_don_hang ctdh
            JOIN san_pham sp
                ON sp.ma_san_pham = ctdh.ma_san_pham
            JOIN don_vi_san_pham dvsp
                ON dvsp.ma_don_vi_san_pham =
                    ctdh.ma_don_vi_san_pham
            JOIN don_vi_tinh dvt
                ON dvt.ma_don_vi_tinh = dvsp.ma_don_vi_tinh
            WHERE ctdh.ma_don_hang = :maDonHang
            ORDER BY ctdh.ma_chi_tiet_don_hang ASC
            """,
        nativeQuery = true
    )
    List<ChiTietDonHangProjection> timTheoMaDonHang(
            @Param("maDonHang") long maDonHang
    );

    @Query("""
            SELECT sp.maSanPham AS maSanPham,
                   SUM(ctdh.soLuong) AS tongSoLuongDaBan
            FROM ChiTietDonHang ctdh
            JOIN ctdh.donHang dh
            JOIN ctdh.sanPham sp
            WHERE dh.trangThaiDonHang = :trangThaiDonHang
              AND sp.trangThaiSanPham = true
            GROUP BY sp.maSanPham
            ORDER BY SUM(ctdh.soLuong) DESC,
                     sp.maSanPham ASC
            """)
    List<SanPhamBanChayProjection> timSanPhamBanChay(
            @Param("trangThaiDonHang")
            TrangThaiDonHang trangThaiDonHang,
            Pageable pageable
    );


    @Query("""
            SELECT ctdh
            FROM ChiTietDonHang ctdh
            JOIN FETCH ctdh.donHang dh
            JOIN FETCH ctdh.sanPham sp
            JOIN FETCH ctdh.donViSanPham dvsp
            JOIN FETCH dvsp.donViTinh dvt
            WHERE dh.maDonHang IN :danhSachMaDonHang
            ORDER BY dh.maDonHang DESC,
                     ctdh.maChiTietDonHang ASC
            """)
    List<ChiTietDonHang> layChiTietTheoDanhSachDonHang(
            @Param("danhSachMaDonHang")
            List<Long> danhSachMaDonHang
    );

    @Query("""
            SELECT ctdh
            FROM ChiTietDonHang ctdh
            JOIN FETCH ctdh.donHang dh
            JOIN FETCH ctdh.sanPham sp
            JOIN FETCH ctdh.donViSanPham dvsp
            JOIN FETCH dvsp.donViTinh dvt
            WHERE dh.maDonHang = :maDonHang
            ORDER BY ctdh.maChiTietDonHang ASC
            """)
    List<ChiTietDonHang> layChiTietTheoMaDonHang(
            @Param("maDonHang") Long maDonHang
    );

    interface SanPhamBanChayProjection {

        Long getMaSanPham();

        Long getTongSoLuongDaBan();
    }
}
