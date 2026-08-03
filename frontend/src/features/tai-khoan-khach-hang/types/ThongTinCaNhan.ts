export type GioiTinh = "NAM" | "NU" | "KHAC";

export interface ThongTinCaNhan {
  soDienThoai: string;
  hoTen: string;
  gioiTinh: GioiTinh | null;
  ngaySinh: string | null;
}

export interface CapNhatThongTinCaNhanRequest {
  hoTen: string;
  gioiTinh: GioiTinh | null;
  ngaySinh: string | null;
}