package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.KhachHang;

public interface KhachHangRepository extends JpaRepository<KhachHang, Long>{
    Optional<KhachHang> findByTaiKhoan_MaTaiKhoan(Long maTaiKhoan);

    @Query("""
        SELECT kh
        FROM KhachHang kh
        WHERE kh.maKhachHang = :maKhachHang
          AND kh.trangThai = true
    """)
    Optional<KhachHang> timKhachHangDangHoatDong(
            @Param("maKhachHang") Long maKhachHang
    );


    @Query("""
        SELECT kh
        FROM KhachHang kh
        JOIN FETCH kh.taiKhoan tk
        WHERE kh.maKhachHang = :maKhachHang
          AND kh.trangThai = true
          AND tk.trangThaiTaiKhoan = true
    """)
    Optional<KhachHang> timThongTinCaNhanDangHoatDong(
            @Param("maKhachHang") Long maKhachHang
    );
}
