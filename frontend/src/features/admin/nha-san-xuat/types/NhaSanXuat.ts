export interface NhaSanXuat {
  maNhaSanXuat: number;
  tenNhaSanXuat: string;
  quocGia: string | null;
  diaChi: string | null;
  trangThai: boolean;
}

export interface NhaSanXuatRequest {
  tenNhaSanXuat: string;
  quocGia: string | null;
  diaChi: string | null;
}