package com.pharma.backend.dto.duocsi.sanpham;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonViBanDuocSiResponse {

    private Long maDonViSanPham;
    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;

    private BigDecimal giaGoc;
    private BigDecimal giaSauKhuyenMai;
    private String cachTinhGia;

    private Boolean laDonViCoSo;
    private Boolean laDonViBanMacDinh;
    private Integer soLuongToiDa;
}