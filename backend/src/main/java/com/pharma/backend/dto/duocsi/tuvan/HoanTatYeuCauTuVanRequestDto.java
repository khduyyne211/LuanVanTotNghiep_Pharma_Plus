package com.pharma.backend.dto.duocsi.tuvan;

import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HoanTatYeuCauTuVanRequestDto {

    @NotNull(message = "Trạng thái xử lý không được để trống.")
    private TrangThaiTuVan trangThaiTuVan;

    @NotBlank(message = "Kết quả tư vấn không được để trống.")
    private String ketQuaTuVan;
}