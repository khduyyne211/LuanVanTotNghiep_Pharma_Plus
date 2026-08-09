package com.pharma.backend.dto.admin.donvitinh;

import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class DonViTinhResponse {
    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;
    private String moTa;
    private Boolean trangThai;
}
