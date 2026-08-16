import axiosClient from "../../../../shared/api/axiosClient";
import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";

import type {
  DonThuoc,
  DonThuocKiemDuyetRequest,
  TrangThaiDonThuoc,
} from "../types/DonThuoc";

type LayDanhSachDonThuocParams = {
  page: number;
  size: number;
  keyword?: string;
  trangThai?: TrangThaiDonThuoc;
};

export async function layDanhSachDonThuoc({
  page,
  size,
  keyword,
  trangThai,
}: LayDanhSachDonThuocParams): Promise<PhanTrangResponse<DonThuoc>> {
  const response = await axiosClient.get<PhanTrangResponse<DonThuoc>>(
    "/duoc-si/don-thuoc/phan-trang",
    {
      params: {
        page,
        size,
        keyword: keyword || undefined,
        trangThai: trangThai || undefined,
      },
    },
  );

  return response.data;
}

export async function layChiTietDonThuoc(
  maDonThuoc: number,
): Promise<DonThuoc> {
  const response = await axiosClient.get<DonThuoc>(
    `/duoc-si/don-thuoc/${maDonThuoc}`,
  );

  return response.data;
}

export async function duyetDonThuoc(
  maDonThuoc: number,
  request: DonThuocKiemDuyetRequest,
): Promise<DonThuoc> {
  const response = await axiosClient.put<DonThuoc>(
    `/duoc-si/don-thuoc/${maDonThuoc}/duyet`,
    request,
  );

  return response.data;
}

export async function tuChoiDonThuoc(
  maDonThuoc: number,
  request: DonThuocKiemDuyetRequest,
): Promise<DonThuoc> {
  const response = await axiosClient.put<DonThuoc>(
    `/duoc-si/don-thuoc/${maDonThuoc}/tu-choi`,
    request,
  );

  return response.data;
}
