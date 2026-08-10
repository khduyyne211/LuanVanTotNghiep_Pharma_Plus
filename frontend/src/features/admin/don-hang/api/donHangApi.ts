import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";
import axiosClient from "../../../../shared/api/axiosClient";
import type {
  DonHangBoLoc,
  DonHangChiTiet,
  DonHangDanhSach,
} from "../types/DonHang";

export const layDanhSachDonHang = async (boLoc: DonHangBoLoc) => {
  const response = await axiosClient.get<PhanTrangResponse<DonHangDanhSach>>(
    "/don-hang/phan-trang",
    {
      params: {
        page: boLoc.page,
        size: boLoc.size,
        keyword: boLoc.keyword || undefined,
        trangThaiDonHang: boLoc.trangThaiDonHang || undefined,
        trangThaiThanhToan: boLoc.trangThaiThanhToan || undefined,
        trangThaiKiemDuyet: boLoc.trangThaiKiemDuyet || undefined,
      },
    }
  );

  return response.data;
};

export const layChiTietDonHang = async (maDonHang: number) => {
  const response = await axiosClient.get<DonHangChiTiet>(
    `/don-hang/${maDonHang}`
  );
  return response.data;
};
