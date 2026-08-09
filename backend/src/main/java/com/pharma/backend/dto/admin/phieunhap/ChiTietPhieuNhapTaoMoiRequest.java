package com.pharma.backend.dto.admin.phieunhap;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChiTietPhieuNhapTaoMoiRequest {

    @NotNull(message = "Sản phẩm không được để trống")
    @Positive(message = "Mã sản phẩm không hợp lệ")
    private Long maSanPham;

    @NotNull(message = "Đơn vị nhập không được để trống")
    @Positive(message = "Mã đơn vị sản phẩm không hợp lệ")
    private Long maDonViSanPham;

    @NotNull(message = "Số lượng nhập không được để trống")
    @DecimalMin(
            value = "0.001",
            message = "Số lượng nhập phải lớn hơn 0"
    )
    @Digits(
            integer = 12,
            fraction = 3,
            message = "Số lượng nhập không đúng định dạng"
    )
    private BigDecimal soLuongNhap;

    @NotNull(message = "Đơn giá nhập không được để trống")
    @DecimalMin(
            value = "0.01",
            message = "Đơn giá nhập phải lớn hơn 0"
    )
    @Digits(
            integer = 13,
            fraction = 2,
            message = "Đơn giá nhập không đúng định dạng"
    )
    private BigDecimal donGiaNhap;

    @NotNull(message = "Hạn sử dụng không được để trống")
    @Future(message = "Hạn sử dụng phải sau ngày hiện tại")
    private LocalDate hanSuDung;
}