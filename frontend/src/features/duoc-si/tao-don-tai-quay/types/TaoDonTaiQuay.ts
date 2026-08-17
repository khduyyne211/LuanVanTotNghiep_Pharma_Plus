import type {
  SanPhamDaChonLenDon,
  SanPhamDuocSi,
} from "../../len-don/types/LenDonDuocSi";

export type LoaiKhachTaiQuay = "CO_TAI_KHOAN" | "VANG_LAI";

export type KhachHangDuocSi = {
  maKhachHang: number;
  hoTen: string;
  soDienThoai: string;
};

export type TaoDonTaiQuayRequest = {
  loaiKhach: LoaiKhachTaiQuay;
  maKhachHang: number | null;
  danhSachChiTiet: Array<{
    maDonViSanPham: number;
    soLuong: number;
  }>;
  ghiChu: string | null;
};

export type { SanPhamDaChonLenDon, SanPhamDuocSi };
