package com.pharma.backend.dto.admin.sanpham;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuyDoiDonViCapNhatRequest {

    private Long maQuyDoi;

    @NotNull(message = "Đơn vị nguồn không được để trống")
    private Long maDonViNguon;

    @NotNull(message = "Số lượng nguồn không được để trống")
    @DecimalMin(
            value = "0.001",
            message = "Số lượng nguồn phải lớn hơn 0"
    )
    private BigDecimal soLuongNguon;

    @NotNull(message = "Đơn vị đích không được để trống")
    private Long maDonViDich;

    @NotNull(message = "Số lượng đích không được để trống")
    @DecimalMin(
            value = "0.001",
            message = "Số lượng đích phải lớn hơn 0"
    )
    private BigDecimal soLuongDich;

    @NotNull
    private Boolean trangThai;
}