import apiClient from "../../../../shared/api/axiosClient";
import type { PageResponseKhachHang } from "../../../../shared/types/PageResponseKhachHang";
import type {
  TaoYeuCauTuVanRequest,
  ThongTinTaoYeuCauTuVan,
  YeuCauTuVanChiTiet,
  YeuCauTuVanDanhSach,
} from "../types/YeuCauTuVan";

export const layDanhSachYeuCauTuVanApi = (
  page = 0,
  size = 10
) => {
  return apiClient.get<
    PageResponseKhachHang<YeuCauTuVanDanhSach>
  >("/yeu-cau-tu-van/khach-hang/cua-toi", {
    params: {
      page,
      size,
    },
  });
};

export const layChiTietYeuCauTuVanApi = (
  maYeuCauTuVan: number
) => {
  return apiClient.get<YeuCauTuVanChiTiet>(
    `/yeu-cau-tu-van/khach-hang/cua-toi/${maYeuCauTuVan}`
  );
};

export const layThongTinTaoYeuCauTuVanApi = () => {
  return apiClient.get<ThongTinTaoYeuCauTuVan>(
    "/yeu-cau-tu-van/khach-hang/thong-tin-tao-moi"
  );
};

export const taoYeuCauTuVanApi = (
  request: TaoYeuCauTuVanRequest
) => {
  return apiClient.post<YeuCauTuVanDanhSach>(
    "/yeu-cau-tu-van/khach-hang",
    request
  );
};