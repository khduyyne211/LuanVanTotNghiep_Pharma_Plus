package com.pharma.backend.dto.khachhang.giohang;

import java.math.BigDecimal;
import java.util.List;

import com.pharma.backend.dto.sanpham.DonViBanSanPhamResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChiTietGioHangResponseDto {

    private Long maChiTietGioHang;

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    private Long maDonViSanPham;

    private Long maDonViTinh;

    private String tenDonViTinh;

    private String kyHieuDonViTinh;

    private Integer soLuong;

    private BigDecimal donGia;

    private BigDecimal thanhTien;

    private List<DonViBanSanPhamResponseDto> danhSachDonViBan;
}