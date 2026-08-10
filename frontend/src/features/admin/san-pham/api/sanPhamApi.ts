import axiosClient from "../../../../shared/api/axiosClient";
import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";
import type {
  DanhMucSanPhamOption,
  DonViSanPham,
  DonViTinhOption,
  NhaSanXuatOption,
  QuyDoiDonVi,
  SanPham,
} from "../types/SanPham";

export interface ThamSoLocSanPham {
  page: number;
  size: number;
  keyword?: string;
  laThuocKeDon?: boolean;
  trangThaiSanPham?: boolean;
  maDanhMuc?: number;
  maNhaSanXuat?: number;
}

export interface SanPhamRequest {
  maDanhMuc: number;
  maNhaSanXuat: number | null;
  tenSanPham: string;
  hinhAnh: string | null;
  laThuocKeDon: boolean;
  moTaNgan: string | null;
}

export interface DonViSanPhamTaoMoiRequest {
  maDonViTinh: number;
  giaBanTheoDonVi: number | null;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
}
export interface DonViSanPhamCapNhatRequest {
  maDonViSanPham: number | null;
  maDonViTinh: number;
  giaBanTheoDonVi: number | null;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
  trangThai: boolean;
}

export interface QuyDoiDonViCapNhatRequest {
  maQuyDoi: number | null;
  maDonViNguon: number;
  soLuongNguon: number;
  maDonViDich: number;
  soLuongDich: number;
  trangThai: boolean;
}
export interface QuyDoiDonViTaoMoiRequest {
  maDonViTinhNguon: number;
  soLuongNguon: number;
  maDonViTinhDich: number;
  soLuongDich: number;
}
export interface DonViSanPhamRequest {
  maSanPham: number;
  maDonViTinh: number;
  giaBanTheoDonVi: number | null;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
}

export interface QuyDoiDonViRequest {
  maSanPham: number;

  maDonViNguon: number;
  soLuongNguon: number;

  maDonViDich: number;
  soLuongDich: number;
}
export interface ThanhPhanHoatChatTaoMoiRequest {
  maHoatChat: number;
  hamLuong: number;
  donViHamLuong: string;
  vaiTroHoatChat: string | null;
  ghiChu: string | null;
}

export interface DuLieuChuyenMonThuocRequest {
  dangBaoChe: string;
  phanLoaiThuoc: string;
  congDungThamKhao: string;
  cachDungThamKhao: string;
  canhBaoAnToan: string;
}

export interface SanPhamTaoMoiRequest {
  thongTinSanPham: SanPhamRequest;
  danhSachDonVi: DonViSanPhamTaoMoiRequest[];
  danhSachQuyDoi: QuyDoiDonViTaoMoiRequest[];
  danhSachThanhPhanHoatChat: ThanhPhanHoatChatTaoMoiRequest[];
  duLieuChuyenMonThuoc: DuLieuChuyenMonThuocRequest;
}

export const layDanhSachSanPhamPhanTrang = (
  thamSo: ThamSoLocSanPham,
) => {
  return axiosClient.get<PhanTrangResponse<SanPham>>(
    "/san-pham/phan-trang",
    { params: thamSo },
  );
};

export const layChiTietSanPhamDayDu = (
  maSanPham: number,
) => {
  return axiosClient.get<SanPham>(
    `/san-pham/${maSanPham}/chi-tiet-day-du`,
  );
};

export const capNhatSanPham = (
  maSanPham: number,
  data: SanPhamRequest,
) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}`,
    data,
  );
};

export const anSanPham = (maSanPham: number) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/an`,
  );
};

export const hienSanPham = (maSanPham: number) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/hien`,
  );
};

export const layDanhSachDanhMucSanPham = () => {
  return axiosClient.get<DanhMucSanPhamOption[]>(
    "/danh-muc-san-pham",
  );
};

export const layDanhSachNhaSanXuat = () => {
  return axiosClient.get<NhaSanXuatOption[]>(
    "/nha-san-xuat",
  );
};

export const layDanhSachDonViTinh = () => {
  return axiosClient.get<DonViTinhOption[]>(
    "/don-vi-tinh",
  );
};

export const anDonViSanPham = (maDonVi: number) => {
  return axiosClient.put<DonViSanPham>(
    `/don-vi-san-pham/${maDonVi}/an`,
  );
};

export const hienDonViSanPham = (maDonVi: number) => {
  return axiosClient.put<DonViSanPham>(
    `/don-vi-san-pham/${maDonVi}/hien`,
  );
};

export const anQuyDoiDonVi = (maQuyDoi: number) => {
  return axiosClient.put<QuyDoiDonVi>(
    `/quy-doi-don-vi/${maQuyDoi}/an`,
  );
};

export const hienQuyDoiDonVi = (maQuyDoi: number) => {
  return axiosClient.put<QuyDoiDonVi>(
    `/quy-doi-don-vi/${maQuyDoi}/hien`,
  );
};

export const themSanPham = (
  duLieu: SanPhamTaoMoiRequest,
) => {
  return axiosClient.post<SanPham>(
    "/san-pham",
    duLieu,
  );
};
export const themDonViSanPham = (
  request: DonViSanPhamRequest,
) => {
  return axiosClient.post<DonViSanPham>(
    "/don-vi-san-pham",
    request,
  );
};

export const capNhatDonViSanPham = (
  maDonViSanPham: number,
  request: DonViSanPhamRequest,
) => {
  return axiosClient.put<DonViSanPham>(
    `/don-vi-san-pham/${maDonViSanPham}`,
    request,
  );
};

export const themQuyDoiDonVi = (
  request: QuyDoiDonViRequest,
) => {
  return axiosClient.post<QuyDoiDonVi>(
    "/quy-doi-don-vi",
    request,
  );
};

export const capNhatQuyDoiDonVi = (
  maQuyDoi: number,
  request: QuyDoiDonViRequest,
) => {
  return axiosClient.put<QuyDoiDonVi>(
    `/quy-doi-don-vi/${maQuyDoi}`,
    request,
  );
};

export const capNhatThanhPhanHoatChat = (
  maSanPham: number,
  request: ThanhPhanHoatChatTaoMoiRequest[],
) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/thanh-phan-hoat-chat`,
    request,
  );
};

export const capNhatDuLieuChuyenMonThuoc = (
  maSanPham: number,
  request: DuLieuChuyenMonThuocRequest,
) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/du-lieu-chuyen-mon`,
    request,
  );
};
export const capNhatDanhSachDonViSanPham = (
  maSanPham: number,
  request: DonViSanPhamCapNhatRequest[],
) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/don-vi`,
    request,
  );
};

export const capNhatDanhSachQuyDoiDonVi = (
  maSanPham: number,
  request: QuyDoiDonViCapNhatRequest[],
) => {
  return axiosClient.put<SanPham>(
    `/san-pham/${maSanPham}/quy-doi`,
    request,
  );
};