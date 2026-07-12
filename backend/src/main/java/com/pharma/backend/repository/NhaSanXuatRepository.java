package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.NhaSanXuat;

public interface NhaSanXuatRepository extends JpaRepository<NhaSanXuat, Long> {

    List<NhaSanXuat> findAllByOrderByTenNhaSanXuatAsc();

    boolean existsByTenNhaSanXuat(String tenNhaSanXuat);

    boolean existsByTenNhaSanXuatAndMaNhaSanXuatNot(
            String tenNhaSanXuat,
            Long maNhaSanXuat
    );
}