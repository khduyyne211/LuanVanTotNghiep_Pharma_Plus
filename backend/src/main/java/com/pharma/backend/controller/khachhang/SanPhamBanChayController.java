package com.pharma.backend.controller.khachhang;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.khachhang.sanpham.SanPhamBanChayResponseDto;
import com.pharma.backend.service.khachhang.SanPhamBanChayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/san-pham")
@RequiredArgsConstructor
public class SanPhamBanChayController {

    private final SanPhamBanChayService sanPhamBanChayService;

    @GetMapping("/ban-chay")
    public List<SanPhamBanChayResponseDto> laySanPhamBanChay(
            @RequestParam(defaultValue = "12") int gioiHan
    ) {
        return sanPhamBanChayService.laySanPhamBanChay(gioiHan);
    }
}
