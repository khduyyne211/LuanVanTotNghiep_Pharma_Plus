package com.pharma.backend.controller.duocsi;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.duocsi.tuvan.HoanTatYeuCauTuVanRequestDto;
import com.pharma.backend.dto.duocsi.tuvan.YeuCauTuVanDuocSiChiTietResponseDto;
import com.pharma.backend.dto.duocsi.tuvan.YeuCauTuVanDuocSiDanhSachResponseDto;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.duocsi.YeuCauTuVanDuocSiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/duoc-si/yeu-cau-tu-van")
@RequiredArgsConstructor
public class YeuCauTuVanDuocSiController {

    private static final String VAI_TRO_DUOC_SI =
            "DUOC_SI";

    private final YeuCauTuVanDuocSiService service;

    @GetMapping
    public PageResponseDto<YeuCauTuVanDuocSiDanhSachResponseDto>
            layDanhSach(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap,

                    @RequestParam(
                            defaultValue = "0"
                    )
                    int page,

                    @RequestParam(
                            defaultValue = "10"
                    )
                    int size,

                    @RequestParam(
                            required = false
                    )
                    TrangThaiTuVan trangThai
            ) {

        layMaDuocSiDangNhap(
                nguoiDungDangNhap
        );

        return service.layDanhSach(
                page,
                size,
                trangThai
        );
    }

    @GetMapping("/{maYeuCauTuVan}")
    public YeuCauTuVanDuocSiChiTietResponseDto
            layChiTiet(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap,

                    @PathVariable
                    Long maYeuCauTuVan
            ) {

        layMaDuocSiDangNhap(
                nguoiDungDangNhap
        );

        return service.layChiTiet(
                maYeuCauTuVan
        );
    }

    @PutMapping("/{maYeuCauTuVan}/tiep-nhan")
    public YeuCauTuVanDuocSiChiTietResponseDto
            tiepNhan(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap,

                    @PathVariable
                    Long maYeuCauTuVan
            ) {

        Long maNhanVien =
                layMaDuocSiDangNhap(
                        nguoiDungDangNhap
                );

        return service.tiepNhan(
                maYeuCauTuVan,
                maNhanVien
        );
    }

    @PutMapping("/{maYeuCauTuVan}/hoan-tat")
    public YeuCauTuVanDuocSiChiTietResponseDto
            hoanTat(
                    @AuthenticationPrincipal
                    NguoiDungDangNhap nguoiDungDangNhap,

                    @PathVariable
                    Long maYeuCauTuVan,

                    @Valid
                    @RequestBody
                    HoanTatYeuCauTuVanRequestDto request
            ) {

        Long maNhanVien =
                layMaDuocSiDangNhap(
                        nguoiDungDangNhap
                );

        return service.hoanTat(
                maYeuCauTuVan,
                maNhanVien,
                request
        );
    }

    private Long layMaDuocSiDangNhap(
            NguoiDungDangNhap nguoiDungDangNhap
    ) {

        if (
                nguoiDungDangNhap == null
                        ||
                nguoiDungDangNhap
                        .getMaNhanVien()
                        == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập."
            );
        }

        if (
                !VAI_TRO_DUOC_SI.equals(
                        nguoiDungDangNhap
                                .getVaiTro()
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tài khoản hiện tại không có quyền Dược sĩ."
            );
        }

        return nguoiDungDangNhap
                .getMaNhanVien();
    }
}