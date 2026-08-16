import axiosClient
  from "../../../../shared/api/axiosClient";

import type {
  HoanTatYeuCauTuVanRequest,
  PageResponse,
  TrangThaiTuVan,
  YeuCauTuVanDuocSiChiTiet,
  YeuCauTuVanDuocSiDanhSach,
} from "../types/YeuCauTuVanDuocSi";

export async function layDanhSachYeuCauTuVanDuocSi(
  page = 0,
  size = 10,
  trangThai?: TrangThaiTuVan,
): Promise<
  PageResponse<YeuCauTuVanDuocSiDanhSach>
> {
  const response =
    await axiosClient.get<
      PageResponse<YeuCauTuVanDuocSiDanhSach>
    >(
      "/duoc-si/yeu-cau-tu-van",
      {
        params: {
          page,
          size,
          trangThai:
            trangThai || undefined,
        },
      },
    );

  return response.data;
}

export async function layChiTietYeuCauTuVanDuocSi(
  maYeuCauTuVan: number,
): Promise<YeuCauTuVanDuocSiChiTiet> {
  const response =
    await axiosClient.get<
      YeuCauTuVanDuocSiChiTiet
    >(
      `/duoc-si/yeu-cau-tu-van/${maYeuCauTuVan}`,
    );

  return response.data;
}

export async function tiepNhanYeuCauTuVanDuocSi(
  maYeuCauTuVan: number,
): Promise<YeuCauTuVanDuocSiChiTiet> {
  const response =
    await axiosClient.put<
      YeuCauTuVanDuocSiChiTiet
    >(
      `/duoc-si/yeu-cau-tu-van/${maYeuCauTuVan}/tiep-nhan`,
    );

  return response.data;
}

export async function hoanTatYeuCauTuVanDuocSi(
  maYeuCauTuVan: number,
  request: HoanTatYeuCauTuVanRequest,
): Promise<YeuCauTuVanDuocSiChiTiet> {
  const response =
    await axiosClient.put<
      YeuCauTuVanDuocSiChiTiet
    >(
      `/duoc-si/yeu-cau-tu-van/${maYeuCauTuVan}/hoan-tat`,
      request,
    );

  return response.data;
}