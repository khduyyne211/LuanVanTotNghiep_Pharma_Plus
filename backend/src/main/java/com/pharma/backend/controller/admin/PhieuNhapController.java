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

import com.pharma.backend.dto.admin.phieunhap.PhieuNhapResponse;
import com.pharma.backend.dto.admin.phieunhap.PhieuNhapTaoMoiRequest;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.admin.PhieuNhapService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/phieu-nhap")
@RequiredArgsConstructor
public class PhieuNhapController {

    private static final String VAI_TRO_ADMIN = "ADMIN";

    private final PhieuNhapService phieuNhapService;

    @GetMapping
    public List<PhieuNhapResponse> layDanhSachPhieuNhap() {
        return phieuNhapService.layDanhSachPhieuNhap();
    }

    @GetMapping("/{maPhieuNhap}")
    public PhieuNhapResponse layChiTietPhieuNhap(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.layChiTietPhieuNhap(
                maPhieuNhap);
    }

    @PostMapping
    public PhieuNhapResponse taoPhieuNhap(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @Valid @RequestBody PhieuNhapTaoMoiRequest request) {

        Long maNhanVienDangNhap = layMaNhanVienAdminDangNhap(
                nguoiDungDangNhap);

        return phieuNhapService.taoPhieuNhap(
                maNhanVienDangNhap,
                request);
    }

    @PutMapping("/{maPhieuNhap}/xac-nhan")
    public PhieuNhapResponse xacNhanNhapKho(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.xacNhanNhapKho(
                maPhieuNhap);
    }

    @PutMapping("/{maPhieuNhap}/huy")
    public PhieuNhapResponse huyPhieuNhap(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.huyPhieuNhap(
                maPhieuNhap);
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