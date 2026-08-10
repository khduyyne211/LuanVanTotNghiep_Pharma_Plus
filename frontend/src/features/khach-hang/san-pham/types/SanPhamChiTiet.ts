import type { DonViBanSanPham } from "./DonViBanSanPham";
import type { ThanhPhanHoatChat } from "./ThanhPhanHoatChat";
import type { DuLieuChuyenMonThuoc } from "./DuLieuChuyenMonThuoc";

export interface SanPhamChiTiet {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;

  /**
   * Giá gốc của đơn vị đại diện trước khuyến mãi.
   */
  giaBanGoc: number;

  /**
   * Giá sau khuyến mãi của đơn vị đại diện.
   */
  giaBan: number;

  soTienGiam: number;
  coKhuyenMai: boolean;
  hetHang: boolean;

  laThuocKeDon: boolean;
  trangThaiSanPham: boolean;
  moTaNgan: string | null;
  moTa: string | null;
  maDanhMuc: number | null;
  tenDanhMuc: string | null;
  tenNhaSanXuat: string | null;
  moTaQuyDoi: string | null;
  danhSachDonViBan: DonViBanSanPham[];
  danhSachThanhPhanHoatChat: ThanhPhanHoatChat[];
  duLieuChuyenMonThuoc: DuLieuChuyenMonThuoc | null;
}