package com.pharma.backend.dto.admin.khuyenmai;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KhuyenMaiResponse {

    private Long maKhuyenMai;
    private String tenChuongTrinh;
    private String loaiKhuyenMai;
    private KieuGiamGia kieuGiamGia;
    private BigDecimal giaTriGiam;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private Boolean trangThai;
}
