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
  giaBanTheoDonVi: number;
  heSoQuyDoiVeDonViCoSo: number;
  tonKhaDungTheoQuyDoi: number;
}

export interface KiemTraGioHangResponse {
  hopLe: boolean;
  danhSachThongTin: ThongTinKiemTraGioHang[];
}