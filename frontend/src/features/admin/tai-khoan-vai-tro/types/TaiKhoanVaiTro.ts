export interface VaiTro {
  maVaiTro: number;
  tenVaiTro: string;
  moTa: string | null;
  trangThai: boolean;
}

export interface VaiTroRequest {
  tenVaiTro: string;
  moTa: string | null;
}

export interface VaiTroTaiKhoan {
  maVaiTro: number;
  tenVaiTro: string;
  trangThai: boolean;
}

export interface TaiKhoanNhanVien {
  maNhanVien: number;
  maTaiKhoan: number;
  hoTen: string;
  soDienThoai: string;
  trangThaiTaiKhoan: boolean;
  trangThaiLamViec: boolean;
  ngayTao: string;
  danhSachVaiTro: VaiTroTaiKhoan[];
}

export interface TaiKhoanNhanVienTaoRequest {
  hoTen: string;
  soDienThoai: string;
  matKhau: string;
  danhSachMaVaiTro: number[];
}

export interface TaiKhoanNhanVienCapNhatRequest {
  hoTen: string;
  soDienThoai: string;
  danhSachMaVaiTro: number[];
}