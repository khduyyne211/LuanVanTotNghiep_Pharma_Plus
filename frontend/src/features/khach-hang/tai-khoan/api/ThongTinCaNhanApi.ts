import apiClient from "../../../../api/axiosClient";

import type {
  CapNhatThongTinCaNhanRequest,
  ThongTinCaNhan,
} from "../types/ThongTinCaNhan";

export async function layThongTinCaNhanApi(): Promise<ThongTinCaNhan> {
  const response = await apiClient.get<ThongTinCaNhan>(
    "/thong-tin-ca-nhan",
  );

  return response.data;
}

export async function capNhatThongTinCaNhanApi(
  request: CapNhatThongTinCaNhanRequest,
): Promise<ThongTinCaNhan> {
  const response = await apiClient.put<ThongTinCaNhan>(
    "/thong-tin-ca-nhan",
    request,
  );

  return response.data;
}