import axiosClient from "../../../api/axiosClient";

import type {
  VaiTro,
  VaiTroRequest,
} from "../types/VaiTro";

export const layDanhSachVaiTro = () => {
  return axiosClient.get<VaiTro[]>("/vai-tro");
};


export const themVaiTro = (
  request: VaiTroRequest
) => {
  return axiosClient.post<VaiTro>(
    "/vai-tro",
    request
  );
};

export const capNhatVaiTro = (
  maVaiTro: number,
  request: VaiTroRequest
) => {
  return axiosClient.put<VaiTro>(
    `/vai-tro/${maVaiTro}`,
    request
  );
};

export const doiTrangThai = (
  maVaiTro: number
) => {
  return axiosClient.put<VaiTro>(
    `/vai-tro/${maVaiTro}/doi-trang-thai`
  );
};
