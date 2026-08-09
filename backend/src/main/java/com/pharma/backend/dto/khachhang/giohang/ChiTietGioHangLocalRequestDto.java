package com.pharma.backend.dto.khachhang.giohang;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//Vai trò: Mỗi đối tượng là một dòng giỏ hàng từ localStorage gửi lên backend:
public class ChiTietGioHangLocalRequestDto {

    private Long maDonViSanPham;

    private Integer soLuong;
}