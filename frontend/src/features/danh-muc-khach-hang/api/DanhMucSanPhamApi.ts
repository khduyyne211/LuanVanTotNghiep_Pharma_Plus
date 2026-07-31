import apiClient from "../../../api/axiosClient";
import type { DanhMucNoiBat } from "../types/DanhMucNoiBat";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";

export async function layDanhMucMenuApi() {
  const response = await apiClient.get<DanhMucSanPham[]>("/danh-muc-san-pham/menu");
  return response.data;
}

export async function layDanhMucNoiBatApi(gioiHan = 12) {
  const response = await apiClient.get<DanhMucNoiBat[]>("/danh-muc-san-pham/noi-bat", {
    params: { gioiHan },
  });

  return response.data;
}