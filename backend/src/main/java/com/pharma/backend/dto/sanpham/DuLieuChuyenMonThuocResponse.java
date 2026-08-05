package com.pharma.backend.dto.sanpham;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DuLieuChuyenMonThuocResponse {

    private Long maDuLieuChuyenMon;

    private String dangBaoChe;
    private String phanLoaiThuoc;
    private String congDungThamKhao;
    private String cachDungThamKhao;
    private String canhBaoAnToan;

    private Boolean trangThaiXacNhan;
}