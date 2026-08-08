import axiosClient from "../../../../api/axiosClient";

import type {
  NhaCungCap,
  NhaCungCapRequest,
} from "../types/NhaCungCap";

export const layDanhSachNhaCungCap = () => {
  return axiosClient.get<NhaCungCap[]>("/nha-cung-cap");
};

export const layChiTietNhaCungCap = (
  maNhaCungCap: number
) => {
  return axiosClient.get<NhaCungCap>(
    `/nha-cung-cap/${maNhaCungCap}`
  );
};

export const themNhaCungCap = (
  request: NhaCungCapRequest
) => {
  return axiosClient.post<NhaCungCap>(
    "/nha-cung-cap",
    request
  );
};

export const capNhatNhaCungCap = (
  maNhaCungCap: number,
  request: NhaCungCapRequest
) => {
  return axiosClient.put<NhaCungCap>(
    `/nha-cung-cap/${maNhaCungCap}`,
    request
  );
};

export const doiTrangThaiHopTac = (
  maNhaCungCap: number
) => {
  return axiosClient.put<NhaCungCap>(
    `/nha-cung-cap/${maNhaCungCap}/doi-trang-thai`
  );
};
