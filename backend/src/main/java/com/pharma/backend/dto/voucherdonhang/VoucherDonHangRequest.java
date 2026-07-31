package com.pharma.backend.dto.voucherdonhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherDonHangRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    @Size(max = 50, message = "Mã giảm giá không được vượt quá 50 ký tự")
    private String maGiamGia;

    @NotBlank(message = "Tên voucher không được để trống")
    @Size(max = 200, message = "Tên voucher không được vượt quá 200 ký tự")
    private String tenVoucher;

    @NotNull(message = "Loại giảm giá không được để trống")
    private KieuGiamGia loaiGiamGia;

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0.00", inclusive = false, message = "Giá trị giảm phải lớn hơn 0")
    private BigDecimal giaTriGiam;

    @DecimalMin(value = "0.00", message = "Số tiền giảm tối đa không được nhỏ hơn 0")
    private BigDecimal soTienGiamToiDa;

    @NotNull(message = "Đơn giá tối thiểu không được để trống")
    @DecimalMin(value = "0.00", message = "Đơn giá tối thiểu không được nhỏ hơn 0")
    private BigDecimal donGiaToiThieu;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime thoiGianBatDau;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime thoiGianKetThuc;

    @NotNull(message = "Số lượng sử dụng không được để trống")
    @Min(value = 1, message = "Số lượng sử dụng phải lớn hơn hoặc bằng 1")
    private Integer soLuongSuDung;
}
