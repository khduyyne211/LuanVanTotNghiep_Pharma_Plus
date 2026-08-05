package com.pharma.backend.dto.sanpham;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SanPhamNhapKhoOptionResponse {

    private Long maSanPham;

    private String tenSanPham;

    private List<DonViNhapKhoResponse> danhSachDonViNhap;
}