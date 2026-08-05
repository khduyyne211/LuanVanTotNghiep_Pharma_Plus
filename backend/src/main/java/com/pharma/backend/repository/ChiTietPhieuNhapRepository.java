package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.ChiTietPhieuNhap;

public interface ChiTietPhieuNhapRepository
        extends JpaRepository<ChiTietPhieuNhap, Long> {

    List<ChiTietPhieuNhap>
            findByPhieuNhapKho_MaPhieuNhapOrderByMaChiTietPhieuNhapAsc(
                    Long maPhieuNhap
            );
}