package com.pharma.backend.dto.duocsi.donhang;

import com.pharma.backend.enums.donhang.TrangThaiDonHang;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapNhatTrangThaiDonHangRequest {

    @NotNull(message = "Trạng thái đơn hàng không được để trống")
    private TrangThaiDonHang trangThaiDonHang;
}
