import apiClient from "../../../../api/axiosClient";
import type { GioHang } from "../types/GioHang";
import type {
  ChiTietKiemTraGioHangRequest,
  KiemTraGioHangResponse,
} from "../types/KiemTraGioHang";

export const layGioHangApi = () => {
  return apiClient.get<GioHang>("/gio-hang");
};

export async function kiemTraGioHangApi(
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[]
): Promise<KiemTraGioHangResponse> {
  const response = await apiClient.post<KiemTraGioHangResponse>(
    "/gio-hang/kiem-tra",
    { danhSachChiTiet }
  );

  return response.data;
}

export async function dongBoGioHangApi(
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[]
): Promise<KiemTraGioHangResponse> {
  const response = await apiClient.post<KiemTraGioHangResponse>(
    "/gio-hang/dong-bo",
    { danhSachChiTiet }
  );

  return response.data;
}