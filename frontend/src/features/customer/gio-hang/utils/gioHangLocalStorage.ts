import type { DonViBanSanPham } from "../../../../shared/types/DonViBanSanPham";
import type { ChiTietGioHangLocal } from "../types/GioHangLocal";

function taoKhoaGioHang(maKhachHang: number): string {
  return `pharma_gio_hang_${maKhachHang}`;
}

function laDonViBanSanPham(duLieu: unknown): duLieu is DonViBanSanPham {
  if (typeof duLieu !== "object" || duLieu === null) return false;

  const donVi = duLieu as Partial<DonViBanSanPham>;

  return (
    typeof donVi.maDonViSanPham === "number" &&
    typeof donVi.tenDonViTinh === "string" &&
    (typeof donVi.giaBanTheoDonVi === "number" ||
      donVi.giaBanTheoDonVi === null)
  );
}

function chuanHoaChiTietGioHangLocal(
  duLieu: unknown
): ChiTietGioHangLocal | null {
  if (typeof duLieu !== "object" || duLieu === null) return null;

  const chiTiet = duLieu as Partial<ChiTietGioHangLocal>;

  if (
    typeof chiTiet.maSanPham !== "number" ||
    typeof chiTiet.maDonViSanPham !== "number" ||
    typeof chiTiet.soLuong !== "number" ||
    chiTiet.soLuong <= 0 ||
    typeof chiTiet.tenSanPham !== "string" ||
    (typeof chiTiet.hinhAnh !== "string" && chiTiet.hinhAnh !== null) ||
    typeof chiTiet.tenDonViTinh !== "string" ||
    typeof chiTiet.giaBanTamThoi !== "number"
  ) {
    return null;
  }

  const danhSachDonViBan = Array.isArray(chiTiet.danhSachDonViBan)
    ? chiTiet.danhSachDonViBan.filter(laDonViBanSanPham)
    : [];

  return {
    maSanPham: chiTiet.maSanPham,
    maDonViSanPham: chiTiet.maDonViSanPham,
    soLuong: Math.max(1, Math.floor(chiTiet.soLuong)),
    tenSanPham: chiTiet.tenSanPham,
    hinhAnh: chiTiet.hinhAnh,
    tenDonViTinh: chiTiet.tenDonViTinh,
    giaBanTamThoi: chiTiet.giaBanTamThoi,
    danhSachDonViBan,
  };
}

export function layGioHangLocal(maKhachHang: number): ChiTietGioHangLocal[] {
  try {
    const duLieuDaLuu = localStorage.getItem(taoKhoaGioHang(maKhachHang));
    if (!duLieuDaLuu) return [];

    const duLieuDaChuyen: unknown = JSON.parse(duLieuDaLuu);
    if (!Array.isArray(duLieuDaChuyen)) return [];

    return duLieuDaChuyen
      .map(chuanHoaChiTietGioHangLocal)
      .filter((chiTiet): chiTiet is ChiTietGioHangLocal => chiTiet !== null);
  } catch {
    return [];
  }
}

export function luuGioHangLocal(
  maKhachHang: number,
  danhSachChiTiet: ChiTietGioHangLocal[]
): void {
  localStorage.setItem(
    taoKhoaGioHang(maKhachHang),
    JSON.stringify(danhSachChiTiet)
  );
}

export function xoaGioHangLocal(maKhachHang: number): void {
  localStorage.removeItem(taoKhoaGioHang(maKhachHang));
}