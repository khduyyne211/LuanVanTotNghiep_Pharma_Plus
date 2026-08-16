package com.pharma.backend.dto.duocsi.tuvan;

import java.time.LocalDateTime;

import com.pharma.backend.enums.tuvan.HinhThucLienHe;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

public record YeuCauTuVanDuocSiChiTietResponseDto(
        Long maYeuCauTuVan,
        Long maKhachHang,
        String tenKhachHang,
        String soDienThoai,
        String noiDungCanTuVan,
        HinhThucLienHe hinhThucLienHe,
        Long maNhanVienTiepNhan,
        String tenNhanVienTiepNhan,
        String ketQuaTuVan,
        TrangThaiTuVan trangThaiTuVan,
        LocalDateTime ngayTao,
        Long maSanPham,
        String tenSanPham,
        String hinhAnh,
        Boolean laThuocKeDon
) {
}