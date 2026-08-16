export interface SanPhamTuVan {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  laThuocKeDon: boolean;
}

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

  sanPham: SanPhamTuVan | null;
}

export interface ThongTinTaoYeuCauTuVan {
  tenKhachHang: string;
  soDienThoai: string;
}

export interface TaoYeuCauTuVanRequest {
  tenKhachHang: string;
  soDienThoai: string;
  noiDungCanTuVan: string;
  hinhThucLienHe: "GOI_DIEN" | "ZALO";

  /**
   * Không bắt buộc.
   * Một yêu cầu tư vấn chỉ gắn tối đa một sản phẩm.
   */
  maSanPham: number | null;
}