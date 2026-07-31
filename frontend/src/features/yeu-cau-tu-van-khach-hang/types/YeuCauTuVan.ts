export interface YeuCauTuVanDanhSach {
  maYeuCauTuVan: number;
  ngayTao: string;
  trangThaiTuVan: string;
}

export interface YeuCauTuVanChiTiet {
  tenKhachHang: string;
  soDienThoai: string;
  noiDungCanTuVan: string;
  hinhThucLienHe: string;
  tenNhanVienTiepNhan: string | null;
  ketQuaTuVan: string | null;
  trangThaiTuVan: string;
  ngayTao: string;
}

export interface ThongTinTaoYeuCauTuVan {
  tenKhachHang: string;
  soDienThoai: string;
}

export interface TaoYeuCauTuVanRequest {
  tenKhachHang: string;
  soDienThoai: string;
  noiDungCanTuVan: string;
  hinhThucLienHe: "DIEN_THOAI" | "ZALO";
}