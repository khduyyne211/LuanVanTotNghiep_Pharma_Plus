package com.pharma.backend.controller.khachhang;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.khachhang.donthuoc.DonThuocKhachHangResponseDto;
import com.pharma.backend.dto.khachhang.donthuoc.GuiDonThuocRequestDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.khachhang.DonThuocKhachHangService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(
    "/api/don-thuoc/khach-hang"
)
@RequiredArgsConstructor
public class DonThuocKhachHangController {

    private final DonThuocKhachHangService
            donThuocKhachHangService;

    /*
     * =========================================================
     * GỬI ẢNH ĐƠN THUỐC
     * =========================================================
     */

    @PostMapping(
        consumes =
            MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<
            DonThuocKhachHangResponseDto
    > guiDonThuoc(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @Valid
            @ModelAttribute
            GuiDonThuocRequestDto request
    ) {
        DonThuocKhachHangResponseDto
                donThuocDaTao =
                donThuocKhachHangService
                        .guiDonThuoc(
                                layMaKhachHang(
                                        nguoiDungDangNhap
                                ),
                                request
                        );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        donThuocDaTao
                );
    }

    /*
     * =========================================================
     * DANH SÁCH CỦA TÔI
     * =========================================================
     */

    @GetMapping("/cua-toi")
    public ResponseEntity<
            PageResponseDto<
                    DonThuocKhachHangResponseDto
            >
    > layDanhSachCuaToi(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @RequestParam(
                defaultValue = "0"
            )
            int page,

            @RequestParam(
                defaultValue = "10"
            )
            int size
    ) {
        return ResponseEntity.ok(
                donThuocKhachHangService
                        .layDanhSachCuaToi(
                                layMaKhachHang(
                                        nguoiDungDangNhap
                                ),
                                page,
                                size
                        )
        );
    }

    /*
     * =========================================================
     * CHI TIẾT CỦA TÔI
     * =========================================================
     */

    @GetMapping(
        "/cua-toi/{maDonThuoc}"
    )
    public ResponseEntity<
            DonThuocKhachHangResponseDto
    > layChiTietCuaToi(
            @AuthenticationPrincipal
            NguoiDungDangNhap nguoiDungDangNhap,

            @PathVariable
            Long maDonThuoc
    ) {
        return ResponseEntity.ok(
                donThuocKhachHangService
                        .layChiTietCuaToi(
                                layMaKhachHang(
                                        nguoiDungDangNhap
                                ),
                                maDonThuoc
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