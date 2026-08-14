package com.pharma.backend.dto.admin.sanpham;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonViSanPhamCapNhatRequest {

    private Long maDonViSanPham;

    @NotNull(message = "Đơn vị tính không được để trống")
    private Long maDonViTinh;

    @DecimalMin(
            value = "0.01",
            message = "Giá bán phải lớn hơn 0"
    )
    private BigDecimal giaBanTheoDonVi;

    @NotNull
    private Boolean laDonViCoSo;

    @NotNull
    private Boolean laDonViBanMacDinh;

    @NotNull
    private Boolean choPhepBan;

    @NotNull
    private Boolean choPhepNhap;

    @NotNull
    private Boolean trangThai;
}
