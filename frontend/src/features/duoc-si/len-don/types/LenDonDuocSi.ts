export type LoaiNguonLenDon = "YEU_CAU_TU_VAN" | "DON_THUOC";

export type NguonLenDonDuocSi = {
  loaiNguon: LoaiNguonLenDon;
  maNguon: number;
  maKhachHang: number;
  tenKhachHang: string;
  soDienThoaiKhachHang: string;
};

export type DonViBanDuocSi = {
  maDonViSanPham: number;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  giaGoc: number;
  giaSauKhuyenMai: number;
  cachTinhGia: string | null;
  laDonViCoSo: boolean;
  laDonViBanMacDinh: boolean;
  soLuongToiDa: number;
};

export type SanPhamDuocSi = {
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  laThuocKeDon: boolean;
  danhSachDonViBan: DonViBanDuocSi[];
};

export type DiaChiGiaoHangTaoDonDuocSi = {
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  thanhPho: string;
  phuongKhuVuc: string;
  diaChiChiTiet: string;
  laMacDinh: boolean;
};

export type ChiTietTaoDonHangDuocSiRequest = {
  maDonViSanPham: number;
  soLuong: number;
};

export type TaoDonHangDuocSiRequest = {
  diaChiGiaoHang: DiaChiGiaoHangTaoDonDuocSi;
  danhSachChiTiet: ChiTietTaoDonHangDuocSiRequest[];
  phuongThucThanhToan: "COD" | "ZALOPAY";
  ghiChu: string | null;
};

export type SanPhamDaChonLenDon = {
  maSanPham: number;
  tenSanPham: string;
  laThuocKeDon: boolean;
  maDonViSanPham: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  giaGoc: number;
  giaSauKhuyenMai: number;
  soLuongToiDa: number;
  soLuong: number;
};
