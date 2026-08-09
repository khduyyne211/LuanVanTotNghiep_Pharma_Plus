import axiosClient from "../../../../api/axiosClient";

import type {
  DonViTinh,
  DonViTinhRequest,
} from "../types/DonViTinh";

export const layDanhSachDonViTinh = () => {
  return axiosClient.get<DonViTinh[]>(
    "/don-vi-tinh"
  );
};

export const layChiTietDonViTinh = (
  maDonViTinh: number
) => {
  return axiosClient.get<DonViTinh>(
    `/don-vi-tinh/${maDonViTinh}`
  );
};

export const themDonViTinh = (
  request: DonViTinhRequest
) => {
  return axiosClient.post<DonViTinh>(
    "/don-vi-tinh",
    request
  );
};

export const capNhatDonViTinh = (
  maDonViTinh: number,
  request: DonViTinhRequest
) => {
  return axiosClient.put<DonViTinh>(
    `/don-vi-tinh/${maDonViTinh}`,
    request
  );
};

export const anDonViTinh = (
  maDonViTinh: number
) => {
  return axiosClient.put<DonViTinh>(
    `/don-vi-tinh/${maDonViTinh}/an`
  );
};

export const hienDonViTinh = (
  maDonViTinh: number
) => {
  return axiosClient.put<DonViTinh>(
    `/don-vi-tinh/${maDonViTinh}/hien`
  );
};