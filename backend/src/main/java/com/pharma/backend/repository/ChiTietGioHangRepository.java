package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.ChiTietGioHang;

public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHang, Long> {

    List<ChiTietGioHang> findByGioHang_MaGioHang(Long maGioHang);

    @Query("""
        SELECT ctgh
        FROM ChiTietGioHang ctgh
        JOIN FETCH ctgh.donViSanPham dvsp
        JOIN FETCH dvsp.sanPham sp
        JOIN FETCH dvsp.donViTinh dvt
        WHERE ctgh.gioHang.maGioHang = :maGioHang
        ORDER BY ctgh.maChiTietGioHang ASC
        """)
    List<ChiTietGioHang> layDanhSachChiTietDeTaoDonHang(@Param("maGioHang") Long maGioHang);

    //Cần phải xóa toàn bộ vì:
    //Mỗi lần bấm đặt hàng, database cần phải phản ánh chính xác giỏ hàng hiện tại trong localStorage.
    @Modifying(flushAutomatically = true)
    @Query("""
        DELETE FROM ChiTietGioHang ctgh
        WHERE ctgh.gioHang.maGioHang = :maGioHang
        """)
    int xoaTatCaTheoMaGioHang(@Param("maGioHang") Long maGioHang);
}