import apiClient from "../../../api/axiosClient";
import type { DiaChiGiaoHang } from "../types/DiaChiGiaoHang";

export async function layDanhSachDiaChiGiaoHangApi(): Promise<DiaChiGiaoHang[]> {
  const response = await apiClient.get<DiaChiGiaoHang[]>("/dia-chi-giao-hang");
  return response.data;
}