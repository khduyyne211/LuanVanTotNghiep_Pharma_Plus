package com.pharma.backend.dto.admin.khuyenmai;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KhuyenMaiSanPhamResponse {

    private Long maSanPham;

    private String tenSanPham;

    private Boolean laThuocKeDon;

    private Boolean trangThaiSanPham;

    private Boolean dangDuocGan;
}