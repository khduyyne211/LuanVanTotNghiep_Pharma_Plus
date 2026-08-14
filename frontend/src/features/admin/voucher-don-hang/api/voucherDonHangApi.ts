import axiosClient
  from "../../../../shared/api/axiosClient";

import type {
  VoucherDonHang,
  VoucherDonHangRequest,
} from "../types/VoucherDonHang";

export const layDanhSachVoucherDonHang =
  async (): Promise<VoucherDonHang[]> => {
    const response =
      await axiosClient.get<VoucherDonHang[]>(
        "/voucher-don-hang",
      );

    return response.data;
  };

export const themVoucherDonHang =
  async (
    request: VoucherDonHangRequest,
  ): Promise<VoucherDonHang> => {
    const response =
      await axiosClient.post<VoucherDonHang>(
        "/voucher-don-hang",
        request,
      );

    return response.data;
  };

export const capNhatVoucherDonHang =
  async (
    maVoucher: number,
    request: VoucherDonHangRequest,
  ): Promise<VoucherDonHang> => {
    const response =
      await axiosClient.put<VoucherDonHang>(
        `/voucher-don-hang/${maVoucher}`,
        request,
      );

    return response.data;
  };

export const doiTrangThaiVoucherDonHang =
  async (
    maVoucher: number,
  ): Promise<VoucherDonHang> => {
    const response =
      await axiosClient.put<VoucherDonHang>(
        `/voucher-don-hang/${maVoucher}/doi-trang-thai`,
      );

    return response.data;
  };