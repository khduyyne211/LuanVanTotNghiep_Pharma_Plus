package com.pharma.backend.dto.khachhang.sanpham;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SanPhamResponseDto {

    private Long maSanPham;

    private String tenSanPham;

    private String hinhAnh;

    /**
     * Giá gốc của đơn vị đại diện.
     */
    private BigDecimal giaBanGoc;

    /**
     * Giá sau khuyến mãi của đơn vị đại diện.
     *
     * Frontend tiếp tục dùng trường giaBan để hiển thị giá hiện tại.
     */
    private BigDecimal giaBan;

    /**
     * Số tiền được giảm trên một đơn vị đại diện.
     */
    private BigDecimal soTienGiam;

    private Boolean coKhuyenMai;

    /**
     * True khi không còn đơn vị bán nào đủ tồn để bán ít nhất một đơn vị.
     */
    private Boolean hetHang;

    private Boolean laThuocKeDon;

    private String tenNhaSanXuat;

    private Long maDanhMuc;

    private String tenDanhMuc;

    private String moTaNgan;

    private String moTaQuyDoi;

    /**
     * Chỉ chứa các đơn vị đang hoạt động, được phép bán,
     * có giá hợp lệ và đủ tồn để bán ít nhất một đơn vị.
     *
     * Khi sản phẩm hết hàng, danh sách này rỗng.
     */
    private List<DonViBanSanPhamResponseDto> danhSachDonViBan;
}