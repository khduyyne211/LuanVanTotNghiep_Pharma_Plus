package com.pharma.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.diachigiaohang.DiaChiGiaoHangResponseDto;
import com.pharma.backend.dto.diachigiaohang.LuuDiaChiGiaoHangRequestDto;
import com.pharma.backend.entity.DiaChiGiaoHang;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.repository.DiaChiGiaoHangRepository;
import com.pharma.backend.repository.KhachHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiaChiGiaoHangService {

        private final DiaChiGiaoHangRepository diaChiGiaoHangRepository;
        private final KhachHangRepository khachHangRepository;

        @Transactional(readOnly = true)
        public List<DiaChiGiaoHangResponseDto> layDanhSachDiaChiDangSuDung(
                        Long maKhachHang) {
                return layDanhSachDiaChiDangSuDungCuaKhachHang(maKhachHang)
                                .stream()
                                .map(this::chuyenSangDiaChiGiaoHangResponseDto)
                                .toList();
        }

        @Transactional
        public DiaChiGiaoHangResponseDto themDiaChiGiaoHang(
                        Long maKhachHang,
                        LuuDiaChiGiaoHangRequestDto request) {
                KhachHang khachHang = layKhachHangDangHoatDong(maKhachHang);
                List<DiaChiGiaoHang> danhSachDiaChi = layDanhSachDiaChiDangSuDungCuaKhachHang(maKhachHang);

                DiaChiGiaoHang diaChiMoi = new DiaChiGiaoHang();
                diaChiMoi.setKhachHang(khachHang);
                diaChiMoi.setTrangThaiSuDung(true);

                ganDuLieuDiaChi(diaChiMoi, request);

                boolean laDiaChiDauTien = danhSachDiaChi.isEmpty();
                boolean datLamMacDinh = laDiaChiDauTien
                                || Boolean.TRUE.equals(request.getLaMacDinh());

                if (datLamMacDinh) {
                        boMacDinhDanhSachDiaChi(danhSachDiaChi);
                }

                diaChiMoi.setLaMacDinh(datLamMacDinh);

                DiaChiGiaoHang diaChiDaLuu = diaChiGiaoHangRepository.save(diaChiMoi);

                return chuyenSangDiaChiGiaoHangResponseDto(diaChiDaLuu);
        }

        @Transactional
        public DiaChiGiaoHangResponseDto capNhatDiaChiGiaoHang(
                        Long maKhachHang,
                        Long maDiaChi,
                        LuuDiaChiGiaoHangRequestDto request) {
                DiaChiGiaoHang diaChi = layDiaChiDangSuDung(maDiaChi, maKhachHang);

                List<DiaChiGiaoHang> danhSachDiaChi = layDanhSachDiaChiDangSuDungCuaKhachHang(maKhachHang);

                ganDuLieuDiaChi(diaChi, request);
                xuLyMacDinhKhiCapNhat(
                                diaChi,
                                danhSachDiaChi,
                                request.getLaMacDinh());

                DiaChiGiaoHang diaChiDaCapNhat = diaChiGiaoHangRepository.save(diaChi);

                return chuyenSangDiaChiGiaoHangResponseDto(
                                diaChiDaCapNhat);
        }

        @Transactional
        public void xoaDiaChiGiaoHang(
                        Long maKhachHang,
                        Long maDiaChi) {
                DiaChiGiaoHang diaChi = layDiaChiDangSuDung(maDiaChi, maKhachHang);

                List<DiaChiGiaoHang> danhSachDiaChi = layDanhSachDiaChiDangSuDungCuaKhachHang(maKhachHang);

                boolean laDiaChiMacDinh = Boolean.TRUE.equals(diaChi.getLaMacDinh());

                diaChi.setTrangThaiSuDung(false);
                diaChi.setLaMacDinh(false);
                diaChiGiaoHangRepository.save(diaChi);

                if (laDiaChiMacDinh) {
                        datDiaChiKhacLamMacDinh(
                                        danhSachDiaChi,
                                        maDiaChi);
                }
        }

        private void xuLyMacDinhKhiCapNhat(
                        DiaChiGiaoHang diaChi,
                        List<DiaChiGiaoHang> danhSachDiaChi,
                        Boolean yeuCauMacDinh) {
                if (Boolean.TRUE.equals(yeuCauMacDinh)) {
                        boMacDinhDanhSachDiaChi(danhSachDiaChi);
                        diaChi.setLaMacDinh(true);
                        return;
                }

                if (!Boolean.TRUE.equals(diaChi.getLaMacDinh())) {
                        diaChi.setLaMacDinh(false);
                        return;
                }

                Optional<DiaChiGiaoHang> diaChiKhac = timDiaChiKhac(danhSachDiaChi, diaChi.getMaDiaChi());

                if (diaChiKhac.isPresent()) {
                        diaChi.setLaMacDinh(false);

                        DiaChiGiaoHang diaChiMacDinhMoi = diaChiKhac.get();

                        diaChiMacDinhMoi.setLaMacDinh(true);
                        diaChiGiaoHangRepository.save(
                                        diaChiMacDinhMoi);
                } else {
                        diaChi.setLaMacDinh(true);
                }
        }

        private void datDiaChiKhacLamMacDinh(
                        List<DiaChiGiaoHang> danhSachDiaChi,
                        Long maDiaChiDaXoa) {
                timDiaChiKhac(danhSachDiaChi, maDiaChiDaXoa)
                                .ifPresent(diaChi -> {
                                        diaChi.setLaMacDinh(true);
                                        diaChiGiaoHangRepository.save(diaChi);
                                });
        }

        private Optional<DiaChiGiaoHang> timDiaChiKhac(
                        List<DiaChiGiaoHang> danhSachDiaChi,
                        Long maDiaChiCanBoQua) {
                return danhSachDiaChi
                                .stream()
                                .filter(diaChi -> !diaChi.getMaDiaChi()
                                                .equals(maDiaChiCanBoQua))
                                .findFirst();
        }

        private void boMacDinhDanhSachDiaChi(
                        List<DiaChiGiaoHang> danhSachDiaChi) {
                danhSachDiaChi.forEach(
                                diaChi -> diaChi.setLaMacDinh(false));

                diaChiGiaoHangRepository.saveAll(
                                danhSachDiaChi);
        }

        private void ganDuLieuDiaChi(
                        DiaChiGiaoHang diaChi,
                        LuuDiaChiGiaoHangRequestDto request) {
                diaChi.setTenNguoiNhan(
                                request.getTenNguoiNhan().trim());

                diaChi.setSoDienThoaiNhan(
                                request.getSoDienThoaiNhan().trim());

                diaChi.setThanhPho(
                                request.getThanhPho().trim());

                diaChi.setPhuongKhuVuc(
                                request.getPhuongKhuVuc().trim());

                diaChi.setDiaChiChiTiet(
                                request.getDiaChiChiTiet().trim());
        }

        private KhachHang layKhachHangDangHoatDong(
                        Long maKhachHang) {
                if (maKhachHang == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Không xác định được khách hàng đang đăng nhập.");
                }

                return khachHangRepository
                                .findById(maKhachHang)
                                .filter(khachHang -> Boolean.TRUE.equals(
                                                khachHang.getTrangThai()))
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy khách hàng đang hoạt động."));
        }

        private DiaChiGiaoHang layDiaChiDangSuDung(
                        Long maDiaChi,
                        Long maKhachHang) {
                return diaChiGiaoHangRepository
                                .findByMaDiaChiAndKhachHang_MaKhachHangAndTrangThaiSuDungTrue(
                                                maDiaChi,
                                                maKhachHang)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy địa chỉ giao hàng."));
        }

        private List<DiaChiGiaoHang> layDanhSachDiaChiDangSuDungCuaKhachHang(
                        Long maKhachHang) {
                return diaChiGiaoHangRepository
                                .findByKhachHang_MaKhachHangAndTrangThaiSuDungTrueOrderByLaMacDinhDescMaDiaChiDesc(
                                                maKhachHang);
        }

        private DiaChiGiaoHangResponseDto chuyenSangDiaChiGiaoHangResponseDto(
                        DiaChiGiaoHang diaChi) {
                return new DiaChiGiaoHangResponseDto(
                                diaChi.getMaDiaChi(),
                                diaChi.getTenNguoiNhan(),
                                diaChi.getSoDienThoaiNhan(),
                                diaChi.getThanhPho(),
                                diaChi.getPhuongKhuVuc(),
                                diaChi.getDiaChiChiTiet(),
                                diaChi.getLaMacDinh(),
                                diaChi.getTrangThaiSuDung());
        }
}
