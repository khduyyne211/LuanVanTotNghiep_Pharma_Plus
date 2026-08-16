package com.pharma.backend.dto.khachhang.donthuoc;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuiDonThuocRequestDto {

    @NotNull(
        message = "Vui lòng chọn ảnh đơn thuốc."
    )
    private MultipartFile anhDonThuoc;
}