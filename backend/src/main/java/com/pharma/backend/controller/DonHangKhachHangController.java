package com.pharma.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.donhang.DonHangDanhSachDto;
import com.pharma.backend.dto.donhang.DonHangResponseDto;
import com.pharma.backend.dto.donhang.TaoDonHangRequestDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.DonHangKhachHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/don-hang/khach-hang")
@RequiredArgsConstructor
public class DonHangKhachHangController {

    private final DonHangKhachHangService donHangKhachHangService;

    @PostMapping
    public ResponseEntity<DonHangResponseDto> taoDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @RequestBody TaoDonHangRequestDto request
    ) {
        DonHangResponseDto donHangDaTao =
                donHangKhachHangService.taoDonHang(
                        nguoiDungDangNhap.getMaKhachHang(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donHangDaTao);
    }

    @GetMapping
    public List<DonHangDanhSachDto> layDanhSachDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap
    ) {
        return donHangKhachHangService.layDanhSachDonHang(
                nguoiDungDangNhap.getMaKhachHang()
        );
    }

    @GetMapping("/{maDonHang}")
    public DonHangResponseDto layChiTietDonHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maDonHang
    ) {
        return donHangKhachHangService.layChiTietDonHang(
                nguoiDungDangNhap.getMaKhachHang(),
                maDonHang
        );
    }
}
