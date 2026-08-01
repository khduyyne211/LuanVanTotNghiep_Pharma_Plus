package com.pharma.backend.security;

import lombok.Getter;

@Getter
public class NguoiDungDangNhap {

    private final Long maTaiKhoan;
    private final Long maKhachHang;
    private final Long maNhanVien;
    private final String soDienThoai;
    private final String vaiTro;

    public NguoiDungDangNhap(
            Long maTaiKhoan,
            Long maKhachHang,
            Long maNhanVien,
            String soDienThoai,
            String vaiTro
    ) {
        this.maTaiKhoan = maTaiKhoan;
        this.maKhachHang = maKhachHang;
        this.maNhanVien = maNhanVien;
        this.soDienThoai = soDienThoai;
        this.vaiTro = vaiTro;
    }

    public NguoiDungDangNhap(
            Long maTaiKhoan,
            Long maKhachHang,
            String soDienThoai,
            String vaiTro
    ) {
        this(
                maTaiKhoan,
                maKhachHang,
                null,
                soDienThoai,
                vaiTro
        );
    }
}
