import type { ChiTietKiemTraGioHangRequest } from "../../gio-hang/types/KiemTraGioHang";

export type KieuGiamGiaVoucher =
  | "PHAN_TRAM"
  | "SO_TIEN";

export interface VoucherKhachHang {
  maVoucher: number;
  tenVoucher: string;
  loaiGiamGia: KieuGiamGiaVoucher;
  giaTriGiam: number;
  soTienGiamToiDa: number | null;
  donGiaToiThieu: number;
  thoiGianKetThuc: string;
  duDieuKien: boolean;
  soTienConThieu: number;
  soTienGiamDuKien: number;
}

export interface ApDungVoucherResponse {
  maVoucher: number;
  maGiamGia: string;
  tenVoucher: string;
  loaiGiamGia: KieuGiamGiaVoucher;
  giaTriGiam: number;
  soTienGiamToiDa: number | null;
  donGiaToiThieu: number;
  thoiGianKetThuc: string;
  tienHangSauKhuyenMai: number;
  soTienGiam: number;
  thongBao: string;
}

export interface VoucherDaApDung
  extends ApDungVoucherResponse {
  chuKyGioHang: string;
}

export interface DanhSachVoucherRequest {
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[];
}

export interface ApDungVoucherRequest
  extends DanhSachVoucherRequest {
  maGiamGia: string;
}