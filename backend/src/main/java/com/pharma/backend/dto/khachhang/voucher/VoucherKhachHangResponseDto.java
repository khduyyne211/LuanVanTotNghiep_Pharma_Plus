package com.pharma.backend.dto.khachhang.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoucherKhachHangResponseDto {

    private Long maVoucher;

    private String tenVoucher;

    private KieuGiamGia loaiGiamGia;

    private BigDecimal giaTriGiam;

    private BigDecimal soTienGiamToiDa;

    private BigDecimal donGiaToiThieu;

    private LocalDateTime thoiGianKetThuc;

    /*
     * Voucher còn hiệu lực/còn lượt nhưng
     * giỏ hàng hiện tại có đạt giá trị tối thiểu hay không.
     */
    private Boolean duDieuKien;

    /*
     * Số tiền khách còn phải mua thêm để đạt
     * điều kiện tối thiểu.
     *
     * Nếu đã đủ điều kiện thì bằng 0.
     */
    private BigDecimal soTienConThieu;

    /*
     * Mức giảm dự kiến nếu voucher được áp dụng
     * cho giỏ hàng hiện tại.
     *
     * Nếu chưa đủ điều kiện thì bằng 0.
     */
    private BigDecimal soTienGiamDuKien;
}