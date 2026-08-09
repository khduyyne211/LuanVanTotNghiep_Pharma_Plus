package com.pharma.backend.dto.khachhang.tuvan;

import com.pharma.backend.enums.tuvan.HinhThucLienHe;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaoYeuCauTuVanRequestDto {

    private String tenKhachHang;
    private String soDienThoai;
    private String noiDungCanTuVan;
    private HinhThucLienHe hinhThucLienHe;
}
