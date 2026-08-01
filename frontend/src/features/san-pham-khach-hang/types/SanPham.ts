import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";

export interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  giaBan: number;
  laThuocKeDon: boolean;
  tenNhaSanXuat: string | null;
  maDanhMuc: number | null;
  tenDanhMuc: string | null;
  moTaNgan: string | null;
  moTaQuyDoi: string | null;
  danhSachDonViBan: DonViBanSanPham[];
}