import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";

export interface ChiTietGioHang {
  maChiTietGioHang: number;

  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;

  maDonViSanPham: number;
  maDonViTinh: number | null;
  tenDonViTinh: string | null;
  kyHieuDonViTinh: string | null;

  soLuong: number;
  donGia: number;
  thanhTien: number;

  danhSachDonViBan: DonViBanSanPham[];
}