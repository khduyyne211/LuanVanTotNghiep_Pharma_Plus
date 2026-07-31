package com.pharma.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.giohang.GioHangResponseDto;
import com.pharma.backend.dto.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.giohang.KiemTraGioHangResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.DongBoGioHangService;
import com.pharma.backend.service.GioHangService;
import com.pharma.backend.service.KiemTraGioHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gio-hang")
@RequiredArgsConstructor
public class GioHangController {

    private final GioHangService gioHangService;
    private final KiemTraGioHangService kiemTraGioHangService;
    private final DongBoGioHangService dongBoGioHangService;

    @GetMapping
    public GioHangResponseDto layGioHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap) {
        Long maKhachHang = layMaKhachHangDangNhap(
                nguoiDungDangNhap);

        return gioHangService.layGioHang(maKhachHang);
    }

    private Long layMaKhachHangDangNhap(
            NguoiDungDangNhap nguoiDungDangNhap) {
        if (nguoiDungDangNhap == null
                || nguoiDungDangNhap.getMaKhachHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập.");
        }

        return nguoiDungDangNhap.getMaKhachHang();
    }

    // endpoint kiểm tra giỏ hàng
    @PostMapping("/kiem-tra")
    public KiemTraGioHangResponseDto kiemTraGioHang(@RequestBody KiemTraGioHangRequestDto request) {
        return kiemTraGioHangService.kiemTraGioHang(request);
    }

    // endpoint đồng bộ
    @PostMapping("/dong-bo")
    public KiemTraGioHangResponseDto dongBoGioHang(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @RequestBody KiemTraGioHangRequestDto request) {
        return dongBoGioHangService.dongBoGioHang(nguoiDungDangNhap.getMaKhachHang(), request);
    }
}
