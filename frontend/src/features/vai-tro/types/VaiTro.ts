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