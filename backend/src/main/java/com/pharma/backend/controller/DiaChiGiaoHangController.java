package com.pharma.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.diachigiaohang.DiaChiGiaoHangResponseDto;
import com.pharma.backend.dto.diachigiaohang.LuuDiaChiGiaoHangRequestDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.DiaChiGiaoHangService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dia-chi-giao-hang")
@RequiredArgsConstructor
public class DiaChiGiaoHangController {

    private final DiaChiGiaoHangService diaChiGiaoHangService;

    @GetMapping
    public ResponseEntity<List<DiaChiGiaoHangResponseDto>>
        layDanhSachDiaChiDangSuDung(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap
        ) {
        Long maKhachHang =
                layMaKhachHangDangNhap(nguoiDungDangNhap);

        return ResponseEntity.ok(
                diaChiGiaoHangService
                        .layDanhSachDiaChiDangSuDung(
                                maKhachHang
                        )
        );
    }

    @PostMapping
    public ResponseEntity<DiaChiGiaoHangResponseDto>
        themDiaChiGiaoHang(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @Valid
            @RequestBody
            LuuDiaChiGiaoHangRequestDto request
        ) {
        Long maKhachHang =
                layMaKhachHangDangNhap(nguoiDungDangNhap);

        DiaChiGiaoHangResponseDto diaChiMoi =
                diaChiGiaoHangService
                        .themDiaChiGiaoHang(
                                maKhachHang,
                                request
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(diaChiMoi);
    }

    @PutMapping("/{maDiaChi}")
    public ResponseEntity<DiaChiGiaoHangResponseDto>
        capNhatDiaChiGiaoHang(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @PathVariable
            Long maDiaChi,

            @Valid
            @RequestBody
            LuuDiaChiGiaoHangRequestDto request
        ) {
        Long maKhachHang =
                layMaKhachHangDangNhap(nguoiDungDangNhap);

        return ResponseEntity.ok(
                diaChiGiaoHangService
                        .capNhatDiaChiGiaoHang(
                                maKhachHang,
                                maDiaChi,
                                request
                        )
        );
    }

    @DeleteMapping("/{maDiaChi}")
    public ResponseEntity<Void> xoaDiaChiGiaoHang(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @PathVariable
            Long maDiaChi
    ) {
        Long maKhachHang =
                layMaKhachHangDangNhap(nguoiDungDangNhap);

        diaChiGiaoHangService.xoaDiaChiGiaoHang(
                maKhachHang,
                maDiaChi
        );

        return ResponseEntity.noContent().build();
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