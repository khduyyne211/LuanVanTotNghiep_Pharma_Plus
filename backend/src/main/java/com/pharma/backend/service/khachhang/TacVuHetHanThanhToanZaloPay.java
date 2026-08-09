package com.pharma.backend.service.khachhang;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.pharma.backend.config.ZaloPayProperties;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.DonHangRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TacVuHetHanThanhToanZaloPay {

    private static final ZoneId MUI_GIO_VIET_NAM =
            ZoneId.of("Asia/Ho_Chi_Minh");

    private final DonHangRepository donHangRepository;

    private final XuLyHetHanThanhToanZaloPayService
            xuLyHetHanThanhToanZaloPayService;

    private final ZaloPayProperties zaloPayProperties;

    @Scheduled(
            fixedDelayString =
                    "${zalopay.expiration-scan-interval-ms:60000}",
            initialDelayString =
                    "${zalopay.expiration-scan-initial-delay-ms:60000}"
    )
    public void quetDonZaloPayQuaHan() {
        try {
            long tongThoiGianChoGiay =
                    layTongThoiGianChoGiay();

            LocalDateTime thoiDiemGioiHan =
                    LocalDateTime.now(
                            MUI_GIO_VIET_NAM
                    ).minusSeconds(
                            tongThoiGianChoGiay
                    );

            /*
             * Theo nghiệp vụ mới:
             *
             * Đơn ZaloPay chưa thanh toán:
             * - Đơn hàng   = CHO_XU_LY
             * - Thanh toán = CHO_THANH_TOAN
             */
            List<Long> danhSachMaDonHang =
                    donHangRepository
                            .timMaDonHangZaloPayChoThanhToanQuaHan(
                                    PhuongThucThanhToan.ZALOPAY,
                                    TrangThaiDonHang.CHO_XU_LY,
                                    TrangThaiThanhToan.CHO_THANH_TOAN,
                                    thoiDiemGioiHan
                            );

            int soDonDaHuy = 0;

            for (Long maDonHang : danhSachMaDonHang) {
                try {
                    boolean daHuy =
                            xuLyHetHanThanhToanZaloPayService
                                    .huyDonQuaHan(
                                            maDonHang,
                                            thoiDiemGioiHan
                                    );

                    if (daHuy) {
                        soDonDaHuy++;
                    }
                } catch (Exception exception) {
                    log.error(
                            "Không thể xử lý hết hạn đơn ZaloPay: maDonHang={}",
                            maDonHang,
                            exception
                    );
                }
            }

            if (soDonDaHuy > 0) {
                log.info(
                        "Hoàn tất quét đơn ZaloPay quá hạn: soDonDaHuy={}",
                        soDonDaHuy
                );
            }
        } catch (Exception exception) {
            log.error(
                    "Tác vụ quét đơn ZaloPay quá hạn gặp lỗi.",
                    exception
            );
        }
    }

    private long layTongThoiGianChoGiay() {
        Long thoiHanThanhToan =
                zaloPayProperties
                        .getOrderPaymentDeadlineSeconds();

        Long thoiGianChoCallback =
                zaloPayProperties
                        .getCallbackGracePeriodSeconds();

        if (thoiHanThanhToan == null
                || thoiHanThanhToan <= 0) {
            throw new IllegalStateException(
                    "Thời hạn thanh toán đơn hàng ZaloPay không hợp lệ."
            );
        }

        if (thoiGianChoCallback == null
                || thoiGianChoCallback < 0) {
            throw new IllegalStateException(
                    "Thời gian chờ callback ZaloPay không hợp lệ."
            );
        }

        try {
            return Math.addExact(
                    thoiHanThanhToan,
                    thoiGianChoCallback
            );
        } catch (ArithmeticException exception) {
            throw new IllegalStateException(
                    "Tổng thời gian chờ thanh toán ZaloPay vượt giới hạn.",
                    exception
            );
        }
    }
}