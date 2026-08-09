package com.pharma.backend.dto.khachhang.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DonHangResponseDto {

    private Long maDonHang;

    private Long maKhachHang;

    private Long maDiaChi;

    private String tenNguoiNhan;

    private String soDienThoaiNhan;

    private String thanhPho;

    private String phuongKhuVuc;

    private String diaChiChiTiet;

    private LocalDateTime ngayDatHang;

    private BigDecimal tongTienHang;

    private BigDecimal phiGiaoHang;

    private BigDecimal giamGia;

    private BigDecimal tongThanhToan;

    private PhuongThucThanhToan phuongThucThanhToan;

    private TrangThaiThanhToan trangThaiThanhToan;

    private TrangThaiDonHang trangThaiDonHang;

    private String ghiChu;

    private List<ChiTietDonHangResponseDto> danhSachChiTietDonHang;
}
