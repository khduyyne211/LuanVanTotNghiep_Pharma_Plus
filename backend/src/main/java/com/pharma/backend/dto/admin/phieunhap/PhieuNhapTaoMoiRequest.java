package com.pharma.backend.dto.admin.phieunhap;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhieuNhapTaoMoiRequest {

    @NotNull(message = "Nhà cung cấp không được để trống")
    @Positive(message = "Mã nhà cung cấp không hợp lệ")
    private Long maNhaCungCap;

    @NotNull(message = "Nhân viên lập không được để trống")
    @Positive(message = "Mã nhân viên lập không hợp lệ")
    private Long maNhanVienLap;

    private String ghiChu;

    @Valid
    @NotEmpty(message = "Phiếu nhập phải có ít nhất một sản phẩm")
    private List<ChiTietPhieuNhapTaoMoiRequest> danhSachChiTiet;
}