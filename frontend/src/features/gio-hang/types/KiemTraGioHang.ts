export interface ChiTietKiemTraGioHangRequest {
  maDonViSanPham: number;
  soLuong: number;
}

export interface KiemTraGioHangRequest {
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[];
}

export interface ThongTinKiemTraGioHang {
  maSanPham: number;
  maDonViSanPham: number;

  /**
   * Giá gốc trước khuyến mãi.
   */
  giaBanTheoDonVi: number;

  soTienGiamMoiDonVi: number;

  /**
   * Giá thực trả trên mỗi đơn vị.
   */
  giaSauKhuyenMai: number;

  coKhuyenMai: boolean;

  heSoQuyDoiVeDonViCoSo: number;
  tonKhaDungTheoQuyDoi: number;
}

export interface KiemTraGioHangResponse {
  hopLe: boolean;
  danhSachThongTin: ThongTinKiemTraGioHang[];
}