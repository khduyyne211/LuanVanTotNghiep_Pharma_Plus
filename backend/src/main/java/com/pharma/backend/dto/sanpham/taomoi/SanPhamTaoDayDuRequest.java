package com.pharma.backend.dto.sanpham.taomoi;

import java.util.List;

import com.pharma.backend.dto.sanpham.SanPhamRequest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SanPhamTaoDayDuRequest {

    private SanPhamRequest thongTinSanPham;

    private List<DonViSanPhamTaoMoiRequest> danhSachDonVi;

    private List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi;
}