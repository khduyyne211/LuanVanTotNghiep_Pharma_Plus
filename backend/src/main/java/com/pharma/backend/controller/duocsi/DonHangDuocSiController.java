package com.pharma.backend.controller.duocsi;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.donhang.CapNhatTrangThaiDonHangRequest;
import com.pharma.backend.dto.duocsi.donhang.DonHangDuocSiChiTietResponse;
import com.pharma.backend.dto.duocsi.donhang.DonHangDuocSiDanhSachResponse;
import com.pharma.backend.dto.duocsi.donhang.TaoDonHangDuocSiRequest;
import com.pharma.backend.dto.duocsi.donhang.TaoDonTaiQuayRequest;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.duocsi.DonHangDuocSiService;
import com.pharma.backend.service.duocsi.TaoDonHangDuocSiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/duoc-si/don-hang")
@RequiredArgsConstructor
public class DonHangDuocSiController {

    private static final String VAI_TRO_DUOC_SI = "DUOC_SI";

    private final DonHangDuocSiService donHangDuocSiService;
    private final TaoDonHangDuocSiService taoDonHangDuocSiService;

    @GetMapping("/phan-trang")
    public PhanTrangResponse<DonHangDuocSiDanhSachResponse> layDanhSachDonHangPhanTrang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TrangThaiDonHang trangThaiDonHang,
            @RequestParam(required = false) TrangThaiThanhToan trangThaiThanhToan,
            @RequestParam(required = false) TrangThaiKiemDuyetDonHang trangThaiKiemDuyet) {

        layMaDuocSiDangNhap(nguoiDungDangNhap);

        return donHangDuocSiService.layDanhSachDonHangPhanTrang(
                page,
                size,
                keyword,
                trangThaiDonHang,
                trangThaiThanhToan,
                trangThaiKiemDuyet);
    }

    @GetMapping("/{maDonHang}")
    public DonHangDuocSiChiTietResponse layChiTietDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonHang) {

        layMaDuocSiDangNhap(nguoiDungDangNhap);
        return donHangDuocSiService.layChiTietDonHang(maDonHang);
    }

    @PostMapping("/tu-yeu-cau-tu-van/{maYeuCauTuVan}")
    public DonHangDuocSiChiTietResponse taoDonHangTuYeuCauTuVan(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maYeuCauTuVan,
            @Valid @RequestBody TaoDonHangDuocSiRequest request) {

        Long maNhanVien = layMaDuocSiDangNhap(nguoiDungDangNhap);

        return taoDonHangDuocSiService.taoDonHangTuYeuCauTuVan(
                maYeuCauTuVan,
                maNhanVien,
                request);
    }

    @PostMapping("/tu-don-thuoc/{maDonThuoc}")
    public DonHangDuocSiChiTietResponse taoDonHangTuDonThuoc(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonThuoc,
            @Valid @RequestBody TaoDonHangDuocSiRequest request) {

        Long maNhanVien = layMaDuocSiDangNhap(nguoiDungDangNhap);

        return taoDonHangDuocSiService.taoDonHangTuDonThuoc(
                maDonThuoc,
                maNhanVien,
                request);
    }

    @PostMapping("/tai-quay")
    public DonHangDuocSiChiTietResponse taoDonHangTaiQuay(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @Valid @RequestBody TaoDonTaiQuayRequest request) {

        Long maNhanVien = layMaDuocSiDangNhap(nguoiDungDangNhap);
        return taoDonHangDuocSiService.taoDonHangTaiQuay(maNhanVien, request);
    }

    @PutMapping("/{maDonHang}/tiep-nhan")
    public DonHangDuocSiChiTietResponse tiepNhanDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonHang) {

        Long maNhanVien = layMaDuocSiDangNhap(nguoiDungDangNhap);
        return donHangDuocSiService.tiepNhanDonHang(maDonHang, maNhanVien);
    }

    @PutMapping("/{maDonHang}/trang-thai")
    public DonHangDuocSiChiTietResponse capNhatTrangThaiDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonHang,
            @Valid @RequestBody CapNhatTrangThaiDonHangRequest request) {

        Long maNhanVien = layMaDuocSiDangNhap(nguoiDungDangNhap);

        return donHangDuocSiService.capNhatTrangThaiDonHang(
                maDonHang,
                maNhanVien,
                request.getTrangThaiDonHang());
    }

    @PutMapping("/{maDonHang}/huy")
    public DonHangDuocSiChiTietResponse huyDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonHang) {

        layMaDuocSiDangNhap(nguoiDungDangNhap);
        return donHangDuocSiService.huyDonHang(maDonHang);
    }

    private Long layMaDuocSiDangNhap(NguoiDungDangNhap nguoiDungDangNhap) {
        if (nguoiDungDangNhap == null || nguoiDungDangNhap.getMaNhanVien() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập.");
        }

        if (!VAI_TRO_DUOC_SI.equals(nguoiDungDangNhap.getVaiTro())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tài khoản hiện tại không có quyền Dược sĩ.");
        }

        return nguoiDungDangNhap.getMaNhanVien();
    }
}
