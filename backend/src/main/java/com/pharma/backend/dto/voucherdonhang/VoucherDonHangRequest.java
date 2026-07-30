package com.pharma.backend.dto.voucherdonhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherDonHangRequest {
    private String maGiamGia;
    private String tenVoucher;
    private String loaiGiamGia;
    private BigDecimal giaTriGiam;
    private BigDecimal soTienGiamToiDa;
    private BigDecimal donGiaToiThieu;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private Integer soLuongSuDung;
    private Integer soLuongDaSuDung;
    private Boolean trangThai;
}
