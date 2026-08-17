package com.pharma.backend.dto.duocsi.donhang;

import java.util.List;

import com.pharma.backend.enums.donhang.LoaiKhachHang;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaoDonTaiQuayRequest {

    @NotNull(message = "Loại khách hàng không được để trống")
    private LoaiKhachHang loaiKhach;

    @Positive(message = "Mã khách hàng không hợp lệ")
    private Long maKhachHang;

    @Valid
    @NotEmpty(message = "Đơn hàng phải có ít nhất một sản phẩm")
    private List<ChiTietTaoDonHangDuocSiRequest> danhSachChiTiet;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String ghiChu;
}
