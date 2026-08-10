package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.dashboard.DashboardDoanhThuResponse;
import com.pharma.backend.dto.admin.dashboard.DashboardDoanhThuTheoNgayResponse;
import com.pharma.backend.dto.admin.dashboard.DashboardLoSapHetHanResponse;
import com.pharma.backend.dto.admin.dashboard.DashboardTonKhoThapResponse;
import com.pharma.backend.dto.admin.dashboard.DashboardTongQuanResponse;
import com.pharma.backend.dto.admin.dashboard.DashboardTrangThaiDonHangResponse;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private static final ZoneId MUI_GIO_VIET_NAM = ZoneId.of("Asia/Ho_Chi_Minh");

        private final SanPhamRepository sanPhamRepository;

        private final KhachHangRepository khachHangRepository;

        private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

        private final DonHangRepository donHangRepository;

        private final ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

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
                                .tongSanPham(
                                                sanPhamRepository.count())
                                .tongKhachHang(
                                                khachHangRepository.count())
                                .tongNhanVien(
                                                nhanVienNoiBoRepository.count())
                                .donMoiHomNay(
                                                donMoiHomNay)
                                .donDangXuLy(
                                                donDangXuLy)
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

        @Transactional(readOnly = true)
        public List<DashboardDoanhThuTheoNgayResponse> layDoanhThu7NgayGanNhat() {
                LocalDate homNay = LocalDate.now(MUI_GIO_VIET_NAM);

                List<DashboardDoanhThuTheoNgayResponse> ketQua = new ArrayList<>();

                for (int soNgayLui = 6; soNgayLui >= 0; soNgayLui--) {
                        LocalDate ngay = homNay.minusDays(soNgayLui);

                        LocalDateTime dauNgay = ngay.atStartOfDay();

                        LocalDateTime dauNgayKeTiep = ngay.plusDays(1).atStartOfDay();

                        BigDecimal doanhThu = donHangRepository.tinhDoanhThuTrongKhoang(
                                        dauNgay,
                                        dauNgayKeTiep,
                                        TrangThaiDonHang.HOAN_THANH,
                                        TrangThaiThanhToan.DA_THANH_TOAN);

                        ketQua.add(
                                        DashboardDoanhThuTheoNgayResponse.builder()
                                                        .ngay(ngay)
                                                        .doanhThu(
                                                                        doanhThu != null
                                                                                        ? doanhThu
                                                                                        : BigDecimal.ZERO)
                                                        .build());
                }

                return ketQua;
        }

        @Transactional(readOnly = true)
        public List<DashboardTrangThaiDonHangResponse> layThongKeTrangThaiDonHang() {
                List<DashboardTrangThaiDonHangResponse> ketQua = new ArrayList<>();

                for (TrangThaiDonHang trangThai : TrangThaiDonHang.values()) {
                        long soLuong = donHangRepository.countByTrangThaiDonHang(
                                        trangThai);

                        ketQua.add(
                                        DashboardTrangThaiDonHangResponse.builder()
                                                        .trangThai(trangThai)
                                                        .soLuong(soLuong)
                                                        .build());
                }

                return ketQua;
        }

        @Transactional(readOnly = true)
        public List<DashboardTonKhoThapResponse> layDanhSachTonKhoThap(
                        BigDecimal nguongTon) {
                if (nguongTon == null) {
                        throw new IllegalArgumentException(
                                        "Ngưỡng tồn kho không được để trống");
                }

                if (nguongTon.compareTo(BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException(
                                        "Ngưỡng tồn kho không được nhỏ hơn 0");
                }

                LocalDate homNay = LocalDate.now(MUI_GIO_VIET_NAM);

                return chiTietPhieuNhapRepository
                                .timSanPhamTonKhoThap(
                                                homNay,
                                                nguongTon)
                                .stream()
                                .map(item -> DashboardTonKhoThapResponse.builder()
                                                .maSanPham(
                                                                item.getMaSanPham())
                                                .tenSanPham(
                                                                item.getTenSanPham())
                                                .tongSoLuongTon(
                                                                item.getTongSoLuongTon())
                                                .nguongTon(
                                                                nguongTon)
                                                .build())
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<DashboardLoSapHetHanResponse> layDanhSachLoSapHetHan(
                        int soNgay) {
                if (soNgay <= 0) {
                        throw new IllegalArgumentException(
                                        "Số ngày cảnh báo phải lớn hơn 0");
                }

                LocalDate homNay = LocalDate.now(MUI_GIO_VIET_NAM);

                LocalDate denNgay = homNay.plusDays(soNgay);

                return chiTietPhieuNhapRepository
                                .timLoSapHetHan(
                                                homNay,
                                                denNgay)
                                .stream()
                                .map(item -> {
                                        long soNgayConLai = ChronoUnit.DAYS.between(
                                                        homNay,
                                                        item.getHanSuDung());

                                        return DashboardLoSapHetHanResponse.builder()
                                                        .maChiTietPhieuNhap(
                                                                        item.getMaChiTietPhieuNhap())
                                                        .maPhieuNhap(
                                                                        item.getMaPhieuNhap())
                                                        .maSanPham(
                                                                        item.getMaSanPham())
                                                        .tenSanPham(
                                                                        item.getTenSanPham())
                                                        .maDonViSanPham(
                                                                        item.getMaDonViSanPham())
                                                        .tenDonViTinh(
                                                                        item.getTenDonViTinh())
                                                        .soLuongConLai(
                                                                        item.getSoLuongConLai())
                                                        .hanSuDung(
                                                                        item.getHanSuDung())
                                                        .soNgayConLai(
                                                                        soNgayConLai)
                                                        .mucCanhBao(
                                                                        xacDinhMucCanhBaoHetHan(
                                                                                        soNgayConLai))
                                                        .build();
                                })
                                .toList();
        }

        private String xacDinhMucCanhBaoHetHan(
                        long soNgayConLai) {
                if (soNgayConLai <= 7) {
                        return "NGUY_CAP";
                }

                if (soNgayConLai <= 15) {
                        return "SAP_HET_HAN";
                }

                return "CAN_THEO_DOI";
        }
}