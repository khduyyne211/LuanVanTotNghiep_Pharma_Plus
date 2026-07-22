package com.pharma.backend.dto.donhang;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonHangTaiQuayRequest {

    private Long maDuocSiXuLy;
    private String phuongThucThanhToan;
    private String ghiChu;

    private Boolean xacNhanDaKiemTraDonThuoc;
    private String ghiChuKiemDuyet;

    private List<ChiTietDonHangTaiQuayRequest> danhSachChiTiet;
}
