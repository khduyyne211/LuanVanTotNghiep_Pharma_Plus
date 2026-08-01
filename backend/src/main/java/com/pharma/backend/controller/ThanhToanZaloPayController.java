package com.pharma.backend.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.thanhtoan.TaoThanhToanZaloPayResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.ThanhToanZaloPayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/thanh-toan/zalopay")
@RequiredArgsConstructor
public class ThanhToanZaloPayController {

    private final ThanhToanZaloPayService thanhToanZaloPayService;

    @PostMapping("/don-hang/{maDonHang}/tao")
    public TaoThanhToanZaloPayResponseDto taoThanhToan(
            @PathVariable Long maDonHang,
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap
    ) {
        Long maKhachHang = nguoiDungDangNhap != null
                ? nguoiDungDangNhap.getMaKhachHang()
                : null;

        return thanhToanZaloPayService.taoThanhToan(
                maDonHang,
                maKhachHang
        );
    }

    @GetMapping("/don-hang/{maDonHang}/trang-thai")
    public Map<String, Object> layTrangThaiThanhToan(
            @PathVariable Long maDonHang,
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap
    ) {
        Long maKhachHang = nguoiDungDangNhap != null
                ? nguoiDungDangNhap.getMaKhachHang()
                : null;

        return thanhToanZaloPayService.layTrangThaiThanhToan(
                maDonHang,
                maKhachHang
        );
    }

    @PostMapping("/callback")
    public Map<String, Object> nhanCallbackZaloPay(
            @RequestBody Map<String, Object> callbackPayload
    ) {
        return thanhToanZaloPayService.xuLyCallback(callbackPayload);
    }
}
