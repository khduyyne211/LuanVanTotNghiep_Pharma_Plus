package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.nhacungcap.NhaCungCapRequest;
import com.pharma.backend.dto.nhacungcap.NhaCungCapResponse;
import com.pharma.backend.service.NhaCungCapService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nha-cung-cap")
@RequiredArgsConstructor
public class NhaCungCapController {

    private final NhaCungCapService nhaCungCapService;

    @GetMapping
    public List<NhaCungCapResponse> layDanhSachNhaCungCap() {
        return nhaCungCapService.layDanhSachNhaCungCap();
    }

    @PostMapping
    public NhaCungCapResponse themNhaCungCap(@Valid @RequestBody NhaCungCapRequest request) {
        return nhaCungCapService.themNhaCungCap(request);
    }

    @PutMapping("/{maNhaCungCap}")
    public NhaCungCapResponse capNhatNhaCungCap(
            @PathVariable Long maNhaCungCap,
            @Valid @RequestBody NhaCungCapRequest request) {
        return nhaCungCapService.capNhatNhaCungCap(
                maNhaCungCap,
                request);
    }

    @PutMapping("/{maNhaCungCap}/doi-trang-thai")
    public NhaCungCapResponse doiTrangThaiHopTac(
            @PathVariable Long maNhaCungCap) {
        return nhaCungCapService.doiTrangThaiHopTac(
                maNhaCungCap);
    }
}