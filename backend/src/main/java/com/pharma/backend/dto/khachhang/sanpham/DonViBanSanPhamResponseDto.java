package com.pharma.backend.dto.khachhang.sanpham;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DonViBanSanPhamResponseDto {

    private Long maDonViSanPham;

    private Long maDonViTinh;

    private String tenDonViTinh;

    private String kyHieu;

    /**
     * Giá gốc của đơn vị bán trước khuyến mãi.
     */
    private BigDecimal giaBanTheoDonVi;

    /**
     * Tổng số tiền được giảm trên một đơn vị.
     */
    private BigDecimal soTienGiamMoiDonVi;

    /**
     * Giá khách thực trả trên một đơn vị.
     */
    private BigDecimal giaSauKhuyenMai;

    private Boolean coKhuyenMai;

    /**
     * Số lượng nguyên tối đa có thể bán theo tồn kho hiện tại.
     */
    private Integer soLuongToiDaCoTheBan;

    private Boolean laDonViCoSo;

        /**
     * Constructor tương thích tạm thời với các luồng chưa tích hợp
     * tồn kho và khuyến mãi, đặc biệt là GioHangService.
     *
     * Sau khi GioHangService được cập nhật, luồng đó sẽ dùng
     * đầy đủ dữ liệu giá và tồn kho thực tế.
     */
    public DonViBanSanPhamResponseDto(
            Long maDonViSanPham,
            Long maDonViTinh,
            String tenDonViTinh,
            String kyHieu,
            BigDecimal giaBanTheoDonVi,
            Boolean laDonViCoSo
    ) {
        this(
                maDonViSanPham,
                maDonViTinh,
                tenDonViTinh,
                kyHieu,
                giaBanTheoDonVi,
                BigDecimal.ZERO,
                giaBanTheoDonVi,
                false,
                Integer.MAX_VALUE,
                laDonViCoSo
        );
    }
}