export type TrangThaiDonThuoc =
  | ""
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI";

export interface DonThuoc {
  maDonThuoc: number;
  maDonHang: number | null;

  maKhachHang: number;
  tenKhachHang: string;
  soDienThoaiKhachHang: string;

  maNhanVienDuyet: number | null;
  tenNhanVienDuyet: string | null;

  anhDonThuoc: string;
  ngayUpload: string;
  trangThaiDonThuoc: Exclude<TrangThaiDonThuoc, "">;

  lyDoTuChoi: string | null;
  ghiChu: string | null;
}

export interface DonThuocKiemDuyetRequest {
  ghiChu: string | null;
  lyDoTuChoi?: string | null;
}
