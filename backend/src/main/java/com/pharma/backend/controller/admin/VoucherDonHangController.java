package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.admin.voucherdonhang.VoucherDonHangRequest;
import com.pharma.backend.dto.admin.voucherdonhang.VoucherDonHangResponse;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.admin.VoucherDonHangService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/voucher-don-hang")
@RequiredArgsConstructor
public class VoucherDonHangController {

    private static final String VAI_TRO_ADMIN = "ADMIN";

    private final VoucherDonHangService voucherDonHangService;

    @GetMapping
    public List<VoucherDonHangResponse> layDanhSachVoucher() {
        return voucherDonHangService.layDanhSachVoucher();
    }

    @PostMapping
    public VoucherDonHangResponse themVoucher(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @Valid @RequestBody VoucherDonHangRequest request) {
        Long maNhanVienDangNhap = layMaNhanVienAdminDangNhap(
                nguoiDungDangNhap);

        return voucherDonHangService.themVoucher(
                request,
                maNhanVienDangNhap);
    }

    @PutMapping("/{maVoucher}")
    public VoucherDonHangResponse capNhatVoucher(
            @PathVariable Long maVoucher,
            @Valid @RequestBody VoucherDonHangRequest request) {
        return voucherDonHangService.capNhatVoucher(
                maVoucher,
                request);
    }

    @PutMapping("/{maVoucher}/doi-trang-thai")
    public VoucherDonHangResponse doiTrangThaiVoucher(
            @PathVariable Long maVoucher) {
        return voucherDonHangService.doiTrangThaiVoucher(
                maVoucher);
    }

    private Long layMaNhanVienAdminDangNhap(
            NguoiDungDangNhap nguoiDungDangNhap) {
        if (nguoiDungDangNhap == null
                || nguoiDungDangNhap.getMaNhanVien() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được nhân viên đang đăng nhập.");
        }

        if (!VAI_TRO_ADMIN.equals(
                nguoiDungDangNhap.getVaiTro())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tài khoản hiện tại không có quyền quản trị.");
        }

        return nguoiDungDangNhap.getMaNhanVien();
    }
}