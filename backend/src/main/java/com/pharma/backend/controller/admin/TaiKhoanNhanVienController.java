package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienCapNhatRequest;
import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienResponse;
import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienTaoRequest;
import com.pharma.backend.service.admin.TaiKhoanNhanVienService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tai-khoan-nhan-vien")
@RequiredArgsConstructor
public class TaiKhoanNhanVienController {

    private final TaiKhoanNhanVienService taiKhoanNhanVienService;

    @GetMapping
    public List<TaiKhoanNhanVienResponse> layDanhSachTaiKhoanNhanVien() {
        return taiKhoanNhanVienService.layDanhSachTaiKhoanNhanVien();
    }

    @PostMapping
    public TaiKhoanNhanVienResponse themTaiKhoanNhanVien(
            @Valid @RequestBody TaiKhoanNhanVienTaoRequest request
    ) {
        return taiKhoanNhanVienService.themTaiKhoanNhanVien(
                request
        );
    }

    @PutMapping("/{maNhanVien}")
    public TaiKhoanNhanVienResponse capNhatTaiKhoanNhanVien(
            @PathVariable Long maNhanVien,
            @Valid @RequestBody TaiKhoanNhanVienCapNhatRequest request
    ) {
        return taiKhoanNhanVienService.capNhatTaiKhoanNhanVien(
                maNhanVien,
                request
        );
    }

    @PutMapping("/{maNhanVien}/doi-trang-thai")
    public TaiKhoanNhanVienResponse doiTrangThaiTaiKhoan(
            @PathVariable Long maNhanVien
    ) {
        return taiKhoanNhanVienService.doiTrangThaiTaiKhoan(
                maNhanVien
        );
    }
}