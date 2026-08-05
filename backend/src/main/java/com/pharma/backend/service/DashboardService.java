package com.pharma.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.dashboard.DashboardTongQuanResponse;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.SanPhamRepository;
import com.pharma.backend.dto.dashboard.DashboardDoanhThuResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final ZoneId MUI_GIO_VIET_NAM = ZoneId.of("Asia/Ho_Chi_Minh");

    private final SanPhamRepository sanPhamRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;
    private final DonHangRepository donHangRepository;

    @Transactional(readOnly = true)
    public DashboardTongQuanResponse layTongQuan() {
        LocalDate homNay = LocalDate.now(MUI_GIO_VIET_NAM);

        LocalDateTime dauNgay = homNay.atStartOfDay();

        LocalDateTime dauNgayKeTiep = homNay.plusDays(1).atStartOfDay();

        LocalDateTime dauThang = homNay.withDayOfMonth(1).atStartOfDay();

        LocalDateTime dauThangKeTiep = homNay.withDayOfMonth(1)
                .plusMonths(1)
                .atStartOfDay();

        long donMoiHomNay = donHangRepository
                .countByNgayDatHangGreaterThanEqualAndNgayDatHangLessThan(
                        dauNgay,
                        dauNgayKeTiep);

        long donDangXuLy = donHangRepository.countByTrangThaiDonHang(
                TrangThaiDonHang.DANG_XU_LY);

        BigDecimal doanhThuHomNay = donHangRepository.tinhDoanhThuTrongKhoang(
                dauNgay,
                dauNgayKeTiep,
                TrangThaiDonHang.HOAN_THANH,
                TrangThaiThanhToan.DA_THANH_TOAN);

        BigDecimal doanhThuThangNay = donHangRepository.tinhDoanhThuTrongKhoang(
                dauThang,
                dauThangKeTiep,
                TrangThaiDonHang.HOAN_THANH,
                TrangThaiThanhToan.DA_THANH_TOAN);

        return DashboardTongQuanResponse.builder()
                .tongSanPham(sanPhamRepository.count())
                .tongKhachHang(khachHangRepository.count())
                .tongNhanVien(nhanVienNoiBoRepository.count())
                .donMoiHomNay(donMoiHomNay)
                .donDangXuLy(donDangXuLy)
                .doanhThuHomNay(
                        doanhThuHomNay != null
                                ? doanhThuHomNay
                                : BigDecimal.ZERO)
                .doanhThuThangNay(
                        doanhThuThangNay != null
                                ? doanhThuThangNay
                                : BigDecimal.ZERO)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardDoanhThuResponse layDoanhThuTheoKhoang(
            LocalDate tuNgay,
            LocalDate denNgay) {
        if (tuNgay == null || denNgay == null) {
            throw new IllegalArgumentException(
                    "Ngày bắt đầu và ngày kết thúc không được để trống");
        }

        if (tuNgay.isAfter(denNgay)) {
            throw new IllegalArgumentException(
                    "Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }

        LocalDateTime thoiDiemBatDau = tuNgay.atStartOfDay();

        LocalDateTime thoiDiemKetThuc = denNgay.plusDays(1).atStartOfDay();

        BigDecimal doanhThu = donHangRepository.tinhDoanhThuTrongKhoang(
                thoiDiemBatDau,
                thoiDiemKetThuc,
                TrangThaiDonHang.HOAN_THANH,
                TrangThaiThanhToan.DA_THANH_TOAN);

        return DashboardDoanhThuResponse.builder()
                .tuNgay(tuNgay)
                .denNgay(denNgay)
                .doanhThu(
                        doanhThu != null
                                ? doanhThu
                                : BigDecimal.ZERO)
                .build();
    }
}