import axiosClient from "../../../../shared/api/axiosClient";
import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";

import type { DonHangDuocSiChiTiet } from "../../don-hang/types/DonHangDuocSi";
import type {
  KhachHangDuocSi,
  SanPhamDuocSi,
  TaoDonTaiQuayRequest,
} from "../types/TaoDonTaiQuay";

export async function layDanhSachKhachHangDuocSi(
  page: number,
  size: number,
  keyword?: string,
): Promise<PhanTrangResponse<KhachHangDuocSi>> {
  const response = await axiosClient.get<PhanTrangResponse<KhachHangDuocSi>>(
    "/duoc-si/khach-hang/phan-trang",
    {
      params: {
        page,
        size,
        keyword: keyword || undefined,
      },
    },
  );

  return response.data;
}

export async function layDanhSachSanPhamTaiQuay(
  page: number,
  size: number,
  keyword?: string,
): Promise<PhanTrangResponse<SanPhamDuocSi>> {
  const response = await axiosClient.get<PhanTrangResponse<SanPhamDuocSi>>(
    "/duoc-si/san-pham/phan-trang",
    {
      params: {
        page,
        size,
        keyword: keyword || undefined,
      },
    },
  );

  return response.data;
}

export async function taoDonTaiQuayDuocSi(
  request: TaoDonTaiQuayRequest,
): Promise<DonHangDuocSiChiTiet> {
  const response = await axiosClient.post<DonHangDuocSiChiTiet>(
    "/duoc-si/don-hang/tai-quay",
    request,
  );

  return response.data;
}
