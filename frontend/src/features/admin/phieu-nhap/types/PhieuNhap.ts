export type TrangThaiPhieuNhap =
  | "CHO_XAC_NHAN"
  | "DA_NHAP"
  | "DA_HUY";

export type TrangThaiLo =
  | "DANG_SU_DUNG"
  | "HET_HANG"
  | "HET_HAN"
  | "NGUNG_SU_DUNG";

export interface ChiTietPhieuNhap {
  maChiTietPhieuNhap: number;

  maSanPham: number;
  tenSanPham: string;

  maDonViSanPham: number;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;

  soLuongNhap: number;
  soLuongTheoQuyDoi: number;
  soLuongConLaiTheoQuyDoi: number;

  donGiaNhap: number;
  thanhTien: number;

  hanSuDung: string;
  trangThaiLo: TrangThaiLo;
}

export interface PhieuNhap {
  maPhieuNhap: number;

  maNhaCungCap: number;
  tenNhaCungCap: string;

  maNhanVienLap: number;
  tenNhanVienLap: string;

  ngayNhap: string;
  tongTien: number;

  trangThaiPhieuNhap: TrangThaiPhieuNhap;
  ghiChu: string | null;

  danhSachChiTiet: ChiTietPhieuNhap[];
}

export interface ChiTietPhieuNhapTaoMoiRequest {
  maSanPham: number;
  maDonViSanPham: number;
  soLuongNhap: number;
  donGiaNhap: number;
  hanSuDung: string;
}

export interface PhieuNhapTaoMoiRequest {
  maNhaCungCap: number;
  maNhanVienLap: number;
  ghiChu: string | null;
  danhSachChiTiet: ChiTietPhieuNhapTaoMoiRequest[];
}
export interface DonViNhapKhoOption {
  maDonViSanPham: number;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
}

export interface SanPhamNhapKhoOption {
  maSanPham: number;
  tenSanPham: string;
  danhSachDonViNhap: DonViNhapKhoOption[];
}