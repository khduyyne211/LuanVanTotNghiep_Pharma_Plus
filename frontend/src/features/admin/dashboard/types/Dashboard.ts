export interface DashboardTongQuan {
  tongSanPham: number;
  tongKhachHang: number;
  tongNhanVien: number;
  donMoiHomNay: number;
  donDangXuLy: number;
  doanhThuHomNay: number;
  doanhThuThangNay: number;
}

export interface DashboardDoanhThu {
  tuNgay: string;
  denNgay: string;
  doanhThu: number;
}

export interface DashboardTonKhoThap {
  maSanPham: number;
  tenSanPham: string;
  tongSoLuongTon: number;
  nguongTon: number;
}

export type MucCanhBaoHetHan =
  | "NGUY_CAP"
  | "SAP_HET_HAN"
  | "CAN_THEO_DOI";

export interface DashboardLoSapHetHan {
  maChiTietPhieuNhap: number;
  maPhieuNhap: number;
  maSanPham: number;
  tenSanPham: string;
  maDonViSanPham: number;
  tenDonViTinh: string;
  soLuongConLai: number;
  hanSuDung: string;
  soNgayConLai: number;
  mucCanhBao: MucCanhBaoHetHan;
}