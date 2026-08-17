package com.pharma.backend.dto.duocsi.donhang;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChiTietTaoDonHangDuocSiRequest {

    @NotNull(message = "Mã đơn vị sản phẩm không được để trống")
    @Positive(message = "Mã đơn vị sản phẩm không hợp lệ")
    private Long maDonViSanPham;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer soLuong;
}
