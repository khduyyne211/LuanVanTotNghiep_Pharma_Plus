export interface DanhMucSanPham {
  maDanhMuc: number;
  maDanhMucCha: number | null;
  tenDanhMucCha: string | null;
  tenDanhMuc: string;
  moTa: string | null;
  thuTuHienThi: number | null;
  trangThaiHienThi: boolean;
}

export interface DanhMucSanPhamRequest {
  maDanhMucCha: number | null;
  tenDanhMuc: string;
  moTa: string | null;
  thuTuHienThi: number | null;
}