package com.pharma.backend.dto.khuyenmai;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KhuyenMaiRequest {

    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 150, message = "Tên chương trình không được vượt quá 150 ký tự")
    private String tenChuongTrinh;

    @NotBlank(message = "Loại khuyến mãi không được để trống")
    @Pattern(
            regexp = "PHAN_TRAM|SO_TIEN",
            message = "Loại khuyến mãi chỉ nhận PHAN_TRAM hoặc SO_TIEN"
    )
    private String loaiKhuyenMai;

    @DecimalMin(
            value = "0.00",
            inclusive = false,
            message = "Phần trăm giảm phải lớn hơn 0"
    )
    private BigDecimal giamGia;

    @DecimalMin(
            value = "0.00",
            inclusive = false,
            message = "Giá trị giảm phải lớn hơn 0"
    )
    private BigDecimal giaTriGiam;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime thoiGianBatDau;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime thoiGianKetThuc;
}