package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pharma.backend.entity.KhuyenMai;

public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Long> {

    @Query("""
            SELECT km
            FROM KhuyenMai km
            ORDER BY km.thoiGianBatDau DESC, km.maKhuyenMai DESC
            """)
    List<KhuyenMai> findAllOrderByThoiGianBatDauDesc();
}