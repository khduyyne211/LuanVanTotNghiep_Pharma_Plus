package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.backend.entity.DanhMucSanPham;

public interface DanhMucSanPhamRepository extends JpaRepository<DanhMucSanPham, Long> {

    List<DanhMucSanPham> findAllByOrderByThuTuHienThiAscTenDanhMucAsc();

    boolean existsByTenDanhMuc(String tenDanhMuc);

    boolean existsByTenDanhMucAndMaDanhMucNot(String tenDanhMuc, Long maDanhMuc);
}