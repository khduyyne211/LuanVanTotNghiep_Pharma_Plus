package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.donvitinh.DonViTinhRequest;
import com.pharma.backend.dto.donvitinh.DonViTinhResponse;
import com.pharma.backend.service.DonViTinhService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/don-vi-tinh")
@RequiredArgsConstructor
public class DonViTinhController {

    private final DonViTinhService donViTinhService;

    @GetMapping
    public List<DonViTinhResponse> layDanhSachDonViTinh() {
        return donViTinhService.layDanhSachDonViTinh();
    }

    @GetMapping("/{maDonViTinh}")
    public DonViTinhResponse layChiTietDonViTinh(@PathVariable Long maDonViTinh) {
        return donViTinhService.layChiTietDonViTinh(maDonViTinh);
    }

    @PostMapping
    public DonViTinhResponse themDonViTinh(@RequestBody DonViTinhRequest request) {
        return donViTinhService.themDonViTinh(request);
    }

    @PutMapping("/{maDonViTinh}")
    public DonViTinhResponse capNhatDonViTinh(
            @PathVariable Long maDonViTinh,
            @RequestBody DonViTinhRequest request
    ) {
        return donViTinhService.capNhatDonViTinh(maDonViTinh, request);
    }

    @PutMapping("/{maDonViTinh}/an")
    public DonViTinhResponse anDonViTinh(@PathVariable Long maDonViTinh) {
        return donViTinhService.anDonViTinh(maDonViTinh);
    }

    @PutMapping("/{maDonViTinh}/hien")
    public DonViTinhResponse hienDonViTinh(@PathVariable Long maDonViTinh) {
        return donViTinhService.hienDonViTinh(maDonViTinh);
    }
}