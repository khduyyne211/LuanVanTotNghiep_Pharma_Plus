package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.ThanhPhanHoatChat;

public interface ThanhPhanHoatChatRepository
        extends JpaRepository<ThanhPhanHoatChat, Long> {

    @Query("""
            SELECT tphc
            FROM ThanhPhanHoatChat tphc
            JOIN FETCH tphc.hoatChat
            WHERE tphc.sanPham.maSanPham = :maSanPham
            ORDER BY tphc.maThanhPhan ASC
            """)
    List<ThanhPhanHoatChat> timTheoMaSanPham(
            @Param("maSanPham") Long maSanPham
    );

    @Query("""
            SELECT tphc
            FROM ThanhPhanHoatChat tphc
            JOIN FETCH tphc.hoatChat
            WHERE tphc.sanPham.maSanPham = :maSanPham
            ORDER BY tphc.maThanhPhan ASC
            """)
    List<ThanhPhanHoatChat> findByMaSanPham(
            @Param("maSanPham") Long maSanPham
    );
}