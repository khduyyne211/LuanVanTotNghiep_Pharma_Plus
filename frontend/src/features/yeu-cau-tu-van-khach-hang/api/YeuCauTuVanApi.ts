import apiClient from "../../../api/axiosClient";
import type { PageResponse } from "../../../shared/types/PageResponse";
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
    PageResponse<YeuCauTuVanDanhSach>
  >("/yeu-cau-tu-van/cua-toi", {
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
    `/yeu-cau-tu-van/cua-toi/${maYeuCauTuVan}`
  );
};

export const layThongTinTaoYeuCauTuVanApi = () => {
  return apiClient.get<ThongTinTaoYeuCauTuVan>(
    "/yeu-cau-tu-van/thong-tin-tao-moi"
  );
};

export const taoYeuCauTuVanApi = (
  request: TaoYeuCauTuVanRequest
) => {
  return apiClient.post<YeuCauTuVanDanhSach>(
    "/yeu-cau-tu-van",
    request
  );
};