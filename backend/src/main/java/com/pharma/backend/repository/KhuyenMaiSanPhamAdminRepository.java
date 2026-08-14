package com.pharma.backend.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.SanPham;

/**
 * Repository chỉ phục vụ việc chọn sản phẩm
 * cho chương trình khuyến mãi phía Admin.
 */
public interface KhuyenMaiSanPhamAdminRepository
        extends Repository<SanPham, Long> {

    @Query(
            value = """
                    SELECT sp
                    FROM SanPham sp
                    WHERE sp.trangThaiSanPham = true
                      AND sp.laThuocKeDon = false

                      AND (
                            :keyword IS NULL
                            OR LOWER(sp.tenSanPham)
                                LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR (
                                :maSanPhamTimKiem IS NOT NULL
                                AND sp.maSanPham = :maSanPhamTimKiem
                            )
                      )

                      AND NOT EXISTS (
                            SELECT kmKhac.maKhuyenMai
                            FROM KhuyenMai kmKhac
                            JOIN kmKhac.danhSachSanPham spKhac

                            WHERE spKhac.maSanPham = sp.maSanPham

                              AND kmKhac.maKhuyenMai <> :maKhuyenMai

                              AND kmKhac.loaiKhuyenMai = 'SAN_PHAM'

                              AND kmKhac.thoiGianBatDau
                                    < :thoiGianKetThuc

                              AND kmKhac.thoiGianKetThuc
                                    > :thoiGianBatDau
                      )
                    """,
            countQuery = """
                    SELECT COUNT(sp)
                    FROM SanPham sp
                    WHERE sp.trangThaiSanPham = true
                      AND sp.laThuocKeDon = false

                      AND (
                            :keyword IS NULL
                            OR LOWER(sp.tenSanPham)
                                LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR (
                                :maSanPhamTimKiem IS NOT NULL
                                AND sp.maSanPham = :maSanPhamTimKiem
                            )
                      )

                      AND NOT EXISTS (
                            SELECT kmKhac.maKhuyenMai
                            FROM KhuyenMai kmKhac
                            JOIN kmKhac.danhSachSanPham spKhac

                            WHERE spKhac.maSanPham = sp.maSanPham

                              AND kmKhac.maKhuyenMai <> :maKhuyenMai

                              AND kmKhac.loaiKhuyenMai = 'SAN_PHAM'

                              AND kmKhac.thoiGianBatDau
                                    < :thoiGianKetThuc

                              AND kmKhac.thoiGianKetThuc
                                    > :thoiGianBatDau
                      )
                    """
    )
    Page<SanPham> timSanPhamCoTheGanKhuyenMai(
            @Param("maKhuyenMai")
            Long maKhuyenMai,

            @Param("keyword")
            String keyword,

            @Param("maSanPhamTimKiem")
            Long maSanPhamTimKiem,

            @Param("thoiGianBatDau")
            LocalDateTime thoiGianBatDau,

            @Param("thoiGianKetThuc")
            LocalDateTime thoiGianKetThuc,

            Pageable pageable
    );
}