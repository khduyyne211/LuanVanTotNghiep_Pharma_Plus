package com.pharma.backend.dto.voucherdonhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VoucherDonHangResponse {

    private Long maVoucher;
    private String maGiamGia;
    private String tenVoucher;
    private KieuGiamGia loaiGiamGia;
    private BigDecimal giaTriGiam;
    private BigDecimal soTienGiamToiDa;
    private BigDecimal donGiaToiThieu;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private Integer soLuongSuDung;
    private Integer soLuongDaSuDung;
    private Boolean trangThai;
}
