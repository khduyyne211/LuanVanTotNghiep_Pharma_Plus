package com.pharma.backend.dto.admin.sanpham;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SanPhamTaoMoiRequest {

    private SanPhamRequest thongTinSanPham;

    private List<DonViSanPhamTaoMoiRequest> danhSachDonVi;

    private List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi;

    private List<ThanhPhanHoatChatTaoMoiRequest>
            danhSachThanhPhanHoatChat;

    private DuLieuChuyenMonThuocRequest
            duLieuChuyenMonThuoc;
}