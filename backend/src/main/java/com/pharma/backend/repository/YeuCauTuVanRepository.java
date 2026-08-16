package com.pharma.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharma.backend.entity.YeuCauTuVan;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

import jakarta.persistence.LockModeType;

@Repository
public interface YeuCauTuVanRepository
        extends JpaRepository<YeuCauTuVan, Long> {

    @Query(
            value = """
                    SELECT yctv
                    FROM YeuCauTuVan yctv
                    WHERE yctv.khachHang.maKhachHang = :maKhachHang
                    ORDER BY yctv.ngayTao DESC,
                             yctv.maYeuCauTuVan DESC
                    """,
            countQuery = """
                    SELECT COUNT(yctv)
                    FROM YeuCauTuVan yctv
                    WHERE yctv.khachHang.maKhachHang = :maKhachHang
                    """
    )
    Page<YeuCauTuVan> timDanhSachCuaKhachHang(
            @Param("maKhachHang")
            Long maKhachHang,
            Pageable pageable
    );

    @Query("""
            SELECT yctv
            FROM YeuCauTuVan yctv
            LEFT JOIN FETCH yctv.nhanVienTiepNhan
            WHERE yctv.maYeuCauTuVan = :maYeuCauTuVan
              AND yctv.khachHang.maKhachHang = :maKhachHang
            """)
    Optional<YeuCauTuVan> timChiTietCuaKhachHang(
            @Param("maYeuCauTuVan")
            Long maYeuCauTuVan,

            @Param("maKhachHang")
            Long maKhachHang
    );

    /*
     * Danh sách dành cho Dược sĩ.
     *
     * Cho phép:
     * - lấy tất cả;
     * - hoặc lọc theo một trạng thái tư vấn.
     */
    @Query(
            value = """
                    SELECT yctv
                    FROM YeuCauTuVan yctv
                    WHERE (
                        :trangThai IS NULL
                        OR yctv.trangThaiTuVan = :trangThai
                    )
                    ORDER BY yctv.ngayTao DESC,
                             yctv.maYeuCauTuVan DESC
                    """,
            countQuery = """
                    SELECT COUNT(yctv)
                    FROM YeuCauTuVan yctv
                    WHERE (
                        :trangThai IS NULL
                        OR yctv.trangThaiTuVan = :trangThai
                    )
                    """
    )
    Page<YeuCauTuVan> timDanhSachChoDuocSi(
            @Param("trangThai")
            TrangThaiTuVan trangThai,
            Pageable pageable
    );

    @Query("""
            SELECT yctv
            FROM YeuCauTuVan yctv
            LEFT JOIN FETCH yctv.khachHang
            LEFT JOIN FETCH yctv.nhanVienTiepNhan
            WHERE yctv.maYeuCauTuVan = :maYeuCauTuVan
            """)
    Optional<YeuCauTuVan> timChiTietChoDuocSi(
            @Param("maYeuCauTuVan")
            Long maYeuCauTuVan
    );

    /*
     * Khóa bản ghi khi Dược sĩ tiếp nhận/xử lý,
     * tránh hai Dược sĩ cùng nhận một yêu cầu.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT yctv
            FROM YeuCauTuVan yctv
            LEFT JOIN FETCH yctv.khachHang
            LEFT JOIN FETCH yctv.nhanVienTiepNhan
            WHERE yctv.maYeuCauTuVan = :maYeuCauTuVan
            """)
    Optional<YeuCauTuVan> timTheoMaDeCapNhat(
            @Param("maYeuCauTuVan")
            Long maYeuCauTuVan
    );
}