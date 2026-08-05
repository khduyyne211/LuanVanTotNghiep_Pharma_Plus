package com.pharma.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.KhachHang;

public interface KhachHangRepository
        extends JpaRepository<KhachHang, Long> {
}