export interface PageResponseKhachHang<T> {
  danhSachNoiDung: T[];

  trangHienTai: number;

  soPhanTuMoiTrang: number;

  tongSoPhanTu: number;

  tongSoTrang: number;

  laTrangCuoi: boolean;
}