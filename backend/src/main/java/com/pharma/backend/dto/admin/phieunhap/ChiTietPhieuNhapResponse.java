package com.pharma.backend.dto.admin.phieunhap;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.pharma.backend.enums.nhapkho.TrangThaiLo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChiTietPhieuNhapResponse {

    private Long maChiTietPhieuNhap;

    private Long maSanPham;
    private String tenSanPham;

    private Long maDonViSanPham;
    private Long maDonViTinh;
    private String tenDonViTinh;
    private String kyHieu;

    private BigDecimal soLuongNhap;
    private BigDecimal soLuongTheoQuyDoi;
    private BigDecimal soLuongConLaiTheoQuyDoi;

    private BigDecimal donGiaNhap;
    private BigDecimal thanhTien;

    private LocalDate hanSuDung;
    private TrangThaiLo trangThaiLo;
}