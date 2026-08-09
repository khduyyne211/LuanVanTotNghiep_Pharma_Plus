package com.pharma.backend.dto.khachhang.tuvan;

import java.time.LocalDateTime;

import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class YeuCauTuVanDanhSachResponseDto {

    private Long maYeuCauTuVan;
    private LocalDateTime ngayTao;
    private TrangThaiTuVan trangThaiTuVan;
}
