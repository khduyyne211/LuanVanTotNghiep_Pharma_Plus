package com.pharma.backend.dto.sanpham;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SanPhamTaoDayDuRequest {

    private SanPhamRequest thongTinSanPham;

    private List<DonViSanPhamTaoMoiRequest> danhSachDonVi;

    private List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi;
}