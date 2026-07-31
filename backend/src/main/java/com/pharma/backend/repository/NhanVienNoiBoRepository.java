package com.pharma.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.NhanVienNoiBo;

public interface NhanVienNoiBoRepository
        extends JpaRepository<NhanVienNoiBo, Long> {
}