package com.pharma.backend.controller.duocsi;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocKiemDuyetRequest;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocResponse;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.duocsi.DonThuocService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/duoc-si/don-thuoc")
@RequiredArgsConstructor
public class DonThuocController {

        private static final String VAI_TRO_DUOC_SI = "DUOC_SI";

        private final DonThuocService donThuocService;

        @GetMapping("/phan-trang")
        public PhanTrangResponse<DonThuocResponse> layDanhSachDonThuocPhanTrang(
                        @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,

                        @RequestParam(defaultValue = "0") int page,

                        @RequestParam(defaultValue = "10") int size,

                        @RequestParam(required = false) TrangThaiDonThuoc trangThai,

                        @RequestParam(required = false) String keyword) {

                layMaDuocSiDangNhap(
                                nguoiDungDangNhap);

                return donThuocService
                                .layDanhSachDonThuocPhanTrang(
                                                page,
                                                size,
                                                trangThai,
                                                keyword);
        }

        @GetMapping("/{maDonThuoc}")
        public DonThuocResponse layChiTietDonThuoc(
                        @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,

                        @PathVariable long maDonThuoc) {

                layMaDuocSiDangNhap(
                                nguoiDungDangNhap);

                return donThuocService
                                .layChiTietDonThuoc(
                                                maDonThuoc);
        }

        @PutMapping("/{maDonThuoc}/duyet")
        public DonThuocResponse duyetDonThuoc(
                        @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,

                        @PathVariable long maDonThuoc,

                        @Valid @RequestBody DonThuocKiemDuyetRequest request) {

                Long maNhanVien = layMaDuocSiDangNhap(
                                nguoiDungDangNhap);

                return donThuocService
                                .duyetDonThuoc(
                                                maDonThuoc,
                                                maNhanVien,
                                                request);
        }

        @PutMapping("/{maDonThuoc}/tu-choi")
        public DonThuocResponse tuChoiDonThuoc(
                        @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,

                        @PathVariable long maDonThuoc,

                        @Valid @RequestBody DonThuocKiemDuyetRequest request) {

                Long maNhanVien = layMaDuocSiDangNhap(
                                nguoiDungDangNhap);

                return donThuocService
                                .tuChoiDonThuoc(
                                                maDonThuoc,
                                                maNhanVien,
                                                request);
        }

        private Long layMaDuocSiDangNhap(
                        NguoiDungDangNhap nguoiDungDangNhap) {

                if (nguoiDungDangNhap == null
                                ||
                                nguoiDungDangNhap.getMaNhanVien() == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Không xác định được Dược sĩ đang đăng nhập.");
                }

                if (!VAI_TRO_DUOC_SI.equals(
                                nguoiDungDangNhap.getVaiTro())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Tài khoản hiện tại không có quyền Dược sĩ.");
                }

                return nguoiDungDangNhap.getMaNhanVien();
        }
}