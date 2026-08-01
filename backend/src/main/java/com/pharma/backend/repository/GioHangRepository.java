package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.GioHang;

import jakarta.persistence.LockModeType;

public interface GioHangRepository extends JpaRepository<GioHang, Long> {

    //Tìm giỏ hàng thuộc khách hàng đã đăng nhập
    Optional<GioHang> findByKhachHang_MaKhachHang(Long maKhachHang);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT gh
        FROM GioHang gh
        WHERE gh.khachHang.maKhachHang = :maKhachHang
        """)
    Optional<GioHang> layGioHangDeTaoDonHang(@Param("maKhachHang") Long maKhachHang);


}