import apiClient from "../../../../shared/api/axiosClient";

export interface DangKyRequest {
  soDienThoai: string;
  hoTen: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

export async function dangKyApi(
  request: DangKyRequest,
): Promise<void> {
  await apiClient.post<void>(
    "/xac-thuc/dang-ky",
    request,
  );
}