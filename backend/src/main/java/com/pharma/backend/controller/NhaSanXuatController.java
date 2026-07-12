package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.nhasanxuat.NhaSanXuatRequest;
import com.pharma.backend.dto.nhasanxuat.NhaSanXuatResponse;
import com.pharma.backend.service.NhaSanXuatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nha-san-xuat")
@RequiredArgsConstructor
public class NhaSanXuatController {

    private final NhaSanXuatService nhaSanXuatService;

    @GetMapping
    public List<NhaSanXuatResponse> layDanhSachNhaSanXuat() {
        return nhaSanXuatService.layDanhSachNhaSanXuat();
    }

    @GetMapping("/{maNhaSanXuat}")
    public NhaSanXuatResponse layChiTietNhaSanXuat(
            @PathVariable Long maNhaSanXuat
    ) {
        return nhaSanXuatService.layChiTietNhaSanXuat(maNhaSanXuat);
    }

    @PostMapping
    public NhaSanXuatResponse themNhaSanXuat(
            @RequestBody NhaSanXuatRequest request
    ) {
        return nhaSanXuatService.themNhaSanXuat(request);
    }

    @PutMapping("/{maNhaSanXuat}")
    public NhaSanXuatResponse capNhatNhaSanXuat(
            @PathVariable Long maNhaSanXuat,
            @RequestBody NhaSanXuatRequest request
    ) {
        return nhaSanXuatService.capNhatNhaSanXuat(maNhaSanXuat, request);
    }

    @PutMapping("/{maNhaSanXuat}/an")
    public NhaSanXuatResponse anNhaSanXuat(
            @PathVariable Long maNhaSanXuat
    ) {
        return nhaSanXuatService.anNhaSanXuat(maNhaSanXuat);
    }

    @PutMapping("/{maNhaSanXuat}/hien")
    public NhaSanXuatResponse hienNhaSanXuat(
            @PathVariable Long maNhaSanXuat
    ) {
        return nhaSanXuatService.hienNhaSanXuat(maNhaSanXuat);
    }
}