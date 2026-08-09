package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiRequest;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiResponse;
import com.pharma.backend.service.admin.KhuyenMaiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/khuyen-mai")
@RequiredArgsConstructor
public class KhuyenMaiController {
    private final KhuyenMaiService service;
    @GetMapping
    public List<KhuyenMaiResponse> layDanhSachKhuyenMai() {
        return service.layDanhSachKhuyenMai();
    }

    @GetMapping("/{maKhuyenMai}")
    public KhuyenMaiResponse layChiTietKhuyenMai(
            @PathVariable Long maKhuyenMai
    ) {
        return service.layChiTietKhuyenMai(maKhuyenMai);
    }

    @PostMapping
    public KhuyenMaiResponse themKhuyenMai(
            @Valid @RequestBody KhuyenMaiRequest request
    ) {
        return service.themKhuyenMai(request);
    }

    @PutMapping("/{maKhuyenMai}")
    public KhuyenMaiResponse capNhatKhuyenMai(
            @PathVariable Long maKhuyenMai,
            @Valid @RequestBody KhuyenMaiRequest request
    ) {
        return service.capNhatKhuyenMai(maKhuyenMai, request);
    }

}
