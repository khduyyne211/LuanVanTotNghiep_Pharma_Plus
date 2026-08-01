export interface DangNhapRequest {
  soDienThoai: string;
  matKhau: string;
}

export interface NguoiDungDangNhap {
  maTaiKhoan: number;
  maKhachHang: number | null;
  maNhanVien: number | null;
  hoTen: string;
  soDienThoai: string;
  vaiTro: string;
}

export interface DangNhapResponse extends NguoiDungDangNhap {
  accessToken: string;
  loaiToken: string;
}
