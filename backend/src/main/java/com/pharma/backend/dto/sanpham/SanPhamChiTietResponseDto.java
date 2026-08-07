package com.pharma.backend.dto.sanpham;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SanPhamChiTietResponseDto {

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    /**
     * Giá gốc của đơn vị đại diện.
     */
    private BigDecimal giaBanGoc;

    /**
     * Giá sau khuyến mãi của đơn vị đại diện.
     */
    private BigDecimal giaBan;

    private BigDecimal soTienGiam;

    private Boolean coKhuyenMai;

    private Boolean hetHang;

    private Boolean laThuocKeDon;

    private Boolean trangThaiSanPham;

    private String moTaNgan;

    private String moTa;

    private Long maDanhMuc;

    private String tenDanhMuc;

    private String tenNhaSanXuat;

    private String moTaQuyDoi;

    /**
     * Chỉ trả các đơn vị còn đủ tồn để bán.
     */
    private List<DonViBanSanPhamResponseDto> danhSachDonViBan;

    private List<ThanhPhanHoatChatResponseDto>
            danhSachThanhPhanHoatChat;

    private DuLieuChuyenMonThuocResponseDto
            duLieuChuyenMonThuoc;
}