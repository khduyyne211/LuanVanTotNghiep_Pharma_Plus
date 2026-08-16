import axiosClient
  from "../../../../shared/api/axiosClient";

import type {
  CapNhatTrangThaiDonHangRequest,
  DonHangDuocSiBoLoc,
  DonHangDuocSiChiTiet,
  DonHangDuocSiDanhSach,
  PhanTrangResponse,
} from "../types/DonHangDuocSi";

export async function layDanhSachDonHangDuocSi(
  boLoc: DonHangDuocSiBoLoc,
): Promise<PhanTrangResponse<DonHangDuocSiDanhSach>> {
  const response =
    await axiosClient.get<
      PhanTrangResponse<DonHangDuocSiDanhSach>
    >(
      "/duoc-si/don-hang/phan-trang",
      {
        params: boLoc,
      },
    );

  return response.data;
}

export async function layChiTietDonHangDuocSi(
  maDonHang: number,
): Promise<DonHangDuocSiChiTiet> {
  const response =
    await axiosClient.get<DonHangDuocSiChiTiet>(
      `/duoc-si/don-hang/${maDonHang}`,
    );

  return response.data;
}

export async function tiepNhanDonHangDuocSi(
  maDonHang: number,
): Promise<DonHangDuocSiChiTiet> {
  const response =
    await axiosClient.put<DonHangDuocSiChiTiet>(
      `/duoc-si/don-hang/${maDonHang}/tiep-nhan`,
    );

  return response.data;
}

export async function capNhatTrangThaiDonHangDuocSi(
  maDonHang: number,
  request: CapNhatTrangThaiDonHangRequest,
): Promise<DonHangDuocSiChiTiet> {
  const response =
    await axiosClient.put<DonHangDuocSiChiTiet>(
      `/duoc-si/don-hang/${maDonHang}/trang-thai`,
      request,
    );

  return response.data;
}

export async function huyDonHangDuocSi(
  maDonHang: number,
): Promise<DonHangDuocSiChiTiet> {
  const response =
    await axiosClient.put<DonHangDuocSiChiTiet>(
      `/duoc-si/don-hang/${maDonHang}/huy`,
    );

  return response.data;
}
