package com.pharma.backend.dto.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PageResponseDto<T> {

    private List<T> danhSachNoiDung;
    private int trangHienTai;
    private int soPhanTuMoiTrang;
    private long tongSoPhanTu;
    private int tongSoTrang;
    private boolean laTrangCuoi;
}
