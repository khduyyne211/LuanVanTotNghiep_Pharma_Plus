package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.pharma.backend.dto.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViResponse;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SanPhamResponse {

    private Long maSanPham;

    private Long maDanhMuc;
    private String tenDanhMuc;

    private Long maNhaSanXuat;
    private String tenNhaSanXuat;

    private String tenSanPham;
    private String hinhAnh;
    private BigDecimal giaBan;
    private Boolean laThuocKeDon;
    private Boolean trangThaiSanPham;
    private String moTaNgan;
    private LocalDateTime ngayTao;

    private List<DonViSanPhamResponse> danhSachDonViSanPham;
    private List<QuyDoiDonViResponse> danhSachQuyDoiDonVi;
}