package com.pharma.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.tuvan.TaoYeuCauTuVanRequestDto;
import com.pharma.backend.dto.tuvan.ThongTinTaoYeuCauTuVanResponseDto;
import com.pharma.backend.dto.tuvan.YeuCauTuVanChiTietResponseDto;
import com.pharma.backend.dto.tuvan.YeuCauTuVanDanhSachResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.YeuCauTuVanKhachHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/yeu-cau-tu-van/khach-hang")
@RequiredArgsConstructor
public class YeuCauTuVanKhachHangController {

    private final YeuCauTuVanKhachHangService yeuCauTuVanKhachHangService;

    @GetMapping("/thong-tin-tao-moi")
    public ResponseEntity<ThongTinTaoYeuCauTuVanResponseDto>
            layThongTinTaoYeuCauTuVan(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap
            ) {
        return ResponseEntity.ok(
                yeuCauTuVanKhachHangService.layThongTinTaoYeuCauTuVan(
                        layMaKhachHang(nguoiDungDangNhap)
                )
        );
    }

    @PostMapping
    public ResponseEntity<YeuCauTuVanDanhSachResponseDto> taoYeuCauTuVan(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @RequestBody TaoYeuCauTuVanRequestDto request
    ) {
        YeuCauTuVanDanhSachResponseDto yeuCauDaTao =
                yeuCauTuVanKhachHangService.taoYeuCauTuVan(
                        layMaKhachHang(nguoiDungDangNhap),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(yeuCauDaTao);
    }

    @GetMapping("/cua-toi")
    public ResponseEntity<PageResponseDto<YeuCauTuVanDanhSachResponseDto>>
            layDanhSachCuaToi(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap,
                    @RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "10") int size
            ) {
        return ResponseEntity.ok(
                yeuCauTuVanKhachHangService.layDanhSachCuaToi(
layMaKhachHang(nguoiDungDangNhap),
                        page,
                        size
                )
        );
    }

    @GetMapping("/cua-toi/{maYeuCauTuVan}")
    public ResponseEntity<YeuCauTuVanChiTietResponseDto> layChiTietCuaToi(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @PathVariable Long maYeuCauTuVan
    ) {
        return ResponseEntity.ok(
                yeuCauTuVanKhachHangService.layChiTietCuaToi(
                        layMaKhachHang(nguoiDungDangNhap),
                        maYeuCauTuVan
                )
        );
    }

    private Long layMaKhachHang(
            NguoiDungDangNhap nguoiDungDangNhap
    ) {
        return nguoiDungDangNhap != null
                ? nguoiDungDangNhap.getMaKhachHang()
                : null;
    }
}
