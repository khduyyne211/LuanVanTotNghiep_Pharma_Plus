package com.pharma.backend.dto.admin.khuyenmai;

import java.util.Set;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapNhatSanPhamKhuyenMaiRequest {

    @NotNull(message = "Danh sách sản phẩm không được để trống")
    private Set<Long> danhSachMaSanPham;
}