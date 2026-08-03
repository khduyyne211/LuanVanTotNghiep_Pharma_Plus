package com.pharma.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.thongtincanhan.CapNhatThongTinCaNhanRequestDto;
import com.pharma.backend.dto.thongtincanhan.ThongTinCaNhanResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.ThongTinCaNhanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/thong-tin-ca-nhan")
@RequiredArgsConstructor
public class ThongTinCaNhanController {

    private final ThongTinCaNhanService thongTinCaNhanService;

    @GetMapping
    public ResponseEntity<ThongTinCaNhanResponseDto> layThongTinCaNhan(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap
    ) {
        return ResponseEntity.ok(
                thongTinCaNhanService.layThongTinCaNhan(
                        layMaKhachHangDangNhap(nguoiDungDangNhap)
                )
        );
    }

    @PutMapping
    public ResponseEntity<ThongTinCaNhanResponseDto> capNhatThongTinCaNhan(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @Valid @RequestBody CapNhatThongTinCaNhanRequestDto request
    ) {
        return ResponseEntity.ok(
                thongTinCaNhanService.capNhatThongTinCaNhan(
                        layMaKhachHangDangNhap(nguoiDungDangNhap),
                        request
                )
        );
    }

    private Long layMaKhachHangDangNhap(NguoiDungDangNhap nguoiDungDangNhap) {
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