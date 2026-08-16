package com.pharma.backend.dto.duocsi.donhang;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChiTietDonHangDuocSiResponse {

    private Long maChiTietDonHang;

    private Long maSanPham;
    private String tenSanPham;
    private Boolean laThuocKeDon;
    private String hinhAnh;

    private Long maDonViSanPham;
    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;

    private Integer soLuong;

    private BigDecimal donGia;
    private BigDecimal giamGia;
    private BigDecimal thanhTien;

    private String cachTinhGia;
}
