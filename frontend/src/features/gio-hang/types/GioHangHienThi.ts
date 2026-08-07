import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";

/**
 * Dữ liệu giỏ hàng hiển thị được kết hợp từ:
 * - dữ liệu tạm trong localStorage;
 * - giá, quy đổi và tồn kho mới nhất từ backend.
 */
export interface ChiTietGioHangHienThi {
  maSanPham: number;
  maDonViSanPham: number;
  soLuong: number;

  tenSanPham: string;
  hinhAnh: string | null;
  tenDonViTinh: string;
  danhSachDonViBan: DonViBanSanPham[];

  /**
   * Giá gốc trên một đơn vị.
   */
  giaBanTheoDonVi: number;

  /**
   * Số tiền giảm trên một đơn vị.
   */
  soTienGiamMoiDonVi: number;

  /**
   * Giá thực trả trên một đơn vị.
   */
  giaSauKhuyenMai: number;

  coKhuyenMai: boolean;

  thanhTienGoc: number;
  tongSoTienGiam: number;
  thanhTien: number;

  heSoQuyDoiVeDonViCoSo: number | null;
  tonKhaDungTheoQuyDoi: number | null;
  daCoThongTinKiemTra: boolean;
}