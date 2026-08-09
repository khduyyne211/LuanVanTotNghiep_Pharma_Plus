import axiosClient from "../../../api/axiosClient";

import type {
  DashboardDoanhThu,
  DashboardTongQuan,
} from "../types/Dashboard";

let yeuCauTongQuanDangChay:
  Promise<DashboardTongQuan> | null = null;

export const layTongQuanDashboard = () => {
  if (!yeuCauTongQuanDangChay) {
    yeuCauTongQuanDangChay = axiosClient
      .get<DashboardTongQuan>("/dashboard/tong-quan")
      .then((response) => response.data)
      .finally(() => {
        yeuCauTongQuanDangChay = null;
      });
  }

  return yeuCauTongQuanDangChay;
};

export const layDoanhThuTheoKhoang = async (
  tuNgay: string,
  denNgay: string,
) => {
  const response = await axiosClient.get<DashboardDoanhThu>(
    "/dashboard/doanh-thu",
    {
      params: {
        tuNgay,
        denNgay,
      },
    },
  );

  return response.data;
};