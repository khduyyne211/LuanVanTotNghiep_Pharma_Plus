package com.pharma.backend.controller.khachhang;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.khachhang.voucher.ApDungVoucherResponseDto;
import com.pharma.backend.dto.khachhang.voucher.KiemTraVoucherRequestDto;
import com.pharma.backend.dto.khachhang.voucher.KiemTraVoucherTheoMaRequestDto;
import com.pharma.backend.dto.khachhang.voucher.VoucherKhachHangResponseDto;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.khachhang.VoucherDonHangKhachHangService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(
        "/api/voucher-don-hang/khach-hang"
)
@RequiredArgsConstructor
public class VoucherDonHangKhachHangController {

    private final VoucherDonHangKhachHangService voucherDonHangKhachHangService;

    /*
     * Khi khách bấm "Chọn voucher".
     */
    @PostMapping("/danh-sach")
    public List<VoucherKhachHangResponseDto>
            layDanhSachVoucher(
                    @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
                    @RequestBody KiemTraGioHangRequestDto request
            ) {

        kiemTraKhachHangDangNhap(
                nguoiDungDangNhap
        );

        return voucherDonHangKhachHangService
                .layDanhSachVoucher(
                        request
                );
    }

    /*
     * Khi khách nhập mã và bấm "Áp dụng".
     */
    @PostMapping("/ap-dung")
    public ApDungVoucherResponseDto
            apDungVoucher(
                    @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
                    @Valid
                    @RequestBody KiemTraVoucherRequestDto request
            ) {

        kiemTraKhachHangDangNhap(
                nguoiDungDangNhap
        );

        return voucherDonHangKhachHangService
                .kiemTraVaApDungVoucher(
                        request
                );
    }

    /*
     * Khi khách chọn trực tiếp một voucher
     * đủ điều kiện trong danh sách.
     *
     * Đây vẫn chỉ là bước kiểm tra thử,
     * chưa tăng lượt sử dụng voucher.
     */
    @PostMapping("/ap-dung-theo-ma-voucher")
    public ApDungVoucherResponseDto
            apDungVoucherTheoMaVoucher(
                    @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
                    @Valid
                    @RequestBody KiemTraVoucherTheoMaRequestDto request
            ) {

        kiemTraKhachHangDangNhap(
                nguoiDungDangNhap
        );

        return voucherDonHangKhachHangService
                .kiemTraVaApDungVoucherTheoMaVoucher(
                        request
                );
    }

    private void kiemTraKhachHangDangNhap(
            NguoiDungDangNhap nguoiDungDangNhap
    ) {
        if (nguoiDungDangNhap == null
                || nguoiDungDangNhap
                        .getMaKhachHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }
}