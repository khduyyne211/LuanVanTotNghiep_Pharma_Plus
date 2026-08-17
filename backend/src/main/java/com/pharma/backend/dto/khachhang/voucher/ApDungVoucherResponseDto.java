package com.pharma.backend.dto.khachhang.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApDungVoucherResponseDto {

    private Long maVoucher;

    private String maGiamGia;

    private String tenVoucher;

    private KieuGiamGia loaiGiamGia;

    private BigDecimal giaTriGiam;

    private BigDecimal soTienGiamToiDa;

    private BigDecimal donGiaToiThieu;

    private LocalDateTime thoiGianKetThuc;

    /*
     * Tổng tiền hàng sau khi đã trừ
     * khuyến mãi trực tiếp của sản phẩm.
     *
     * Đây là giá trị dùng để xét voucher.
     */
    private BigDecimal tienHangSauKhuyenMai;

    /*
     * Số tiền voucher thực tế được giảm.
     */
    private BigDecimal soTienGiam;

    private String thongBao;
}