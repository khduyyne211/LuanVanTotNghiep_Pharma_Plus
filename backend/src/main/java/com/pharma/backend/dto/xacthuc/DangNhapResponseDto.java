package com.pharma.backend.dto.xacthuc;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DangNhapResponseDto {
    private String accessToken;

    private String loaiToken;

    private Long maTaiKhoan;

    private Long maKhachHang;

    private String hoTen;

    private String soDienThoai;

    private String vaiTro;
}
