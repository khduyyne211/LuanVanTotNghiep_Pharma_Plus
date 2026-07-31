package com.pharma.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.xacthuc.DangNhapRequestDto;
import com.pharma.backend.dto.xacthuc.DangNhapResponseDto;
import com.pharma.backend.service.XacThucService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/xac-thuc")
@RequiredArgsConstructor
public class XacThucController {
    private final XacThucService xacThucService;

    @PostMapping("/dang-nhap")
    public DangNhapResponseDto dangNhapKhachHang(
        @RequestBody DangNhapRequestDto request
    ) {
        return xacThucService.dangNhapKhachHang(request);
    }
}
