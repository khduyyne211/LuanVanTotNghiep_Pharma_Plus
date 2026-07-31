import apiClient from "../../../api/axiosClient";
import type {
  DonHangDanhSach,
  DonHangResponse,
  TaoDonHangRequest,
} from "../types/DonHang";

export async function layDanhSachDonHangApi(): Promise<DonHangDanhSach[]> {
  const response = await apiClient.get<DonHangDanhSach[]>("/don-hang");
  return response.data;
}

export async function taoDonHangApi(
  request: TaoDonHangRequest,
): Promise<DonHangResponse> {
  const response = await apiClient.post<DonHangResponse>("/don-hang", request);
  return response.data;
}

export async function layChiTietDonHangApi(
  maDonHang: number,
): Promise<DonHangResponse> {
  const response = await apiClient.get<DonHangResponse>(
    `/don-hang/${maDonHang}`,
  );

  return response.data;
}