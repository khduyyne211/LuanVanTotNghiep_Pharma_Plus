package com.pharma.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.VoucherDonHang;

import jakarta.persistence.LockModeType;

public interface VoucherDonHangRepository
        extends JpaRepository<VoucherDonHang, Long> {

    /*
     * Mã giảm giá trong database là UNIQUE.
     *
     * IgnoreCase giúp khách nhập:
     * SALE100K, sale100k, Sale100K
     * đều được hiểu là cùng một mã.
     */
    Optional<VoucherDonHang>
            findByMaGiamGiaIgnoreCase(
                    String maGiamGia
            );

    /*
     * Danh sách voucher có thể giới thiệu
     * cho khách ở thời điểm hiện tại.
     *
     * Chỉ lấy:
     * - đang bật;
     * - đã bắt đầu;
     * - chưa hết hạn;
     * - vẫn còn lượt.
     *
     * Điều kiện giá trị đơn tối thiểu sẽ được
     * Service kiểm tra theo chính giỏ hàng hiện tại.
     */
    @Query("""
            SELECT v
            FROM VoucherDonHang v
            WHERE v.trangThai = true
              AND v.thoiGianBatDau <= :thoiDiem
              AND v.thoiGianKetThuc >= :thoiDiem
              AND v.soLuongDaSuDung < v.soLuongSuDung
            ORDER BY
                v.thoiGianKetThuc ASC,
                v.maVoucher ASC
            """)
    List<VoucherDonHang>
            timVoucherDangCoHieuLuc(
                    @Param("thoiDiem")
                    LocalDateTime thoiDiem
            );

    /*
     * Dùng ở bước tạo đơn/hủy đơn sau này.
     *
     * Khóa voucher để nhiều khách không đồng thời
     * sử dụng vượt quá số lượt còn lại.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT v
            FROM VoucherDonHang v
            WHERE v.maVoucher = :maVoucher
            """)
    Optional<VoucherDonHang>
            timTheoMaDeCapNhat(
                    @Param("maVoucher")
                    Long maVoucher
            );
}