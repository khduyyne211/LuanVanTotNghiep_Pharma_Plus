import axiosClient from "../../../../api/axiosClient";

import type {
  DashboardDoanhThu,
  DashboardDoanhThuTheoNgay,
  DashboardLoSapHetHan,
  DashboardTonKhoThap,
  DashboardTongQuan,
  DashboardTrangThaiDonHang,
} from "../types/Dashboard";

let yeuCauTongQuanDangChay: Promise<DashboardTongQuan> | null = null;

let yeuCauDoanhThu7NgayDangChay: Promise<DashboardDoanhThuTheoNgay[]> | null =
  null;

let yeuCauTrangThaiDonHangDangChay: Promise<
  DashboardTrangThaiDonHang[]
> | null = null;

let yeuCauTonKhoThapDangChay: Promise<DashboardTonKhoThap[]> | null = null;

let yeuCauLoSapHetHanDangChay: Promise<DashboardLoSapHetHan[]> | null = null;

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

export const layDoanhThu7NgayDashboard = () => {
  if (!yeuCauDoanhThu7NgayDangChay) {
    yeuCauDoanhThu7NgayDangChay = axiosClient
      .get<DashboardDoanhThuTheoNgay[]>("/dashboard/doanh-thu-7-ngay")
      .then((response) => response.data)
      .finally(() => {
        yeuCauDoanhThu7NgayDangChay = null;
      });
  }

  return yeuCauDoanhThu7NgayDangChay;
};

export const layTrangThaiDonHangDashboard = () => {
  if (!yeuCauTrangThaiDonHangDangChay) {
    yeuCauTrangThaiDonHangDangChay = axiosClient
      .get<DashboardTrangThaiDonHang[]>("/dashboard/trang-thai-don-hang")
      .then((response) => response.data)
      .finally(() => {
        yeuCauTrangThaiDonHangDangChay = null;
      });
  }

  return yeuCauTrangThaiDonHangDangChay;
};

export const layTonKhoThapDashboard = (nguongTon = 10) => {
  if (!yeuCauTonKhoThapDangChay) {
    yeuCauTonKhoThapDangChay = axiosClient
      .get<DashboardTonKhoThap[]>("/dashboard/ton-kho-thap", {
        params: {
          nguongTon,
        },
      })
      .then((response) => response.data)
      .finally(() => {
        yeuCauTonKhoThapDangChay = null;
      });
  }

  return yeuCauTonKhoThapDangChay;
};

export const layLoSapHetHanDashboard = (soNgay = 30) => {
  if (!yeuCauLoSapHetHanDangChay) {
    yeuCauLoSapHetHanDangChay = axiosClient
      .get<DashboardLoSapHetHan[]>("/dashboard/lo-sap-het-han", {
        params: {
          soNgay,
        },
      })
      .then((response) => response.data)
      .finally(() => {
        yeuCauLoSapHetHanDangChay = null;
      });
  }

  return yeuCauLoSapHetHanDangChay;
};
