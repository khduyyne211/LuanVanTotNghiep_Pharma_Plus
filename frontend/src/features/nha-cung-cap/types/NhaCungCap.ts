export interface NhaCungCap {
  maNhaCungCap: number;
  tenNhaCungCap: string;
  soDienThoai: string | null;
  diaChi: string | null;
  email: string | null;
  trangThaiHopTac: boolean;
}

export interface NhaCungCapRequest {
  tenNhaCungCap: string;
  soDienThoai: string | null;
  diaChi: string | null;
  email: string | null;
}