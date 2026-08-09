package com.pharma.backend.dto.khachhang.giohang;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ThongTinKiemTraGioHangDto {

    private Long maSanPham;

    private Long maDonViSanPham;

    /**
     * Giá gốc của đơn vị bán trước khuyến mãi.
     */
    private BigDecimal giaBanTheoDonVi;

    /**
     * Số tiền được giảm trên mỗi đơn vị.
     */
    private BigDecimal soTienGiamMoiDonVi;

    /**
     * Giá thực trả trên mỗi đơn vị.
     */
    private BigDecimal giaSauKhuyenMai;

    private Boolean coKhuyenMai;

    private BigDecimal heSoQuyDoiVeDonViCoSo;

    private BigDecimal tonKhaDungTheoQuyDoi;
}