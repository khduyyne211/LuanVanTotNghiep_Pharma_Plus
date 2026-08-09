export interface DonViTinh {
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  moTa: string | null;
  trangThai: boolean;
}

export interface DonViTinhRequest {
  tenDonViTinh: string;
  kyHieu: string | null;
  moTa: string | null;
}