export type LoaiKhuyenMai =
  | "PHAN_TRAM"
  | "SO_TIEN";

export type TrangThaiKhuyenMai =
  | "CHUA_BAT_DAU"
  | "DANG_DIEN_RA"
  | "DA_KET_THUC";

export interface KhuyenMai {
  maKhuyenMai: number;
  tenChuongTrinh: string;
  loaiKhuyenMai: LoaiKhuyenMai;
  giamGia: number | null;
  giaTriGiam: number | null;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  trangThaiKhuyenMai: TrangThaiKhuyenMai;
}

export interface KhuyenMaiRequest {
  tenChuongTrinh: string;
  loaiKhuyenMai: LoaiKhuyenMai;
  giamGia: number | null;
  giaTriGiam: number | null;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
}