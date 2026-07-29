package com.pharma.backend.dto.khuyenmai;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KhuyenMaiResponse {

    private Long maKhuyenMai;
    private String tenChuongTrinh;
    private String loaiKhuyenMai;
    private BigDecimal giamGia;
    private BigDecimal giaTriGiam;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private String trangThaiKhuyenMai;
}