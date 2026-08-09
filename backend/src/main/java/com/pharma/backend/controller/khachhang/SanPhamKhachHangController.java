package com.pharma.backend.controller.khachhang;

import java.math.BigDecimal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.SanPhamChiTietResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.SanPhamResponseDto;
import com.pharma.backend.service.khachhang.SanPhamKhachHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/san-pham/khach-hang")
@RequiredArgsConstructor
public class SanPhamKhachHangController {

    private final SanPhamKhachHangService sanPhamKhachHangService;

    @GetMapping
    public PageResponseDto<SanPhamResponseDto> layDanhSachSanPham(
            @RequestParam(required = false) String tuKhoa,
            @RequestParam(required = false) String sapXep,
            @RequestParam(required = false) BigDecimal giaTu,
            @RequestParam(required = false) BigDecimal giaDen,
            @RequestParam(required = false) Long maNhaSanXuat,
            @RequestParam(required = false) Long maDanhMuc,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return sanPhamKhachHangService.layDanhSachSanPham(
                tuKhoa,
                sapXep,
                giaTu,
                giaDen,
                maNhaSanXuat,
                maDanhMuc,
                page,
                size
        );
    }

    @GetMapping("/{maSanPham}")
    public SanPhamChiTietResponseDto layChiTietSanPham(
            @PathVariable Long maSanPham
    ) {
        return sanPhamKhachHangService.layChiTietSanPham(maSanPham);
    }
}
