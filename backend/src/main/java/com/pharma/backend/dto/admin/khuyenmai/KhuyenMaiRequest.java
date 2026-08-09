package com.pharma.backend.dto.admin.khuyenmai;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharma.backend.enums.khuyenmai.KieuGiamGia;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KhuyenMaiRequest {

    private Long maNhanVienTao;

    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 200, message = "Tên chương trình không được vượt quá 200 ký tự")
    private String tenChuongTrinh;

    @NotBlank(message = "Loại khuyến mãi không được để trống")
    @Size(max = 50, message = "Loại khuyến mãi không được vượt quá 50 ký tự")
    private String loaiKhuyenMai;

    @NotNull(message = "Kiểu giảm giá không được để trống")
    private KieuGiamGia kieuGiamGia;

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0.00", inclusive = false, message = "Giá trị giảm phải lớn hơn 0")
    private BigDecimal giaTriGiam;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime thoiGianBatDau;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime thoiGianKetThuc;
}
