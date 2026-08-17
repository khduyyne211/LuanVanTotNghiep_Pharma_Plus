import apiClient from "../../../../shared/api/axiosClient";

import type { ChiTietKiemTraGioHangRequest } from "../../gio-hang/types/KiemTraGioHang";
import type {
  ApDungVoucherResponse,
  VoucherKhachHang,
} from "../types/VoucherDonHang";

export async function layDanhSachVoucherKhachHangApi(
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[],
): Promise<VoucherKhachHang[]> {
  const response = await apiClient.post<VoucherKhachHang[]>(
    "/voucher-don-hang/khach-hang/danh-sach",
    {
      danhSachChiTiet,
    },
  );

  return response.data;
}

export async function apDungVoucherKhachHangApi(
  maGiamGia: string,
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[],
): Promise<ApDungVoucherResponse> {
  const response = await apiClient.post<ApDungVoucherResponse>(
    "/voucher-don-hang/khach-hang/ap-dung",
    {
      maGiamGia,
      danhSachChiTiet,
    },
  );

  return response.data;
}


export async function apDungVoucherTheoMaKhachHangApi(
  maVoucher: number,
  danhSachChiTiet: ChiTietKiemTraGioHangRequest[],
): Promise<ApDungVoucherResponse> {
  const response =
    await apiClient.post<ApDungVoucherResponse>(
      "/voucher-don-hang/khach-hang/ap-dung-theo-ma-voucher",
      {
        maVoucher,
        danhSachChiTiet,
      },
    );

  return response.data;
}