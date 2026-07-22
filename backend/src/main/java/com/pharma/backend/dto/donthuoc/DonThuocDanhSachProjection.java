package com.pharma.backend.dto.donthuoc;

import java.time.LocalDateTime;

public interface DonThuocDanhSachProjection {

    Long getMaDonThuoc();

    Long getMaKhachHang();

    String getTenKhachHang();

    String getEmailKhachHang();

    String getSoDienThoaiKhachHang();

    Long getMaNhanVienDuyet();

    String getTenNhanVienDuyet();

    String getAnhDonThuoc();

    LocalDateTime getNgayUpload();

    String getTrangThaiDonThuoc();

    String getLyDoTuChoi();

    String getGhiChuDuocSi();

    String getKetQuaKiemDuyet();
}
