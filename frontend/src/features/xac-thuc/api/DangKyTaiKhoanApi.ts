import apiClient from "../../../api/axiosClient";

export interface DangKyTrucTiepRequest {
  soDienThoai: string;
  hoTen: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

export async function dangKyTrucTiepApi(
  request: DangKyTrucTiepRequest,
): Promise<void> {
  await apiClient.post<void>(
    "/xac-thuc/dang-ky-truc-tiep",
    request,
  );
}