import apiClient from "../../../../shared/api/axiosClient";
import type { PageResponseKhachHang } from "../../../../shared/types/PageResponseKhachHang";
import type { SanPham } from "../types/SanPham";
import type { SanPhamChiTiet } from "../types/SanPhamChiTiet";
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

export const layDanhSachSanPhamApi = (
  params: LayDanhSachSanPhamParams
) => {
  return apiClient.get<
    PageResponseKhachHang<SanPham>
  >(
    "/san-pham/khach-hang",
    {
      params,
    }
  );
};

export const layChiTietSanPhamKhachHangApi = (
  maSanPham: number
) => {
  return apiClient.get<SanPhamChiTiet>(
    `/san-pham/khach-hang/${maSanPham}`
  );
};

export async function laySanPhamBanChayApi(
  gioiHan = 12
): Promise<SanPhamBanChay[]> {
  const response =
    await apiClient.get<SanPhamBanChay[]>(
      "/san-pham/ban-chay",
      {
        params: {
          gioiHan,
        },
      }
    );

  return response.data;
}