import axiosClient from "../../../../shared/api/axiosClient";

import type {
  CapNhatSanPhamKhuyenMaiRequest,
  KhuyenMai,
  KhuyenMaiRequest,
  KhuyenMaiSanPham,
  PhanTrangResponse,
} from "../types/KhuyenMai";

export const layDanhSachKhuyenMai = () => {
  return axiosClient.get<KhuyenMai[]>(
    "/khuyen-mai"
  );
};

export const themKhuyenMai = (
  request: KhuyenMaiRequest
) => {
  return axiosClient.post(
    "/khuyen-mai",
    request
  );
};

export const capNhatKhuyenMai = (
  maKhuyenMai: number,
  request: KhuyenMaiRequest
) => {
  return axiosClient.put(
    `/khuyen-mai/${maKhuyenMai}`,
    request
  );
};

export const layDanhSachSanPhamDangGan = (
  maKhuyenMai: number
) => {
  return axiosClient.get<KhuyenMaiSanPham[]>(
    `/khuyen-mai/${maKhuyenMai}/san-pham`
  );
};

export const layDanhSachSanPhamCoTheGan = (
  maKhuyenMai: number,
  keyword = "",
  maDanhMuc: number | null = null,
  baoGomDanhMucCon = false,
  page = 0,
  size = 10
) => {
  return axiosClient.get<
    PhanTrangResponse<KhuyenMaiSanPham>
  >(
    `/khuyen-mai/${maKhuyenMai}/san-pham-co-the-gan`,
    {
      params: {
        keyword,
        maDanhMuc,
        baoGomDanhMucCon,
        page,
        size,
      },
    }
  );
};

export const capNhatDanhSachSanPhamKhuyenMai = (
  maKhuyenMai: number,
  request: CapNhatSanPhamKhuyenMaiRequest
) => {
  return axiosClient.put<KhuyenMaiSanPham[]>(
    `/khuyen-mai/${maKhuyenMai}/san-pham`,
    request
  );
};
