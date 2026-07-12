package com.pharma.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.DonViTinh;

public interface DonViTinhRepository extends JpaRepository<DonViTinh,Long>{

    boolean existsByTenDonViTinh(String tenDonViTinh);
    
    boolean existsByTenDonViTinhAndMaDonViTinhNot(String tenDonViTinh, Long maDonViTinh);
}
