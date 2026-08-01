import apiClient from "../../../api/axiosClient";
import type {
  DangNhapRequest,
  DangNhapResponse,
} from "../types/XacThuc";

export async function dangNhapApi(
  request: DangNhapRequest,
): Promise<DangNhapResponse> {
  const response = await apiClient.post<DangNhapResponse>(
    "/xac-thuc/dang-nhap",
    request,
  );

  return response.data;
}