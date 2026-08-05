package com.pharma.backend.dto.sanpham;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonViNhapKhoResponse {

    private Long maDonViSanPham;

    private Long maDonViTinh;

    private String tenDonViTinh;

    private String kyHieu;
}