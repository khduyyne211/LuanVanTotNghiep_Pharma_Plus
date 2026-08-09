package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.sanpham.DuLieuChuyenMonThuocRequest;
import com.pharma.backend.dto.admin.sanpham.ThanhPhanHoatChatTaoMoiRequest;
import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.admin.sanpham.SanPhamRequest;
import com.pharma.backend.dto.admin.sanpham.SanPhamResponse;
import com.pharma.backend.dto.admin.sanpham.SanPhamTaoMoiRequest;
import com.pharma.backend.service.admin.SanPhamService;
import com.pharma.backend.dto.admin.sanpham.DonViSanPhamCapNhatRequest;
import com.pharma.backend.dto.admin.sanpham.QuyDoiDonViCapNhatRequest;
import com.pharma.backend.dto.admin.sanpham.SanPhamNhapKhoOptionResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/san-pham")
@RequiredArgsConstructor
public class SanPhamController {

        private final SanPhamService sanPhamService;

        @GetMapping
        public List<SanPhamResponse> layDanhSachSanPham() {
                return sanPhamService.layDanhSachSanPham();
        }

        @GetMapping("/phan-trang")
        public PhanTrangResponse<SanPhamResponse> layDanhSachSanPhamPhanTrang(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String keyword,
                        @RequestParam(required = false) Boolean laThuocKeDon,
                        @RequestParam(required = false) Boolean trangThaiSanPham,
                        @RequestParam(required = false) Long maDanhMuc,
                        @RequestParam(required = false) Long maNhaSanXuat) {
                return sanPhamService.layDanhSachSanPhamPhanTrang(
                                page,
                                size,
                                keyword,
                                laThuocKeDon,
                                trangThaiSanPham,
                                maDanhMuc,
                                maNhaSanXuat);
        }

        @GetMapping("/{maSanPham}")
        public SanPhamResponse layChiTietSanPham(
                        @PathVariable Long maSanPham) {
                return sanPhamService.layChiTietSanPham(maSanPham);
        }

        @PostMapping
        public SanPhamResponse themSanPham(
                        @RequestBody SanPhamTaoMoiRequest request) {
                return sanPhamService.themSanPham(request);
        }

        @GetMapping("/{maSanPham}/chi-tiet-day-du")
        public SanPhamResponse layChiTietSanPhamDayDu(
                        @PathVariable Long maSanPham) {
                return sanPhamService.layChiTietSanPhamDayDu(
                                maSanPham);
        }

        @PutMapping("/{maSanPham}")
        public SanPhamResponse capNhatSanPham(
                        @PathVariable Long maSanPham,
                        @RequestBody SanPhamRequest request) {
                return sanPhamService.capNhatSanPham(
                                maSanPham,
                                request);
        }

        @PutMapping("/{maSanPham}/thanh-phan-hoat-chat")
        public SanPhamResponse capNhatThanhPhanHoatChat(
                        @PathVariable Long maSanPham,
                        @RequestBody List<ThanhPhanHoatChatTaoMoiRequest> request) {
                return sanPhamService.capNhatThanhPhanHoatChat(
                                maSanPham,
                                request);
        }

        @PutMapping("/{maSanPham}/du-lieu-chuyen-mon")
        public SanPhamResponse capNhatDuLieuChuyenMonThuoc(
                        @PathVariable Long maSanPham,
                        @RequestBody DuLieuChuyenMonThuocRequest request) {
                return sanPhamService.capNhatDuLieuChuyenMonThuoc(
                                maSanPham,
                                request);
        }

        @PutMapping("/{maSanPham}/don-vi")
        public SanPhamResponse capNhatDanhSachDonViSanPham(
                        @PathVariable Long maSanPham,
                        @Valid @RequestBody List<DonViSanPhamCapNhatRequest> request) {
                return sanPhamService.capNhatDanhSachDonViSanPham(
                                maSanPham,
                                request);
        }

        @PutMapping("/{maSanPham}/quy-doi")
        public SanPhamResponse capNhatDanhSachQuyDoiDonVi(
                        @PathVariable Long maSanPham,
                        @Valid @RequestBody List<QuyDoiDonViCapNhatRequest> request) {
                return sanPhamService.capNhatDanhSachQuyDoiDonVi(
                                maSanPham,
                                request);
        }

        @PutMapping("/{maSanPham}/an")
        public SanPhamResponse anSanPham(
                        @PathVariable Long maSanPham) {
                return sanPhamService.anSanPham(maSanPham);
        }

        @PutMapping("/{maSanPham}/hien")
        public SanPhamResponse hienSanPham(
                        @PathVariable Long maSanPham) {
                return sanPhamService.hienSanPham(maSanPham);
        }

        @GetMapping("/tuy-chon-nhap-kho")
        public List<SanPhamNhapKhoOptionResponse> layTuyChonNhapKho() {

                return sanPhamService.layTuyChonNhapKho();
        }
}