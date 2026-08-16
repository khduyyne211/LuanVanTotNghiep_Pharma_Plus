package com.pharma.backend.dto.duocsi.tuvan;

import java.time.LocalDateTime;

import com.pharma.backend.enums.tuvan.HinhThucLienHe;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

public record YeuCauTuVanDuocSiDanhSachResponseDto(
        Long maYeuCauTuVan,
        String tenKhachHang,
        String soDienThoai,
        HinhThucLienHe hinhThucLienHe,
        TrangThaiTuVan trangThaiTuVan,
        String tenNhanVienTiepNhan,
        LocalDateTime ngayTao
) {
}