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

import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiRequest;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiResponse;
import com.pharma.backend.security.NguoiDungDangNhap;
import com.pharma.backend.service.admin.KhuyenMaiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/khuyen-mai")
@RequiredArgsConstructor
public class KhuyenMaiController {

    private static final String VAI_TRO_ADMIN = "ADMIN";

    private final KhuyenMaiService service;

    @GetMapping
    public List<KhuyenMaiResponse> layDanhSachKhuyenMai() {
        return service.layDanhSachKhuyenMai();
    }

    @GetMapping("/{maKhuyenMai}")
    public KhuyenMaiResponse layChiTietKhuyenMai(
            @PathVariable Long maKhuyenMai) {

        return service.layChiTietKhuyenMai(
                maKhuyenMai);
    }

    @PostMapping
    public KhuyenMaiResponse themKhuyenMai(
            @AuthenticationPrincipal NguoiDungDangNhap nguoiDungDangNhap,
            @Valid @RequestBody KhuyenMaiRequest request) {

        Long maNhanVienDangNhap =
                layMaNhanVienAdminDangNhap(
                        nguoiDungDangNhap);

        request.setMaNhanVienTao(
                maNhanVienDangNhap);

        return service.themKhuyenMai(
                request);
    }

    @PutMapping("/{maKhuyenMai}")
    public KhuyenMaiResponse capNhatKhuyenMai(
            @PathVariable Long maKhuyenMai,
            @Valid @RequestBody KhuyenMaiRequest request) {

        return service.capNhatKhuyenMai(
                maKhuyenMai,
                request);
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
