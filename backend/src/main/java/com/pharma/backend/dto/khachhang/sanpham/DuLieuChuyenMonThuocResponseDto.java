package com.pharma.backend.dto.khachhang.sanpham;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DuLieuChuyenMonThuocResponseDto {

    private String dangBaoChe;

    private String congDungThamKhao;

    private String cachDungThamKhao;

    private String canhBaoAnToan;

    private String phanLoaiThuoc;

    private Boolean trangThaiXacNhan;
}