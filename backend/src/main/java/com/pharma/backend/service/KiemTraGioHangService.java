package com.pharma.backend.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.giohang.ChiTietGioHangLocalRequestDto;
import com.pharma.backend.dto.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.giohang.KiemTraGioHangResponseDto;
import com.pharma.backend.dto.giohang.ThongTinKiemTraGioHangDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;

import lombok.RequiredArgsConstructor;
// Vai trò:
// Nhận giỏ hàng local
// → kiểm tra đơn vị bán
// → tính hệ số về đơn vị cơ sở
// → gom số lượng theo mã sản phẩm
// → lấy tổng tồn tất cả lô hợp lệ
// → xác định giỏ hàng hợp lệ
// → trả giá, hệ số và tồn mới nhất
@Service
@RequiredArgsConstructor
public class KiemTraGioHangService {

    private final DonViSanPhamRepository donViSanPhamRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

    @Transactional(readOnly = true)
    public KiemTraGioHangResponseDto kiemTraGioHang(KiemTraGioHangRequestDto request) {
        Map<Long, Integer> soLuongTheoDonVi = chuanHoaDanhSachChiTiet(request);
        List<DonViSanPham> danhSachDonVi = donViSanPhamRepository.findAllById(soLuongTheoDonVi.keySet());
        Map<Long, DonViSanPham> donViTheoMa = taoMapDonViSanPham(danhSachDonVi);

        if (donViTheoMa.size() != soLuongTheoDonVi.size()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Có đơn vị sản phẩm không tồn tại."
            );
        }

        List<ThongTinKiemTraGioHangDto> danhSachThongTin = new ArrayList<>();
        Map<Long, BigDecimal> tongCanTheoSanPham = new HashMap<>();
        Map<Long, BigDecimal> tonTheoSanPham = new HashMap<>();
        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham = new HashMap<>();

        for (Map.Entry<Long, Integer> entry : soLuongTheoDonVi.entrySet()) {
            DonViSanPham donViSanPham = donViTheoMa.get(entry.getKey());
            kiemTraDonViDuocBan(donViSanPham);

            Long maSanPham = donViSanPham.getSanPham().getMaSanPham();

            List<QuyDoiDonVi> danhSachQuyDoi = quyDoiTheoSanPham.computeIfAbsent(
                maSanPham,
                quyDoiDonViRepository::findBySanPham_MaSanPhamOrderByMaQuyDoiAsc
            );

            BigDecimal heSoQuyDoi = tinhHeSoVeDonViCoSo(
                donViSanPham,
                danhSachQuyDoi
            );

            BigDecimal tonKhaDung = tonTheoSanPham.computeIfAbsent(
                maSanPham,
                chiTietPhieuNhapRepository::tinhTongTonKhaDungTheoQuyDoi
            );

            BigDecimal soLuongCan = heSoQuyDoi.multiply(
                BigDecimal.valueOf(entry.getValue())
            );

            tongCanTheoSanPham.merge(
                maSanPham,
                soLuongCan,
                BigDecimal::add
            );

            danhSachThongTin.add(new ThongTinKiemTraGioHangDto(
                maSanPham,
                donViSanPham.getMaDonViSanPham(),
                donViSanPham.getGiaBanTheoDonVi(),
                heSoQuyDoi,
                tonKhaDung
            ));
        }

        boolean hopLe = kiemTraDuTon(
            tongCanTheoSanPham,
            tonTheoSanPham
        );

        return new KiemTraGioHangResponseDto(
            hopLe,
            danhSachThongTin
        );
    }

    //dùng cho API: POST /api/gio-hang/dong-bo, Nếu không đủ tồn, hàm sẽ dừng luồng bằng lỗi: HTTP 409 Conflict
    //Nhờ vậy service đồng bộ sẽ không chạy các bước:
    // Xóa chi_tiet_gio_hang cũ
    // Tạo chi_tiet_gio_hang mới
    @Transactional(readOnly = true)
    public KiemTraGioHangResponseDto kiemTraDuDieuKienDongBo(KiemTraGioHangRequestDto request) {
        KiemTraGioHangResponseDto ketQuaKiemTra = kiemTraGioHang(request);

        if (!ketQuaKiemTra.isHopLe()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Một hoặc nhiều sản phẩm không đủ số lượng tồn kho."
            );
        }

        return ketQuaKiemTra;
    }

    private Map<Long, Integer> chuanHoaDanhSachChiTiet(
        KiemTraGioHangRequestDto request
    ) {
        if (request == null
                || request.getDanhSachChiTiet() == null
                || request.getDanhSachChiTiet().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Giỏ hàng không có sản phẩm."
            );
        }

        Map<Long, Integer> soLuongTheoDonVi = new LinkedHashMap<>();

        for (ChiTietGioHangLocalRequestDto chiTiet : request.getDanhSachChiTiet()) {
            if (chiTiet == null
                    || chiTiet.getMaDonViSanPham() == null
                    || chiTiet.getSoLuong() == null
                    || chiTiet.getSoLuong() <= 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn vị sản phẩm và số lượng phải hợp lệ."
                );
            }

            soLuongTheoDonVi.merge(
                chiTiet.getMaDonViSanPham(),
                chiTiet.getSoLuong(),
                Integer::sum
            );
        }

        return soLuongTheoDonVi;
    }

    private Map<Long, DonViSanPham> taoMapDonViSanPham(
        List<DonViSanPham> danhSachDonVi
    ) {
        Map<Long, DonViSanPham> donViTheoMa = new HashMap<>();

        for (DonViSanPham donViSanPham : danhSachDonVi) {
            donViTheoMa.put(
                donViSanPham.getMaDonViSanPham(),
                donViSanPham
            );
        }

        return donViTheoMa;
    }

    private void kiemTraDonViDuocBan(DonViSanPham donViSanPham) {
        if (!Boolean.TRUE.equals(donViSanPham.getTrangThai())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Đơn vị sản phẩm đã ngừng hoạt động."
            );
        }

        if (!Boolean.TRUE.equals(donViSanPham.getChoPhepBan())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Đơn vị sản phẩm không được phép bán."
            );
        }

        if (donViSanPham.getGiaBanTheoDonVi() == null
                || donViSanPham.getGiaBanTheoDonVi().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Đơn vị sản phẩm chưa có giá bán hợp lệ."
            );
        }
    }

    private BigDecimal tinhHeSoVeDonViCoSo(
        DonViSanPham donViBan,
        List<QuyDoiDonVi> danhSachQuyDoi
    ) {
        if (Boolean.TRUE.equals(donViBan.getLaDonViCoSo())) {
            return BigDecimal.ONE;
        }

        Map<Long, List<BuocQuyDoi>> doThiQuyDoi = taoDoThiQuyDoi(
            danhSachQuyDoi
        );

        Deque<TrangThaiQuyDoi> hangDoi = new ArrayDeque<>();
        Set<Long> danhSachDaDuyet = new HashSet<>();

        hangDoi.add(new TrangThaiQuyDoi(
            donViBan,
            BigDecimal.ONE
        ));

        while (!hangDoi.isEmpty()) {
            TrangThaiQuyDoi trangThai = hangDoi.removeFirst();
            DonViSanPham donViHienTai = trangThai.donViSanPham;
            Long maDonViHienTai = donViHienTai.getMaDonViSanPham();

            if (!danhSachDaDuyet.add(maDonViHienTai)) {
                continue;
            }

            if (Boolean.TRUE.equals(donViHienTai.getLaDonViCoSo())) {
                return trangThai.heSoTuDonViBan;
            }

            List<BuocQuyDoi> danhSachBuoc = doThiQuyDoi.getOrDefault(
                maDonViHienTai,
                List.of()
            );

            for (BuocQuyDoi buocQuyDoi : danhSachBuoc) {
                BigDecimal heSoMoi = trangThai.heSoTuDonViBan.multiply(
                    buocQuyDoi.heSo,
                    MathContext.DECIMAL128
                );

                hangDoi.addLast(new TrangThaiQuyDoi(
                    buocQuyDoi.donViDich,
                    heSoMoi
                ));
            }
        }

        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Không tìm thấy đường quy đổi từ đơn vị bán về đơn vị cơ sở."
        );
    }

    private Map<Long, List<BuocQuyDoi>> taoDoThiQuyDoi(
        List<QuyDoiDonVi> danhSachQuyDoi
    ) {
        Map<Long, List<BuocQuyDoi>> doThiQuyDoi = new HashMap<>();

        for (QuyDoiDonVi quyDoi : danhSachQuyDoi) {
            if (!Boolean.TRUE.equals(quyDoi.getTrangThai())) {
                continue;
            }

            if (quyDoi.getSoLuongNguon() == null
                    || quyDoi.getSoLuongDich() == null
                    || quyDoi.getSoLuongNguon().compareTo(BigDecimal.ZERO) <= 0
                    || quyDoi.getSoLuongDich().compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal heSoNguonSangDich = quyDoi.getSoLuongDich().divide(
                quyDoi.getSoLuongNguon(),
                MathContext.DECIMAL128
            );

            BigDecimal heSoDichSangNguon = quyDoi.getSoLuongNguon().divide(
                quyDoi.getSoLuongDich(),
                MathContext.DECIMAL128
            );

            themCanhQuyDoi(
                doThiQuyDoi,
                quyDoi.getDonViNguon(),
                quyDoi.getDonViDich(),
                heSoNguonSangDich
            );

            themCanhQuyDoi(
                doThiQuyDoi,
                quyDoi.getDonViDich(),
                quyDoi.getDonViNguon(),
                heSoDichSangNguon
            );
        }

        return doThiQuyDoi;
    }

    private void themCanhQuyDoi(
        Map<Long, List<BuocQuyDoi>> doThiQuyDoi,
        DonViSanPham donViNguon,
        DonViSanPham donViDich,
        BigDecimal heSo
    ) {
        doThiQuyDoi.computeIfAbsent(
            donViNguon.getMaDonViSanPham(),
            maDonVi -> new ArrayList<>()
        ).add(new BuocQuyDoi(
            donViDich,
            heSo
        ));
    }

    private boolean kiemTraDuTon(
        Map<Long, BigDecimal> tongCanTheoSanPham,
        Map<Long, BigDecimal> tonTheoSanPham
    ) {
        for (Map.Entry<Long, BigDecimal> entry : tongCanTheoSanPham.entrySet()) {
            BigDecimal tonKhaDung = tonTheoSanPham.getOrDefault(
                entry.getKey(),
                BigDecimal.ZERO
            );

            if (entry.getValue().compareTo(tonKhaDung) > 0) {
                return false;
            }
        }

        return true;
    }

    private static class BuocQuyDoi {

        private final DonViSanPham donViDich;
        private final BigDecimal heSo;

        private BuocQuyDoi(
            DonViSanPham donViDich,
            BigDecimal heSo
        ) {
            this.donViDich = donViDich;
            this.heSo = heSo;
        }
    }

    private static class TrangThaiQuyDoi {

        private final DonViSanPham donViSanPham;
        private final BigDecimal heSoTuDonViBan;

        private TrangThaiQuyDoi(
            DonViSanPham donViSanPham,
            BigDecimal heSoTuDonViBan
        ) {
            this.donViSanPham = donViSanPham;
            this.heSoTuDonViBan = heSoTuDonViBan;
        }
    }
}