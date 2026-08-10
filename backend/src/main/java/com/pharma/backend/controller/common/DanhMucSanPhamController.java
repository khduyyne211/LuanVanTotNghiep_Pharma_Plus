package com.pharma.backend.controller.common;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.admin.danhmucsanpham.DanhMucSanPhamRequest;
import com.pharma.backend.dto.admin.danhmucsanpham.DanhMucSanPhamResponse;
import com.pharma.backend.dto.common.sanpham.DanhMucNoiBatResponseDto;
import com.pharma.backend.dto.common.sanpham.DanhMucSanPhamResponseDto;
import com.pharma.backend.service.common.DanhMucSanPhamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/danh-muc-san-pham")
@RequiredArgsConstructor
public class DanhMucSanPhamController {

    private final DanhMucSanPhamService danhMucSanPhamService;

    @GetMapping
    public List<DanhMucSanPhamResponse> layDanhSachDanhMucSanPham() {
        return danhMucSanPhamService.layDanhSachDanhMucSanPham();
    }

    @GetMapping("/menu")
    public List<DanhMucSanPhamResponseDto> layDanhMucMenuKhachHang() {
        return danhMucSanPhamService.layDanhMucMenuKhachHang();
    }

    @GetMapping("/noi-bat")
    public List<DanhMucNoiBatResponseDto> layDanhMucNoiBat(
            @RequestParam(defaultValue = "12") int gioiHan
    ) {
        return danhMucSanPhamService.layDanhMucNoiBat(gioiHan);
    }

    @GetMapping("/{maDanhMuc}")
    public DanhMucSanPhamResponse layChiTietDanhMucSanPham(
            @PathVariable Long maDanhMuc
    ) {
        return danhMucSanPhamService.layChiTietDanhMucSanPham(maDanhMuc);
    }

    @PostMapping
    public DanhMucSanPhamResponse themDanhMucSanPham(
            @Valid @RequestBody DanhMucSanPhamRequest request
    ) {
        return danhMucSanPhamService.themDanhMucSanPham(request);
    }

    @PutMapping("/{maDanhMuc}")
    public DanhMucSanPhamResponse capNhatDanhMucSanPham(
            @PathVariable Long maDanhMuc,
            @Valid @RequestBody DanhMucSanPhamRequest request
    ) {
        return danhMucSanPhamService.capNhatDanhMucSanPham(
                maDanhMuc,
                request
        );
    }

    @PutMapping("/{maDanhMuc}/an")
    public DanhMucSanPhamResponse anDanhMucSanPham(
            @PathVariable Long maDanhMuc
    ) {
        return danhMucSanPhamService.anDanhMucSanPham(maDanhMuc);
    }

    @PutMapping("/{maDanhMuc}/hien")
    public DanhMucSanPhamResponse hienDanhMucSanPham(
            @PathVariable Long maDanhMuc
    ) {
        return danhMucSanPhamService.hienDanhMucSanPham(maDanhMuc);
    }
}
