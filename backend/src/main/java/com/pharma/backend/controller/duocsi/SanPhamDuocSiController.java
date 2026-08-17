package com.pharma.backend.controller.duocsi;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.sanpham.SanPhamDuocSiResponse;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.duocsi.SanPhamDuocSiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/duoc-si/san-pham")
@RequiredArgsConstructor
public class SanPhamDuocSiController {

    private static final String VAI_TRO_DUOC_SI = "DUOC_SI";

    private final SanPhamDuocSiService sanPhamDuocSiService;

    @GetMapping("/phan-trang")
    public PhanTrangResponse<SanPhamDuocSiResponse> layDanhSachSanPhamPhanTrang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        kiemTraDuocSiDangNhap(nguoiDungDangNhap);
        return sanPhamDuocSiService.layDanhSachSanPhamPhanTrang(page, size, keyword);
    }

    private void kiemTraDuocSiDangNhap(NguoiDungDangNhap nguoiDungDangNhap) {
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
    }
}
