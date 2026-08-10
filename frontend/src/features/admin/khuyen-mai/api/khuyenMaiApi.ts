import axiosClient from "../../../../shared/api/axiosClient";

import type {
  KhuyenMai,
  KhuyenMaiRequest,
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