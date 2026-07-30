package com.pharma.backend.dto.nhacungcap;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NhaCungCapResponse {

    private Long maNhaCungCap;
    private String tenNhaCungCap;
    private String soDienThoai;
    private String diaChi;
    private String email;
    private Boolean trangThaiHopTac;
}