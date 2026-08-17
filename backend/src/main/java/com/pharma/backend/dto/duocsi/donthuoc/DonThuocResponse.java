package com.pharma.backend.dto.duocsi.donthuoc;

import java.time.LocalDateTime;

import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonThuocResponse {

    private Long maDonThuoc;
    private Long maDonHang;

    private Long maKhachHang;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    private Long maNhanVienDuyet;
    private String tenNhanVienDuyet;

    private String anhDonThuoc;
    private LocalDateTime ngayUpload;
    private TrangThaiDonThuoc trangThaiDonThuoc;

    private String lyDoTuChoi;
    private String ghiChu;
}
