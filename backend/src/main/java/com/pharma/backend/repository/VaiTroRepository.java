package com.pharma.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.HoatChat;

public interface VaiTroRepository extends JpaRepository<Object, Object>{
    @Query("""
            SELECT hc
            FROM HoatChat hc
            ORDER BY hc.tenHoatChat ASC
            """)
    List<HoatChat> findAllOrderByTenHoatChatAsc();

    @Query("""
            SELECT CASE WHEN COUNT(hc) > 0 THEN true ELSE false END
            FROM HoatChat hc
            WHERE hc.tenHoatChat = :tenHoatChat
            """)
    boolean existsByTenHoatChat(
            @Param("tenHoatChat") String tenHoatChat
    );

    @Query("""
            SELECT CASE WHEN COUNT(hc) > 0 THEN true ELSE false END
            FROM HoatChat hc
            WHERE hc.tenHoatChat = :tenHoatChat
              AND hc.maHoatChat <> :maHoatChat
            """)
    boolean existsByTenHoatChatAndMaHoatChatNot(
            @Param("tenHoatChat") String tenHoatChat,
            @Param("maHoatChat") Long maHoatChat
    );
}
