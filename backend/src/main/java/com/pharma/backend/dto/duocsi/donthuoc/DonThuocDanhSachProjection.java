package com.pharma.backend.dto.duocsi.donthuoc;

import java.time.LocalDateTime;

public interface DonThuocDanhSachProjection {

    Long getMaDonThuoc();

    Long getMaKhachHang();
    String getTenKhachHang();
    String getSoDienThoaiKhachHang();

    Long getMaNhanVienDuyet();
    String getTenNhanVienDuyet();

    String getAnhDonThuoc();
    LocalDateTime getNgayUpload();
    String getTrangThaiDonThuoc();
    String getLyDoTuChoi();
    String getGhiChu();
}
