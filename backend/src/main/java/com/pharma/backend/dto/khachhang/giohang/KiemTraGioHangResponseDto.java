package com.pharma.backend.dto.khachhang.giohang;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
//Đây là cấu trúc dữ liệu cuối cùng mà API: POST /api/gio-hang/kiem-tra sẽ trả về frontend.
public class KiemTraGioHangResponseDto {

    private boolean hopLe;
    private List<ThongTinKiemTraGioHangDto> danhSachThongTin;
}