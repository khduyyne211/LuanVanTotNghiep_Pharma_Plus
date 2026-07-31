import axiosClient from "../../../api/axiosClient";
import type {
  DonHangBoLoc,
  DonHangChiTiet,
  DonHangDanhSach,
  PhanTrangResponse,
  SanPhamBanTaiQuay,
  TaoDonTaiQuayRequest,
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

export const laySanPhamBanTaiQuay = async (keyword = "") => {
  const response = await axiosClient.get<SanPhamBanTaiQuay[]>(
    "/don-hang/san-pham-ban-tai-quay",
    { params: { keyword } }
  );
  return response.data;
};

export const taoDonTaiQuay = async (request: TaoDonTaiQuayRequest) => {
  const response = await axiosClient.post<DonHangChiTiet>(
    "/don-hang/tao-tai-quay",
    request
  );
  return response.data;
};
