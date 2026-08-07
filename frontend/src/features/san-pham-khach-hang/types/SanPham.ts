import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";

export interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;

  /**
   * Giá gốc của đơn vị đại diện trước khuyến mãi.
   */
  giaBanGoc: number;

  /**
   * Giá sau khuyến mãi đang hiển thị cho khách hàng.
   */
  giaBan: number;

  /**
   * Số tiền được giảm trên một đơn vị đại diện.
   */
  soTienGiam: number;

  coKhuyenMai: boolean;

  /**
   * True khi không có đơn vị nào đủ tồn để bán.
   */
  hetHang: boolean;

  laThuocKeDon: boolean;
  tenNhaSanXuat: string | null;
  maDanhMuc: number | null;
  tenDanhMuc: string | null;
  moTaNgan: string | null;
  moTaQuyDoi: string | null;
  danhSachDonViBan: DonViBanSanPham[];
}
