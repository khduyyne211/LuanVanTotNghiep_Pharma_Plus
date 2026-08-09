package com.pharma.backend.dto.khachhang.thongtincanhan;

import java.time.LocalDate;

import com.pharma.backend.enums.common.GioiTinh;

public record ThongTinCaNhanResponseDto(
        String soDienThoai,
        String hoTen,
        GioiTinh gioiTinh,
        LocalDate ngaySinh
) {
}