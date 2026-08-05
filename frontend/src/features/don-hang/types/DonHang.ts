export type PhanTrangResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type LoaiKhachHang = "CO_TAI_KHOAN" | "VANG_LAI";

export type PhuongThucThanhToan = "COD" | "ZALOPAY" | "TIEN_MAT";

export type TrangThaiThanhToan =
  | "CHUA_THANH_TOAN"
  | "DA_THANH_TOAN"
  | "THANH_TOAN_THAT_BAI"
  | "DA_HOAN_TIEN";

export type TrangThaiDonHang =
  | "CHO_XU_LY"
  | "DANG_XU_LY"
  | "DANG_GIAO"
  | "HOAN_THANH"
  | "DA_HUY";

export type TrangThaiKiemDuyetDonHang =
  | "KHONG_CAN_DUYET"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI";

export type TrangThaiDonThuoc = "CHO_DUYET" | "DA_DUYET" | "TU_CHOI";

export type DonHangDanhSach = {
  maDonHang: number;
  maKhachHang: number | null;
  tenKhachHang: string | null;
  soDienThoaiKhachHang: string | null;
  maDonThuoc: number | null;
  maNhanVienXuLy: number | null;
  tenNhanVienXuLy: string | null;
  ngayDatHang: string;
  loaiKhach: LoaiKhachHang | null;
  tongTienHang: number;
  phiGiaoHang: number | null;
  giamGia: number | null;
  tongThanhToan: number;
  phuongThucThanhToan: PhuongThucThanhToan | null;
  trangThaiThanhToan: TrangThaiThanhToan;
  trangThaiDonHang: TrangThaiDonHang;
  trangThaiKiemDuyet: TrangThaiKiemDuyetDonHang;
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
  soDienThoaiKhachHang: string | null;

  maDiaChi: number | null;
  tenNguoiNhan: string | null;
  soDienThoaiNhan: string | null;
  thanhPho: string | null;
  phuongKhuVuc: string | null;
  diaChiChiTiet: string | null;

  maVoucher: number | null;
  maDonThuoc: number | null;

  maNhanVienXuLy: number | null;
  tenNhanVienXuLy: string | null;

  ngayDatHang: string;
  loaiKhach: LoaiKhachHang | null;

  tongTienHang: number;
  phiGiaoHang: number | null;
  giamGia: number | null;
  tongThanhToan: number;

  phuongThucThanhToan: PhuongThucThanhToan | null;
  trangThaiThanhToan: TrangThaiThanhToan;
  trangThaiDonHang: TrangThaiDonHang;

  trangThaiKiemDuyet: TrangThaiKiemDuyetDonHang;
  ngayKiemDuyet: string | null;
  ghiChuKiemDuyet: string | null;
  lyDoTuChoiDuyet: string | null;

  ghiChu: string | null;

  anhDonThuoc: string | null;
  trangThaiDonThuoc: TrangThaiDonThuoc | null;
  lyDoTuChoiDonThuoc: string | null;
  ghiChuDonThuoc: string | null;

  coThuocKeDon: boolean;
  danhSachChiTiet: ChiTietDonHang[];
};

export type DonHangBoLoc = {
  page: number;
  size: number;
  keyword?: string;
  trangThaiDonHang?: string;
  trangThaiThanhToan?: string;
  trangThaiKiemDuyet?: string;
};
