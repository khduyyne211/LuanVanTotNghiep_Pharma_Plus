package com.pharma.backend.dto.giohang;

import java.math.BigDecimal;
import java.util.List;

import com.pharma.backend.enums.giohang.TrangThaiGioHang;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GioHangResponseDto {

    private Long maGioHang;

    private Long maKhachHang;

    private TrangThaiGioHang trangThaiGioHang;

    private List<ChiTietGioHangResponseDto> danhSachChiTietGioHang;

    private BigDecimal tongTien;
}