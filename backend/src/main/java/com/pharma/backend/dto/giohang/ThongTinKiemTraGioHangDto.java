package com.pharma.backend.dto.giohang;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
//Vai trò: Mỗi đối tượng chứa thông tin mới nhất của một đơn vị sản phẩm:
public class ThongTinKiemTraGioHangDto {

    private Long maSanPham;
    private Long maDonViSanPham;
    private BigDecimal giaBanTheoDonVi;
    private BigDecimal heSoQuyDoiVeDonViCoSo;
    private BigDecimal tonKhaDungTheoQuyDoi;
}