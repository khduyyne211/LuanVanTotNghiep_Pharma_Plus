package com.pharma.backend.dto.admin.phieunhap;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.pharma.backend.enums.nhapkho.TrangThaiPhieuNhap;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PhieuNhapResponse {

    private Long maPhieuNhap;

    private Long maNhaCungCap;
    private String tenNhaCungCap;

    private Long maNhanVienLap;
    private String tenNhanVienLap;

    private LocalDateTime ngayNhap;
    private BigDecimal tongTien;

    private TrangThaiPhieuNhap trangThaiPhieuNhap;
    private String ghiChu;

    private List<ChiTietPhieuNhapResponse> danhSachChiTiet;
}