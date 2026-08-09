package com.pharma.backend.controller.admin;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.nhasanxuat.NhaSanXuatRequest;
import com.pharma.backend.dto.admin.nhasanxuat.NhaSanXuatResponse;
import com.pharma.backend.service.admin.NhaSanXuatService;

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
            @Valid @RequestBody NhaSanXuatRequest request
    ) {
        return nhaSanXuatService.themNhaSanXuat(request);
    }

    @PutMapping("/{maNhaSanXuat}")
    public NhaSanXuatResponse capNhatNhaSanXuat(
            @PathVariable Long maNhaSanXuat,
            @Valid @RequestBody NhaSanXuatRequest request
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