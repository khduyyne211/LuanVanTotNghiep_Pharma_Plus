import axiosClient from "../../../../shared/api/axiosClient";
import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";

import type { DonHangDuocSiChiTiet } from "../../don-hang/types/DonHangDuocSi";

import type {
  SanPhamDuocSi,
  TaoDonHangDuocSiRequest,
} from "../types/LenDonDuocSi";

export async function layDanhSachSanPhamDuocSi(
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

export async function taoDonHangTuYeuCauTuVanDuocSi(
  maYeuCauTuVan: number,
  request: TaoDonHangDuocSiRequest,
): Promise<DonHangDuocSiChiTiet> {
  const response = await axiosClient.post<DonHangDuocSiChiTiet>(
    `/duoc-si/don-hang/tu-yeu-cau-tu-van/${maYeuCauTuVan}`,
    request,
  );

  return response.data;
}

export async function taoDonHangTuDonThuocDuocSi(
  maDonThuoc: number,
  request: TaoDonHangDuocSiRequest,
): Promise<DonHangDuocSiChiTiet> {
  const response = await axiosClient.post<DonHangDuocSiChiTiet>(
    `/duoc-si/don-hang/tu-don-thuoc/${maDonThuoc}`,
    request,
  );

  return response.data;
}
