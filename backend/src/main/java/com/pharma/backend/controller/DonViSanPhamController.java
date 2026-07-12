package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.service.DonViSanPhamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DonViSanPhamController {

    private final DonViSanPhamService donViSanPhamService;

    @GetMapping("/san-pham/{maSanPham}/don-vi")
    public List<DonViSanPhamResponse> layDanhSachDonViTheoSanPham(
            @PathVariable Long maSanPham
    ) {
        return donViSanPhamService.layDanhSachDonViTheoSanPham(maSanPham);
    }

    @GetMapping("/don-vi-san-pham/{maDonViSanPham}")
    public DonViSanPhamResponse layChiTietDonViSanPham(
            @PathVariable Long maDonViSanPham
    ) {
        return donViSanPhamService.layChiTietDonViSanPham(maDonViSanPham);
    }

    @PostMapping("/don-vi-san-pham")
    public DonViSanPhamResponse themDonViSanPham(
            @RequestBody DonViSanPhamRequest request
    ) {
        return donViSanPhamService.themDonViSanPham(request);
    }

    @PutMapping("/don-vi-san-pham/{maDonViSanPham}")
    public DonViSanPhamResponse capNhatDonViSanPham(
            @PathVariable Long maDonViSanPham,
            @RequestBody DonViSanPhamRequest request
    ) {
        return donViSanPhamService.capNhatDonViSanPham(maDonViSanPham, request);
    }

    @PutMapping("/don-vi-san-pham/{maDonViSanPham}/an")
    public DonViSanPhamResponse anDonViSanPham(
            @PathVariable Long maDonViSanPham
    ) {
        return donViSanPhamService.anDonViSanPham(maDonViSanPham);
    }

    @PutMapping("/don-vi-san-pham/{maDonViSanPham}/hien")
    public DonViSanPhamResponse hienDonViSanPham(
            @PathVariable Long maDonViSanPham
    ) {
        return donViSanPhamService.hienDonViSanPham(maDonViSanPham);
    }
}