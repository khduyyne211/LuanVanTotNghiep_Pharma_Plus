package com.pharma.backend.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.sanpham.SanPhamChiTietResponseDto;
import com.pharma.backend.dto.sanpham.SanPhamResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamKhachHangService {

    private final SanPhamDanhSachService sanPhamDanhSachService;
    private final SanPhamChiTietService sanPhamChiTietService;

    public PageResponseDto<SanPhamResponseDto> layDanhSachSanPham(
            String tuKhoa,
            String sapXep,
            BigDecimal giaTu,
            BigDecimal giaDen,
            Long maNhaSanXuat,
            Long maDanhMuc,
            int page,
            int size
    ) {
        return sanPhamDanhSachService.layDanhSachSanPhamKhachHang(
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

    public SanPhamChiTietResponseDto layChiTietSanPham(Long maSanPham) {
        return sanPhamChiTietService.layChiTietSanPhamKhachHang(maSanPham);
    }
}
