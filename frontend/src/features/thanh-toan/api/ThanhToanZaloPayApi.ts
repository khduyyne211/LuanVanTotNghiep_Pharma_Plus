import apiClient from
  "../../../api/axiosClient";

export interface TaoThanhToanZaloPayResponse {
  maDonHang: number;
  appTransId: string;
  soTien: number;
  orderUrl: string;
  trangThaiThanhToan: string;
}

export interface TrangThaiThanhToanZaloPayResponse {
  maDonHang: number;
  trangThaiThanhToan: string;
  trangThaiDonHang: string;
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