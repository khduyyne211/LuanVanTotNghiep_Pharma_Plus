package com.pharma.backend.dto.admin.taikhoan;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaiKhoanNhanVienResponse {

    private Long maNhanVien;

    private Long maTaiKhoan;

    private String hoTen;

    private String soDienThoai;

    private Boolean trangThaiTaiKhoan;

    private Boolean trangThaiLamViec;

    private LocalDateTime ngayTao;

    private List<VaiTroTaiKhoanResponse> danhSachVaiTro;

    @Getter
    @Builder
    public static class VaiTroTaiKhoanResponse {

        private Long maVaiTro;

        private String tenVaiTro;

        private Boolean trangThai;
    }
}