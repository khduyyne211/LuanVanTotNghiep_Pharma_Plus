package com.pharma.backend.enums.diachigiaohang;

import java.util.Arrays;
import java.util.Optional;

public enum TinhThanhGiaoHang {

    TP_HO_CHI_MINH("TP. Hồ Chí Minh");

    private final String tenHienThi;

    TinhThanhGiaoHang(String tenHienThi) {
        this.tenHienThi = tenHienThi;
    }

    public String getTenHienThi() {
        return tenHienThi;
    }

    public static Optional<TinhThanhGiaoHang> timTheoTenHienThi(
            String tenThanhPho
    ) {
        if (tenThanhPho == null || tenThanhPho.isBlank()) {
            return Optional.empty();
        }

        String giaTriDaChuanHoa = tenThanhPho.trim();

        return Arrays.stream(values())
                .filter(tinhThanh ->
                        tinhThanh.tenHienThi.equalsIgnoreCase(
                                giaTriDaChuanHoa
                        )
                )
                .findFirst();
    }

    public static boolean duocHoTro(String tenThanhPho) {
        return timTheoTenHienThi(tenThanhPho).isPresent();
    }
}