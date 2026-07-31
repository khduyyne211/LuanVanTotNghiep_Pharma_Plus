package com.pharma.backend.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NguoiDungDangNhap {

    private Long maTaiKhoan;

    private Long maKhachHang;

    private String soDienThoai;

    private String vaiTro;
}