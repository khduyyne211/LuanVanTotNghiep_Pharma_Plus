import axiosClient from "../../../../shared/api/axiosClient";

import type {
  DanhMucSanPham,
  DanhMucSanPhamRequest,
} from "../types/DanhMucSanPham";

export const layDanhSachDanhMucSanPham = () => {
  return axiosClient.get<DanhMucSanPham[]>(
    "/danh-muc-san-pham"
  );
};

export const layChiTietDanhMucSanPham = (
  maDanhMuc: number
) => {
  return axiosClient.get<DanhMucSanPham>(
    `/danh-muc-san-pham/${maDanhMuc}`
  );
};

export const themDanhMucSanPham = (
  request: DanhMucSanPhamRequest
) => {
  return axiosClient.post<DanhMucSanPham>(
    "/danh-muc-san-pham",
    request
  );
};

export const capNhatDanhMucSanPham = (
  maDanhMuc: number,
  request: DanhMucSanPhamRequest
) => {
  return axiosClient.put<DanhMucSanPham>(
    `/danh-muc-san-pham/${maDanhMuc}`,
    request
  );
};

export const anDanhMucSanPham = (
  maDanhMuc: number
) => {
  return axiosClient.put<DanhMucSanPham>(
    `/danh-muc-san-pham/${maDanhMuc}/an`
  );
};

export const hienDanhMucSanPham = (
  maDanhMuc: number
) => {
  return axiosClient.put<DanhMucSanPham>(
    `/danh-muc-san-pham/${maDanhMuc}/hien`
  );
};