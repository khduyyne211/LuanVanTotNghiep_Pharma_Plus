package com.pharma.backend.dto.duocsi.sanpham;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SanPhamDuocSiResponse {

    private Long maSanPham;
    private String tenSanPham;
    private String hinhAnh;
    private Boolean laThuocKeDon;

    private List<DonViBanDuocSiResponse> danhSachDonViBan;
}