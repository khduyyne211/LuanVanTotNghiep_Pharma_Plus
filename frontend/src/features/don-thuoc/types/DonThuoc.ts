export type TrangThaiDonThuoc =
  | ""
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI";

export interface DonThuoc {
  maDonThuoc: number;

  maKhachHang: number;
  tenKhachHang: string;
  emailKhachHang: string;
  soDienThoaiKhachHang: string;

  maNhanVienDuyet: number | null;
  tenNhanVienDuyet: string | null;

  anhDonThuoc: string;
  ngayUpload: string;
  trangThaiDonThuoc: Exclude<TrangThaiDonThuoc, "">;

  lyDoTuChoi: string | null;
  ghiChuDuocSi: string | null;
  ketQuaKiemDuyet: string | null;
}

export interface DonThuocKiemDuyetRequest {
  maNhanVienDuyet: number;
  ghiChuDuocSi: string | null;
  lyDoTuChoi?: string | null;
}
