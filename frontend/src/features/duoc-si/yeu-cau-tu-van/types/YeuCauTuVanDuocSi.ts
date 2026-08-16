export type HinhThucLienHe =
  | "GOI_DIEN"
  | "ZALO";

export type TrangThaiTuVan =
  | "CHO_TIEP_NHAN"
  | "DANG_TU_VAN"
  | "DA_TU_VAN"
  | "KHONG_THE_LIEN_HE";

export type YeuCauTuVanDuocSiDanhSach = {
  maYeuCauTuVan: number;
  tenKhachHang: string;
  soDienThoai: string;
  hinhThucLienHe: HinhThucLienHe;
  trangThaiTuVan: TrangThaiTuVan;
  tenNhanVienTiepNhan: string | null;
  ngayTao: string;
};

export type YeuCauTuVanDuocSiChiTiet = {
  maYeuCauTuVan: number;
  maKhachHang: number | null;
  tenKhachHang: string;
  soDienThoai: string;
  noiDungCanTuVan: string;
  hinhThucLienHe: HinhThucLienHe;
  maNhanVienTiepNhan: number | null;
  tenNhanVienTiepNhan: string | null;
  ketQuaTuVan: string | null;
  trangThaiTuVan: TrangThaiTuVan;
  ngayTao: string;

  maSanPham: number | null;
  tenSanPham: string | null;
  hinhAnh: string | null;
  laThuocKeDon: boolean | null;
};

export type PageResponse<T> = {
  danhSachNoiDung: T[];
  trangHienTai: number;
  soPhanTuMoiTrang: number;
  tongSoPhanTu: number;
  tongSoTrang: number;
  laTrangCuoi: boolean;
};

export type HoanTatYeuCauTuVanRequest = {
  trangThaiTuVan:
    | "DA_TU_VAN"
    | "KHONG_THE_LIEN_HE";

  ketQuaTuVan: string;
};