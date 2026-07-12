package com.pharma.backend.dto.nhasanxuat;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NhaSanXuatResponse {

    private Long maNhaSanXuat;
    private String tenNhaSanXuat;
    private String quocGia;
    private String diaChi;
    private Boolean trangThai;
}