export type PhanTrangResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type DonHangDanhSach = {
  maDonHang: number;
  maKhachHang: number | null;
  tenKhachHang: string | null;
  emailKhachHang: string | null;
  soDienThoaiKhachHang: string | null;
  maDonThuoc: number | null;
  maNhanVienXuLy: number | null;
  tenNhanVienXuLy: string | null;
  ngayDatHang: string;
  loaiKhach: string | null;
  tongTienHang: number;
  phiGiaoHang: number | null;
  giamGia: number | null;
  tongThanhToan: number;
  phuongThucThanhToan: string | null;
  trangThaiThanhToan: string | null;
  trangThaiDonHang: string;
  trangThaiKiemDuyet: string;
  coThuocKeDon: boolean;
};

export type ChiTietDonHang = {
  maChiTietDonHang: number;
  maSanPham: number;
  tenSanPham: string;
  laThuocKeDon: boolean;
  hinhAnh: string | null;
  maDonViSanPham: number;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  soLuong: number;
  donGia: number;
  giamGia: number | null;
  thanhTien: number;
  cachTinhGia: string | null;
};

export type DonHangChiTiet = {
  maDonHang: number;
  maKhachHang: number | null;
  tenKhachHang: string | null;
  emailKhachHang: string | null;
  soDienThoaiKhachHang: string | null;
  maDiaChi: number | null;
  tenNguoiNhan: string | null;
  soDienThoaiNhan: string | null;
  tinhThanh: string | null;
  quanHuyen: string | null;
  phuongXa: string | null;
  diaChiChiTiet: string | null;
  maVoucher: number | null;
  maDonThuoc: number | null;
  maNhanVienXuLy: number | null;
  tenNhanVienXuLy: string | null;
  maDuocSiDuyet: number | null;
  tenDuocSiDuyet: string | null;
  ngayDatHang: string;
  loaiKhach: string | null;
  tongTienHang: number;
  phiGiaoHang: number | null;
  giamGia: number | null;
  tongThanhToan: number;
  phuongThucThanhToan: string | null;
  trangThaiThanhToan: string | null;
  trangThaiDonHang: string;
  trangThaiKiemDuyet: string;
  ngayKiemDuyet: string | null;
  ghiChuKiemDuyet: string | null;
  lyDoTuChoiDuyet: string | null;
  ghiChu: string | null;
  anhDonThuoc: string | null;
  trangThaiDonThuoc: string | null;
  ketQuaKiemDuyetDonThuoc: string | null;
  coThuocKeDon: boolean;
  danhSachChiTiet: ChiTietDonHang[];
};

export type SanPhamBanTaiQuay = {
  maDonViSanPham: number;
  maSanPham: number;
  tenSanPham: string;
  hinhAnh: string | null;
  laThuocKeDon: boolean;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  giaBanTheoDonVi: number;
};

export type ChiTietTaoDonTaiQuayRequest = {
  maDonViSanPham: number;
  soLuong: number;
};

export type TaoDonTaiQuayRequest = {
  maDuocSiXuLy: number;
  phuongThucThanhToan: "TIEN_MAT" | "QR";
  ghiChu: string | null;
  xacNhanDaKiemTraDonThuoc: boolean;
  ghiChuKiemDuyet: string | null;
  danhSachChiTiet: ChiTietTaoDonTaiQuayRequest[];
};

export type DonHangBoLoc = {
  page: number;
  size: number;
  keyword?: string;
  trangThaiDonHang?: string;
  trangThaiThanhToan?: string;
  trangThaiKiemDuyet?: string;
};
