import apiClient from "../../../api/axiosClient";
import type { PageResponse } from "../../../shared/types/PageResponse";
import type { SanPham } from "../types/SanPham";
import type { SanPhamBanChay } from "../types/SanPhamBanChay";

export interface LayDanhSachSanPhamParams {
  tuKhoa?: string;
  sapXep?: string;
  giaTu?: number;
  giaDen?: number;
  maNhaSanXuat?: number;
  maDanhMuc?: number;
  page?: number;
  size?: number;
}

export const layDanhSachSanPhamApi = (params: LayDanhSachSanPhamParams) => {
  return apiClient.get<PageResponse<SanPham>>("/san-pham/khach-hang", { params });
};

export async function laySanPhamBanChayApi(gioiHan = 12): Promise<SanPhamBanChay[]> {
  const response = await apiClient.get<SanPhamBanChay[]>("/san-pham/ban-chay", {
    params: { gioiHan },
  });

  return response.data;
}