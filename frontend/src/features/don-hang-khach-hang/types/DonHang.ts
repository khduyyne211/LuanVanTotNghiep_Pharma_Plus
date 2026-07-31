export type TrangThaiDonHang =
  | "CHO_THANH_TOAN"
  | "CHO_XU_LY"
  | "DANG_XU_LY"
  | "DANG_GIAO"
  | "DA_GIAO"
  | "DA_HUY";

export interface SanPhamDonHangTomTat {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  soLuong: number;
  tenDonViTinh: string;
  donGia: number;
  thanhTien: number;
}

export interface DonHangDanhSach {
  maDonHang: number;
  ngayDatHang: string;
  trangThaiDonHang: TrangThaiDonHang;
  tongThanhToan: number;
  sanPhamDauTien: SanPhamDonHangTomTat;
  soSanPhamKhac: number;
}

export type PhuongThucThanhToan = "COD" | "QR";

export type TrangThaiThanhToan =
  | "CHUA_THANH_TOAN"
  | "CHO_THANH_TOAN"
  | "DA_THANH_TOAN"
  | "THANH_TOAN_THAT_BAI"
  | "DA_HUY";

export interface TaoDonHangRequest {
  maDiaChi: number;
  phuongThucThanhToan: PhuongThucThanhToan;
  ghiChu: string | null;
}

export interface ChiTietDonHangResponse {
  maChiTietDonHang: number;
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  maDonViSanPham: number;
  tenDonViTinh: string;
  soLuong: number;
  donGia: number;
  giamGia: number;
  thanhTien: number;
}

export interface DonHangResponse {
  maDonHang: number;
  maKhachHang: number | null;
  maDiaChi: number | null;

  tenNguoiNhan: string | null;
  soDienThoaiNhan: string | null;
  thanhPho: string | null;
  phuongKhuVuc: string | null;
  diaChiChiTiet: string | null;

  ngayDatHang: string;
  tongTienHang: number;
  phiGiaoHang: number;
  giamGia: number;
  tongThanhToan: number;
  phuongThucThanhToan: PhuongThucThanhToan | null;
  trangThaiThanhToan: TrangThaiThanhToan;
  trangThaiDonHang: TrangThaiDonHang;
  ghiChu: string | null;
  danhSachChiTietDonHang: ChiTietDonHangResponse[];
}