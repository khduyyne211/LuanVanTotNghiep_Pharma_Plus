package com.pharma.backend.dto.admin.sanpham;

import java.time.LocalDateTime;
import java.util.List;

import com.pharma.backend.dto.admin.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.dto.admin.quydoidonvi.QuyDoiDonViResponse;

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
    private Boolean laThuocKeDon;
    private Boolean trangThaiSanPham;
    private String moTaNgan;
    private String moTa;
    private LocalDateTime ngayTao;

    private List<DonViSanPhamResponse> danhSachDonViSanPham;

    private List<QuyDoiDonViResponse> danhSachQuyDoiDonVi;

    private List<ThanhPhanHoatChatResponse> danhSachThanhPhanHoatChat;

    private DuLieuChuyenMonThuocResponse duLieuChuyenMonThuoc;
}