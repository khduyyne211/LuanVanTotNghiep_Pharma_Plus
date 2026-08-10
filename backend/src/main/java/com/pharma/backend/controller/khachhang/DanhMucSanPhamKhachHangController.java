package com.pharma.backend.controller.khachhang;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.khachhang.danhmucsanpham.DanhMucNoiBatResponseDto;
import com.pharma.backend.dto.khachhang.danhmucsanpham.DanhMucSanPhamResponseDto;
import com.pharma.backend.service.khachhang.DanhMucSanPhamKhachHangService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/danh-muc-san-pham")
@RequiredArgsConstructor
public class DanhMucSanPhamKhachHangController {

    private final DanhMucSanPhamKhachHangService
            danhMucSanPhamKhachHangService;

    @GetMapping("/menu")
    public List<DanhMucSanPhamResponseDto> layDanhMucMenuKhachHang() {
        return danhMucSanPhamKhachHangService
                .layDanhMucMenuKhachHang();
    }

    @GetMapping("/noi-bat")
    public List<DanhMucNoiBatResponseDto> layDanhMucNoiBat(
            @RequestParam(defaultValue = "12") int gioiHan
    ) {
        return danhMucSanPhamKhachHangService
                .layDanhMucNoiBat(gioiHan);
    }
}