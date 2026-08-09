import type { DonViBanSanPham } from "../../../../shared/types/DonViBanSanPham";
//Tạo kiểu dữ liệu giỏ hàng local
export interface ChiTietGioHangLocal {
  maSanPham: number;
  maDonViSanPham: number;
  soLuong: number;
  tenSanPham: string;
  hinhAnh: string | null;
  tenDonViTinh: string;
  giaBanTamThoi: number;
  danhSachDonViBan: DonViBanSanPham[];
}