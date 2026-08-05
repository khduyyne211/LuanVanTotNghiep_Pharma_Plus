package com.pharma.backend.dto.sanpham;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DuLieuChuyenMonThuocRequest {

    private String dangBaoChe;
    private String phanLoaiThuoc;
    private String congDungThamKhao;
    private String cachDungThamKhao;
    private String canhBaoAnToan;
}