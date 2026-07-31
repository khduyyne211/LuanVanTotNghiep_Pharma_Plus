import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";
import type { ThanhPhanHoatChat } from "./ThanhPhanHoatChat";
import type { DuLieuChuyenMonThuoc } from "./DuLieuChuyenMonThuoc";

export interface SanPhamChiTiet {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  giaBan: number;
  laThuocKeDon: boolean;
  trangThaiSanPham: number;
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