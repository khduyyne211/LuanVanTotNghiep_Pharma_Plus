package com.pharma.backend.dto.giohang;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//Vai trò: DTO này đại diện cho toàn bộ request kiểm tra giỏ hàng:
public class KiemTraGioHangRequestDto {

    private List<ChiTietGioHangLocalRequestDto> danhSachChiTiet;
}