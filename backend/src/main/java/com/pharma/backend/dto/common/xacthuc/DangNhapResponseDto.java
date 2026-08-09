package com.pharma.backend.dto.common.xacthuc;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DangNhapResponseDto {

    private String accessToken;
    private String loaiToken;
    private Long maTaiKhoan;
    private Long maKhachHang;
    private Long maNhanVien;
    private String hoTen;
    private String soDienThoai;
    private String vaiTro;

    public DangNhapResponseDto(
            String accessToken,
            String loaiToken,
            Long maTaiKhoan,
            Long maKhachHang,
            Long maNhanVien,
            String hoTen,
            String soDienThoai,
            String vaiTro
    ) {
        this.accessToken = accessToken;
        this.loaiToken = loaiToken;
        this.maTaiKhoan = maTaiKhoan;
        this.maKhachHang = maKhachHang;
        this.maNhanVien = maNhanVien;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.vaiTro = vaiTro;
    }

    public DangNhapResponseDto(
            String accessToken,
            String loaiToken,
            Long maTaiKhoan,
            Long maKhachHang,
            String hoTen,
            String soDienThoai,
            String vaiTro
    ) {
        this(
                accessToken,
                loaiToken,
                maTaiKhoan,
                maKhachHang,
                null,
                hoTen,
                soDienThoai,
                vaiTro
        );
    }
}
