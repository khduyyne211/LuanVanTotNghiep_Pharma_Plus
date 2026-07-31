import type { TrangThaiDonHang } from "../types/DonHang";

export type BoLocTrangThaiDonHang = "TAT_CA" | TrangThaiDonHang;

export interface LuaChonTrangThaiDonHang {
  giaTri: BoLocTrangThaiDonHang;
  nhan: string;
}

export const DANH_SACH_BO_LOC_DON_HANG: LuaChonTrangThaiDonHang[] = [
  { giaTri: "TAT_CA", nhan: "Tất cả" },
  { giaTri: "CHO_XU_LY", nhan: "Chờ xử lý" },
  { giaTri: "DANG_XU_LY", nhan: "Đang xử lý" },
  { giaTri: "DANG_GIAO", nhan: "Đang giao" },
  { giaTri: "DA_GIAO", nhan: "Đã giao" },
  { giaTri: "DA_HUY", nhan: "Đã hủy" },
];

export const TEN_TRANG_THAI_DON_HANG: Record<TrangThaiDonHang, string> = {
  CHO_THANH_TOAN: "Chờ thanh toán",
  CHO_XU_LY: "Chờ xử lý",
  DANG_XU_LY: "Đang xử lý",
  DANG_GIAO: "Đang giao",
  DA_GIAO: "Đã giao",
  DA_HUY: "Đã hủy",
};