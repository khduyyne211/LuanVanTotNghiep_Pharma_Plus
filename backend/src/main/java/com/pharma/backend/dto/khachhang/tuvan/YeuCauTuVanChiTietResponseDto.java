package com.pharma.backend.dto.khachhang.tuvan;

import java.time.LocalDateTime;

import com.pharma.backend.enums.tuvan.HinhThucLienHe;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class YeuCauTuVanChiTietResponseDto {

    private String tenKhachHang;
    private String soDienThoai;
    private String noiDungCanTuVan;
    private HinhThucLienHe hinhThucLienHe;
    private String tenNhanVienTiepNhan;
    private String ketQuaTuVan;
    private TrangThaiTuVan trangThaiTuVan;
    private LocalDateTime ngayTao;
}
