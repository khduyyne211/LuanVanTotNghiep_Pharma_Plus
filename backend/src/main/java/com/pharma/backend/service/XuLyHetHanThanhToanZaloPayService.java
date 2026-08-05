package com.pharma.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.entity.DonHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.DonHangRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class XuLyHetHanThanhToanZaloPayService {

    private final DonHangRepository donHangRepository;

    @Transactional
    public boolean huyDonQuaHan(
            Long maDonHang,
            LocalDateTime thoiDiemGioiHan
    ) {
        if (maDonHang == null || thoiDiemGioiHan == null) {
            return false;
        }

        /*
         * Khóa lại đơn hàng trước khi cập nhật để tránh
         * xung đột với callback và yêu cầu thanh toán lại.
         */
        DonHang donHang =
                donHangRepository
                        .timTheoMaDeCapNhat(maDonHang)
                        .orElse(null);

        if (donHang == null
                || !duDieuKienHuy(
                        donHang,
                        thoiDiemGioiHan
                )) {
            return false;
        }

        donHang.setTrangThaiDonHang(
                TrangThaiDonHang.DA_HUY
        );

        donHang.setTrangThaiThanhToan(
                TrangThaiThanhToan
                        .THANH_TOAN_THAT_BAI
        );

        donHangRepository.save(donHang);

        log.info(
                "Tự động hủy đơn ZaloPay quá hạn: maDonHang={}, ngayDatHang={}",
                donHang.getMaDonHang(),
                donHang.getNgayDatHang()
        );

        return true;
    }

    private boolean duDieuKienHuy(
            DonHang donHang,
            LocalDateTime thoiDiemGioiHan
    ) {
        if (donHang.getPhuongThucThanhToan()
                != PhuongThucThanhToan.ZALOPAY) {
            return false;
        }

        if (donHang.getTrangThaiDonHang()
                != TrangThaiDonHang.CHO_THANH_TOAN) {
            return false;
        }

        if (donHang.getTrangThaiThanhToan()
                != TrangThaiThanhToan.CHO_THANH_TOAN) {
            return false;
        }

        if (donHang.getNgayDatHang() == null) {
            return false;
        }

        return !donHang.getNgayDatHang()
                .isAfter(thoiDiemGioiHan);
    }
}