package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.TaiKhoan;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {

    @EntityGraph(attributePaths = "danhSachVaiTro")
    Optional<TaiKhoan> findBySoDienThoai(String soDienThoai);

    boolean existsBySoDienThoai(String soDienThoai);
}