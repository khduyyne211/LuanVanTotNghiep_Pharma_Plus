export type TrangThaiDonThuocKhachHang =
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI";

export interface DonThuocKhachHang {
  maDonThuoc: number;

  anhDonThuoc: string;

  ngayUpload: string;

  trangThaiDonThuoc:
    TrangThaiDonThuocKhachHang;

  tenNhanVienDuyet: string | null;

  lyDoTuChoi: string | null;

  ghiChuDuocSi: string | null;
}