import axiosClient from "../../../api/axiosClient";

import type {
  KhuyenMai,
  KhuyenMaiRequest,
} from "../types/KhuyenMai";

export const layDanhSachKhuyenMai = () => {
  return axiosClient.get<KhuyenMai[]>(
    "/khuyen-mai"
  );
};

export const layChiTietKhuyenMai = (
  maKhuyenMai: number
) => {
  return axiosClient.get<KhuyenMai>(
    `/khuyen-mai/${maKhuyenMai}`
  );
};

export const themKhuyenMai = (
  request: KhuyenMaiRequest
) => {
  return axiosClient.post<KhuyenMai>(
    "/khuyen-mai",
    request
  );
};

export const capNhatKhuyenMai = (
  maKhuyenMai: number,
  request: KhuyenMaiRequest
) => {
  return axiosClient.put<KhuyenMai>(
    `/khuyen-mai/${maKhuyenMai}`,
    request
  );
};