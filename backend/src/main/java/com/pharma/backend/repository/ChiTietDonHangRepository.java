package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.dto.donhang.ChiTietDonHangProjection;
import com.pharma.backend.entity.ChiTietDonHang;

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
}
