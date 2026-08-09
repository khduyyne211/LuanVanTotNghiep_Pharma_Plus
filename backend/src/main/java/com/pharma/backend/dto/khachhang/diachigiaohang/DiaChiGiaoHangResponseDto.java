package com.pharma.backend.dto.khachhang.diachigiaohang;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DiaChiGiaoHangResponseDto {

    private Long maDiaChi;

    private String tenNguoiNhan;

    private String soDienThoaiNhan;

    private String thanhPho;

    private String phuongKhuVuc;

    private String diaChiChiTiet;

    private Boolean laMacDinh;

    private Boolean trangThaiSuDung;
}