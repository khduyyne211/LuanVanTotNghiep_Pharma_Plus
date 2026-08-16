package com.pharma.backend.dto.duocsi.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonHangDuocSiDanhSachResponse {

    private Long maDonHang;

    private Long maKhachHang;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    private Long maDonThuoc;

    private Long maNhanVienXuLy;
    private String tenNhanVienXuLy;

    private LocalDateTime ngayDatHang;

    private LoaiKhachHang loaiKhach;

    private BigDecimal tongThanhToan;

    private PhuongThucThanhToan phuongThucThanhToan;
    private TrangThaiThanhToan trangThaiThanhToan;
    private TrangThaiDonHang trangThaiDonHang;
    private TrangThaiKiemDuyetDonHang trangThaiKiemDuyet;

    private Boolean coThuocKeDon;
}
