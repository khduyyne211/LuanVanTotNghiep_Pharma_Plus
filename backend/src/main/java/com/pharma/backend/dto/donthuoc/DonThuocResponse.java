package com.pharma.backend.dto.donthuoc;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonThuocResponse {

    private Long maDonThuoc;

    private Long maKhachHang;
    private String tenKhachHang;
    private String emailKhachHang;
    private String soDienThoaiKhachHang;

    private Long maNhanVienDuyet;
    private String tenNhanVienDuyet;

    private String anhDonThuoc;
    private LocalDateTime ngayUpload;
    private String trangThaiDonThuoc;

    private String lyDoTuChoi;
    private String ghiChuDuocSi;
    private String ketQuaKiemDuyet;
}
