import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { isAxiosError } from "axios";

import {
  layDoanhThuTheoKhoang,
  layTongQuanDashboard,
} from "../api/dashboardApi";

import type {
  DashboardDoanhThu,
  DashboardTongQuan,
} from "../types/Dashboard";

type ApiErrorResponse = {
  message?: string;
};

const dinhDangNgayNhap = (ngay: Date) => {
  const nam = ngay.getFullYear();

  const thang = String(
    ngay.getMonth() + 1,
  ).padStart(2, "0");

  const ngayTrongThang = String(
    ngay.getDate(),
  ).padStart(2, "0");

  return `${nam}-${thang}-${ngayTrongThang}`;
};

const taoKhoangNgayMacDinh = () => {
  const homNay = new Date();

  const dauThang = new Date(
    homNay.getFullYear(),
    homNay.getMonth(),
    1,
  );

  return {
    tuNgay: dinhDangNgayNhap(dauThang),
    denNgay: dinhDangNgayNhap(homNay),
  };
};

const layThongBaoLoi = (
  error: unknown,
  thongBaoMacDinh: string,
) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message
      ?? thongBaoMacDinh
    );
  }

  return thongBaoMacDinh;
};

function useDashboard() {
  const khoangNgayMacDinh =
    taoKhoangNgayMacDinh();

  const [
    tongQuan,
    setTongQuan,
  ] = useState<DashboardTongQuan | null>(
    null,
  );

  const [
    doanhThuTheoKhoang,
    setDoanhThuTheoKhoang,
  ] = useState<DashboardDoanhThu | null>(
    null,
  );

  const [
    tuNgay,
    setTuNgay,
  ] = useState(
    khoangNgayMacDinh.tuNgay,
  );

  const [
    denNgay,
    setDenNgay,
  ] = useState(
    khoangNgayMacDinh.denNgay,
  );

  const [
    dangTaiTongQuan,
    setDangTaiTongQuan,
  ] = useState(true);

  const [
    dangTaiDoanhThu,
    setDangTaiDoanhThu,
  ] = useState(false);

  const [
    loiTongQuan,
    setLoiTongQuan,
  ] = useState("");

  const [
    loiDoanhThu,
    setLoiDoanhThu,
  ] = useState("");

  const taiTongQuan =
    useCallback(async () => {
      try {
        setDangTaiTongQuan(true);
        setLoiTongQuan("");

        const duLieu =
          await layTongQuanDashboard();

        setTongQuan(duLieu);
      } catch (error) {
        console.error(
          "Không thể tải tổng quan Dashboard:",
          error,
        );

        setTongQuan(null);

        setLoiTongQuan(
          layThongBaoLoi(
            error,
            "Không thể tải dữ liệu tổng quan.",
          ),
        );
      } finally {
        setDangTaiTongQuan(false);
      }
    }, []);

  const xemDoanhThuTheoKhoang =
    useCallback(async () => {
      if (!tuNgay || !denNgay) {
        setLoiDoanhThu(
          "Vui lòng chọn đầy đủ khoảng ngày.",
        );

        return;
      }

      if (tuNgay > denNgay) {
        setLoiDoanhThu(
          "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
        );

        return;
      }

      try {
        setDangTaiDoanhThu(true);
        setLoiDoanhThu("");

        const duLieu =
          await layDoanhThuTheoKhoang(
            tuNgay,
            denNgay,
          );

        setDoanhThuTheoKhoang(duLieu);
      } catch (error) {
        console.error(
          "Không thể tải doanh thu theo khoảng:",
          error,
        );

        setDoanhThuTheoKhoang(null);

        setLoiDoanhThu(
          layThongBaoLoi(
            error,
            "Không thể tải doanh thu theo khoảng ngày.",
          ),
        );
      } finally {
        setDangTaiDoanhThu(false);
      }
    }, [tuNgay, denNgay]);

  useEffect(() => {
    void taiTongQuan();
  }, [taiTongQuan]);

  return {
    tongQuan,
    doanhThuTheoKhoang,

    tuNgay,
    denNgay,

    dangTaiTongQuan,
    dangTaiDoanhThu,

    loiTongQuan,
    loiDoanhThu,

    setTuNgay,
    setDenNgay,

    taiTongQuan,
    xemDoanhThuTheoKhoang,
  };
}

export default useDashboard;