package com.pharma.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.ThanhPhanHoatChat;

public interface ThanhPhanHoatChatRepository extends JpaRepository<ThanhPhanHoatChat, Long> {

    @Query("""
            SELECT tphc
            FROM ThanhPhanHoatChat tphc
            JOIN FETCH tphc.sanPham sp
            JOIN FETCH tphc.hoatChat hc
            WHERE sp.maSanPham = :maSanPham
            ORDER BY hc.tenHoatChat ASC
            """)
    List<ThanhPhanHoatChat> findAllByMaSanPham(@Param("maSanPham") Long maSanPham);

    @Query("""
            SELECT tphc
            FROM ThanhPhanHoatChat tphc
            JOIN FETCH tphc.sanPham sp
            JOIN FETCH tphc.hoatChat hc
            WHERE tphc.maThanhPhan = :maThanhPhan
            """)
    Optional<ThanhPhanHoatChat> findByMaThanhPhanWithDetails(@Param("maThanhPhan") Long maThanhPhan);

    @Query("""
            SELECT CASE WHEN COUNT(tphc) > 0 THEN true ELSE false END
            FROM ThanhPhanHoatChat tphc
            WHERE tphc.sanPham.maSanPham = :maSanPham
              AND tphc.hoatChat.maHoatChat = :maHoatChat
            """)
    boolean existsByMaSanPhamAndMaHoatChat(
            @Param("maSanPham") Long maSanPham,
            @Param("maHoatChat") Long maHoatChat
    );

    @Query("""
            SELECT CASE WHEN COUNT(tphc) > 0 THEN true ELSE false END
            FROM ThanhPhanHoatChat tphc
            WHERE tphc.sanPham.maSanPham = :maSanPham
              AND tphc.hoatChat.maHoatChat = :maHoatChat
              AND tphc.maThanhPhan <> :maThanhPhan
            """)
    boolean existsByMaSanPhamAndMaHoatChatAndMaThanhPhanNot(
            @Param("maSanPham") Long maSanPham,
            @Param("maHoatChat") Long maHoatChat,
            @Param("maThanhPhan") Long maThanhPhan
    );
}