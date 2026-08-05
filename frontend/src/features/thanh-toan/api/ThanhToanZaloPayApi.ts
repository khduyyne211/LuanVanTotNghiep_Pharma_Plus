import apiClient from
  "../../../api/axiosClient";

import type {
  TrangThaiDonHang,
  TrangThaiThanhToan,
} from "../../don-hang-khach-hang/types/DonHang";

export interface TaoThanhToanZaloPayResponse {
  maDonHang: number;
  appTransId: string;
  soTien: number;
  orderUrl: string;
  thoiGianHieuLucGiay: number;
  trangThaiThanhToan: TrangThaiThanhToan;
}

export interface TrangThaiThanhToanZaloPayResponse {
  maDonHang: number;
  trangThaiThanhToan: TrangThaiThanhToan;
  trangThaiDonHang: TrangThaiDonHang;
}

export async function taoThanhToanZaloPayApi(
  maDonHang: number
): Promise<TaoThanhToanZaloPayResponse> {
  const response =
    await apiClient.post<TaoThanhToanZaloPayResponse>(
      `/thanh-toan/zalopay/don-hang/${maDonHang}/tao`
    );

  return response.data;
}

export async function layTrangThaiThanhToanZaloPayApi(
  maDonHang: number
): Promise<TrangThaiThanhToanZaloPayResponse> {
  const response =
    await apiClient.get<TrangThaiThanhToanZaloPayResponse>(
      `/thanh-toan/zalopay/don-hang/${maDonHang}/trang-thai`
    );

  return response.data;
}