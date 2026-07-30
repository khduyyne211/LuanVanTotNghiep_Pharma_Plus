package com.pharma.backend.dto.vaitro;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VaiTroResponse {

    private Long maVaiTro;
    private String tenVaiTro;
    private String moTa;
    private Boolean trangThai;
}