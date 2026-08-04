import apiClient from "../../../api/axiosClient";

import type {
  DiaChiGiaoHang,
  LuuDiaChiGiaoHangRequest,
} from "../types/DiaChiGiaoHang";

export async function layDanhSachDiaChiGiaoHangApi(): Promise<
  DiaChiGiaoHang[]
> {
  const response = await apiClient.get<DiaChiGiaoHang[]>(
    "/dia-chi-giao-hang",
  );

  return response.data;
}

export async function themDiaChiGiaoHangApi(
  request: LuuDiaChiGiaoHangRequest,
): Promise<DiaChiGiaoHang> {
  const response = await apiClient.post<DiaChiGiaoHang>(
    "/dia-chi-giao-hang",
    request,
  );

  return response.data;
}

export async function capNhatDiaChiGiaoHangApi(
  maDiaChi: number,
  request: LuuDiaChiGiaoHangRequest,
): Promise<DiaChiGiaoHang> {
  const response = await apiClient.put<DiaChiGiaoHang>(
    `/dia-chi-giao-hang/${maDiaChi}`,
    request,
  );

  return response.data;
}

export async function xoaDiaChiGiaoHangApi(
  maDiaChi: number,
): Promise<void> {
  await apiClient.delete(
    `/dia-chi-giao-hang/${maDiaChi}`,
  );
}