export interface DiaChiGiaoHang {
  maDiaChi: number;
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  thanhPho: string;
  phuongKhuVuc: string;
  diaChiChiTiet: string;
  laMacDinh: boolean;
  trangThaiSuDung: boolean;
}

export interface LuuDiaChiGiaoHangRequest {
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  thanhPho: string;
  phuongKhuVuc: string;
  diaChiChiTiet: string;
  laMacDinh: boolean;
}

export type LoiTruongDiaChiGiaoHang = Partial<
  Record<keyof LuuDiaChiGiaoHangRequest, string>
>;

export interface LoiApiDiaChiGiaoHang {
  message?: string;
  detail?: string;
  fieldErrors?: LoiTruongDiaChiGiaoHang;
}
