export type LoaiKhuyenMai =
  | "SAN_PHAM";

export type KieuGiamGia =
  | "PHAN_TRAM"
  | "SO_TIEN";

export interface KhuyenMai {
  maKhuyenMai: number;
  tenChuongTrinh: string;
  loaiKhuyenMai: LoaiKhuyenMai;
  kieuGiamGia: KieuGiamGia;
  giaTriGiam: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  trangThai: boolean;
}

export interface KhuyenMaiRequest {
  tenChuongTrinh: string;
  loaiKhuyenMai: LoaiKhuyenMai;
  kieuGiamGia: KieuGiamGia;
  giaTriGiam: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
}
