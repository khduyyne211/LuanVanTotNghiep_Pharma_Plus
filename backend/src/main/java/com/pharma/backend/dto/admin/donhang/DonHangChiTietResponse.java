package com.pharma.backend.dto.admin.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonHangChiTietResponse {

    private Long maDonHang;

    private Long maKhachHang;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    private Long maDiaChi;
    private String tenNguoiNhan;
    private String soDienThoaiNhan;
    private String thanhPho;
    private String phuongKhuVuc;
    private String diaChiChiTiet;

    private Long maVoucher;
    private Long maDonThuoc;

    private Long maNhanVienXuLy;
    private String tenNhanVienXuLy;

    private LocalDateTime ngayDatHang;
    private LoaiKhachHang loaiKhach;

    private BigDecimal tongTienHang;
    private BigDecimal phiGiaoHang;
    private BigDecimal giamGia;
    private BigDecimal tongThanhToan;

    private PhuongThucThanhToan phuongThucThanhToan;
    private TrangThaiThanhToan trangThaiThanhToan;
    private TrangThaiDonHang trangThaiDonHang;

    private TrangThaiKiemDuyetDonHang trangThaiKiemDuyet;
    private LocalDateTime ngayKiemDuyet;
    private String ghiChuKiemDuyet;
    private String lyDoTuChoiDuyet;
    private String ghiChu;

    private String anhDonThuoc;
    private TrangThaiDonThuoc trangThaiDonThuoc;
    private String lyDoTuChoiDonThuoc;
    private String ghiChuDonThuoc;

    private Boolean coThuocKeDon;
    private List<ChiTietDonHangResponse> danhSachChiTiet;
}
