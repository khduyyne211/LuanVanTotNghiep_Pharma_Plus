package com.pharma.backend.dto.duocsi.donhang;

import java.util.List;

import com.pharma.backend.dto.khachhang.diachigiaohang.LuuDiaChiGiaoHangRequestDto;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaoDonHangDuocSiRequest {

    @Valid
    @NotNull(message = "Thông tin địa chỉ giao hàng không được để trống")
    private LuuDiaChiGiaoHangRequestDto diaChiGiaoHang;

    @Valid
    @NotEmpty(message = "Đơn hàng phải có ít nhất một sản phẩm")
    private List<ChiTietTaoDonHangDuocSiRequest> danhSachChiTiet;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PhuongThucThanhToan phuongThucThanhToan;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String ghiChu;
}
