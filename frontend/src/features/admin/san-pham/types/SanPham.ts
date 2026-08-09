export interface DonViSanPham {
  maDonViSanPham: number;
  maSanPham: number;
  tenSanPham: string;

  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string;

  giaBanTheoDonVi: number | null;

  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
  trangThai: boolean;
}

export interface QuyDoiDonVi {
  maQuyDoi: number;
  maSanPham: number;

  maDonViNguon: number;
  tenDonViNguon: string;
  kyHieuDonViNguon: string;
  soLuongNguon: number;

  maDonViDich: number;
  tenDonViDich: string;
  kyHieuDonViDich: string;
  soLuongDich: number;

  trangThai: boolean;
}

export interface SanPham {
  maSanPham: number;

  maDanhMuc: number;
  tenDanhMuc: string;

  maNhaSanXuat: number | null;
  tenNhaSanXuat: string | null;

  tenSanPham: string;
  hinhAnh: string | null;
  laThuocKeDon: boolean;
  trangThaiSanPham: boolean;
  moTaNgan: string | null;
  ngayTao: string;

  danhSachDonViSanPham?: DonViSanPham[] | null;
  danhSachQuyDoiDonVi?: QuyDoiDonVi[] | null;
}
export interface DanhMucSanPhamOption {
  maDanhMuc: number;
  tenDanhMuc: string;
  trangThaiHienThi: boolean;
}

export interface NhaSanXuatOption {
  maNhaSanXuat: number;
  tenNhaSanXuat: string;
  trangThai: boolean;
}

export interface DonViTinhOption {
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  trangThai: boolean;
}
