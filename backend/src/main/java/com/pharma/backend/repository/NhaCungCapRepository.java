package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pharma.backend.entity.NhaCungCap;

public interface NhaCungCapRepository extends JpaRepository<NhaCungCap, Long> {

    @Query("""
            SELECT ncc
            FROM NhaCungCap ncc
            ORDER BY ncc.tenNhaCungCap ASC
            """)
    List<NhaCungCap> findAllOrderByTenNhaCungCapAsc();
}