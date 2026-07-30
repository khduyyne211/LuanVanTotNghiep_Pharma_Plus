package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.vaitro.VaiTroRequest;
import com.pharma.backend.dto.vaitro.VaiTroResponse;
import com.pharma.backend.service.VaiTroService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vai-tro")
@RequiredArgsConstructor
public class VaiTroController {

    private final VaiTroService vaiTroService;

    @GetMapping
    public List<VaiTroResponse> layDanhSachVaiTro() {
        return vaiTroService.layDanhSachVaiTro();
    }

    @PostMapping
    public VaiTroResponse themVaiTro(
            @Valid @RequestBody VaiTroRequest request) {
        return vaiTroService.themVaiTro(request);
    }

    @PutMapping("/{maVaiTro}")
    public VaiTroResponse capNhatVaiTro(
            @PathVariable Long maVaiTro,
            @Valid @RequestBody VaiTroRequest request) {
        return vaiTroService.capNhatVaiTro(
                maVaiTro,
                request);
    }

    @PutMapping("/{maVaiTro}/doi-trang-thai")
    public VaiTroResponse doiTrangThai(
            @PathVariable Long maVaiTro) {
        return vaiTroService.doiTrangThai(
                maVaiTro);
    }
}