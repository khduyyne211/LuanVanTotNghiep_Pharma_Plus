package com.pharma.backend.dto.thongtincanhan;

import java.time.LocalDate;

import com.pharma.backend.enums.common.GioiTinh;

public record ThongTinCaNhanResponseDto(
        String soDienThoai,
        String hoTen,
        GioiTinh gioiTinh,
        LocalDate ngaySinh
) {
}