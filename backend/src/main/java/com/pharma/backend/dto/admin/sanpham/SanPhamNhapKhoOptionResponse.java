package com.pharma.backend.dto.admin.sanpham;

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