import apiClient
  from "../../../../shared/api/axiosClient";

import type {
  PageResponseKhachHang,
} from "../../../../shared/types/PageResponseKhachHang";

import type {
  DonThuocKhachHang,
} from "../types/DonThuocKhachHang";

export const layDanhSachDonThuocCuaToiApi = (
  page = 0,
  size = 10
) => {
  return apiClient.get<
    PageResponseKhachHang<DonThuocKhachHang>
  >(
    "/don-thuoc/khach-hang/cua-toi",
    {
      params: {
        page,
        size,
      },
    }
  );
};

export const layChiTietDonThuocCuaToiApi = (
  maDonThuoc: number
) => {
  return apiClient.get<DonThuocKhachHang>(
    `/don-thuoc/khach-hang/cua-toi/${maDonThuoc}`
  );
};

export const guiDonThuocApi = (
  anhDonThuoc: File
) => {
  const formData =
    new FormData();

  formData.append(
    "anhDonThuoc",
    anhDonThuoc
  );

  /*
   * Không tự set Content-Type.
   *
   * Trình duyệt/Axios sẽ tự tạo:
   * multipart/form-data; boundary=...
   */
  return apiClient.post<DonThuocKhachHang>(
    "/don-thuoc/khach-hang",
    formData
  );
};