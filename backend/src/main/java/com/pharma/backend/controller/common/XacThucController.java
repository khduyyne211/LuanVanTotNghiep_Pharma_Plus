package com.pharma.backend.controller.common;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.xacthuc.DangNhapRequestDto;
import com.pharma.backend.dto.common.xacthuc.DangNhapResponseDto;
import com.pharma.backend.service.common.XacThucService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/xac-thuc")
@RequiredArgsConstructor
public class XacThucController {

    private final XacThucService xacThucService;

    @PostMapping("/dang-nhap")
    public DangNhapResponseDto dangNhap(
            @RequestBody DangNhapRequestDto request
    ) {
        return xacThucService.dangNhap(request);
    }
}
