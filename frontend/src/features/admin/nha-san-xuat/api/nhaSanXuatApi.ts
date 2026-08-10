import axiosClient from "../../../../shared/api/axiosClient";

import type {
  NhaSanXuat,
  NhaSanXuatRequest,
} from "../types/NhaSanXuat";

export const layDanhSachNhaSanXuat = () => {
  return axiosClient.get<NhaSanXuat[]>(
    "/nha-san-xuat"
  );
};

export const layChiTietNhaSanXuat = (
  maNhaSanXuat: number
) => {
  return axiosClient.get<NhaSanXuat>(
    `/nha-san-xuat/${maNhaSanXuat}`
  );
};

export const themNhaSanXuat = (
  request: NhaSanXuatRequest
) => {
  return axiosClient.post<NhaSanXuat>(
    "/nha-san-xuat",
    request
  );
};

export const capNhatNhaSanXuat = (
  maNhaSanXuat: number,
  request: NhaSanXuatRequest
) => {
  return axiosClient.put<NhaSanXuat>(
    `/nha-san-xuat/${maNhaSanXuat}`,
    request
  );
};

export const anNhaSanXuat = (
  maNhaSanXuat: number
) => {
  return axiosClient.put<NhaSanXuat>(
    `/nha-san-xuat/${maNhaSanXuat}/an`
  );
};

export const hienNhaSanXuat = (
  maNhaSanXuat: number
) => {
  return axiosClient.put<NhaSanXuat>(
    `/nha-san-xuat/${maNhaSanXuat}/hien`
  );
};