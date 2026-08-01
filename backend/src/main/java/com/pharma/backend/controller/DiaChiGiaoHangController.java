package com.pharma.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.diachigiaohang.DiaChiGiaoHangResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.DiaChiGiaoHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dia-chi-giao-hang")
@RequiredArgsConstructor
public class DiaChiGiaoHangController {

    private final DiaChiGiaoHangService
        diaChiGiaoHangService;

    @GetMapping
    public List<DiaChiGiaoHangResponseDto>
        layDanhSachDiaChiDangSuDung(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap
        ) {

        Long maKhachHang =
            layMaKhachHangDangNhap(
                nguoiDungDangNhap
            );

        return diaChiGiaoHangService
            .layDanhSachDiaChiDangSuDung(
                maKhachHang
            );
    }

    private Long layMaKhachHangDangNhap(
        NguoiDungDangNhap nguoiDungDangNhap
    ) {
        if (
            nguoiDungDangNhap == null ||
            nguoiDungDangNhap.getMaKhachHang() == null
        ) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Không xác định được khách hàng đang đăng nhập."
            );
        }

        return nguoiDungDangNhap.getMaKhachHang();
    }
}