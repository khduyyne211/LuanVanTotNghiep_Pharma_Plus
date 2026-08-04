export type KieuGiamGia = "PHAN_TRAM" | "SO_TIEN";

export interface KhuyenMai {
  maKhuyenMai: number;
  tenChuongTrinh: string;
  loaiKhuyenMai: string;
  kieuGiamGia: KieuGiamGia;
  giaTriGiam: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  trangThai: boolean;
}

export interface KhuyenMaiRequest {
  maNhanVienTao: number;
  tenChuongTrinh: string;
  loaiKhuyenMai: string;
  kieuGiamGia: KieuGiamGia;
  giaTriGiam: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
}