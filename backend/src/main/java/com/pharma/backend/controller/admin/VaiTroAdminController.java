package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.vaitro.VaiTroRequest;
import com.pharma.backend.dto.admin.vaitro.VaiTroResponse;
import com.pharma.backend.service.admin.VaiTroAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vai-tro")
@RequiredArgsConstructor
public class VaiTroAdminController {

    private final VaiTroAdminService vaiTroAdminService;

    @GetMapping
    public List<VaiTroResponse> layDanhSachVaiTro() {
        return vaiTroAdminService.layDanhSachVaiTro();
    }

    @PostMapping
    public VaiTroResponse themVaiTro(
            @Valid @RequestBody VaiTroRequest request) {
        return vaiTroAdminService.themVaiTro(
                request);
    }

    @PutMapping("/{maVaiTro}")
    public VaiTroResponse capNhatVaiTro(
            @PathVariable Long maVaiTro,
            @Valid @RequestBody VaiTroRequest request) {
        return vaiTroAdminService.capNhatVaiTro(
                maVaiTro,
                request);
    }

    @PutMapping("/{maVaiTro}/doi-trang-thai")
    public VaiTroResponse doiTrangThaiVaiTro(
            @PathVariable Long maVaiTro) {
        return vaiTroAdminService.doiTrangThaiVaiTro(maVaiTro);
    }
}