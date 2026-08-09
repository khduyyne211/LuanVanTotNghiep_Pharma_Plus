import type { ChiTietGioHang } from "./ChiTietGioHang";

export interface GioHang {
  maGioHang: number;
  maKhachHang: number;
  trangThaiGioHang: string;

  danhSachChiTietGioHang: ChiTietGioHang[];

  tongTien: number;
}