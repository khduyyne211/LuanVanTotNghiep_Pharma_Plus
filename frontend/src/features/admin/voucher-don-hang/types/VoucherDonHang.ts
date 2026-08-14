export type KieuGiamGia =
  | "PHAN_TRAM"
  | "SO_TIEN";

export interface VoucherDonHang {
  maVoucher: number;
  maGiamGia: string;
  tenVoucher: string;
  loaiGiamGia: KieuGiamGia;
  giaTriGiam: number;
  soTienGiamToiDa: number | null;
  donGiaToiThieu: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  soLuongSuDung: number;
  soLuongDaSuDung: number;
  trangThai: boolean;
}

export interface VoucherDonHangRequest {
  maGiamGia: string;
  tenVoucher: string;
  loaiGiamGia: KieuGiamGia;
  giaTriGiam: number;
  soTienGiamToiDa: number | null;
  donGiaToiThieu: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  soLuongSuDung: number;
}