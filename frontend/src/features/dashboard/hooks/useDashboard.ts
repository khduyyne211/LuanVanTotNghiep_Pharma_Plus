import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { isAxiosError } from "axios";

import {
  layDoanhThuTheoKhoang,
  layLoSapHetHanDashboard,
  layTonKhoThapDashboard,
  layTongQuanDashboard,
} from "../api/dashboardApi";

import type {
  DashboardDoanhThu,
  DashboardLoSapHetHan,
  DashboardTonKhoThap,
  DashboardTongQuan,
} from "../types/Dashboard";

type ApiErrorResponse = {
  message?: string;
};

const NGUONG_TON_KHO_MAC_DINH = 10;
const SO_NGAY_CANH_BAO_HET_HAN = 30;

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
    danhSachTonKhoThap,
    setDanhSachTonKhoThap,
  ] = useState<DashboardTonKhoThap[]>(
    [],
  );

  const [
    danhSachLoSapHetHan,
    setDanhSachLoSapHetHan,
  ] = useState<DashboardLoSapHetHan[]>(
    [],
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
    dangTaiCanhBao,
    setDangTaiCanhBao,
  ] = useState(true);

  const [
    loiTongQuan,
    setLoiTongQuan,
  ] = useState("");

  const [
    loiDoanhThu,
    setLoiDoanhThu,
  ] = useState("");

  const [
    loiCanhBao,
    setLoiCanhBao,
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

  const taiCanhBao =
    useCallback(async () => {
      try {
        setDangTaiCanhBao(true);
        setLoiCanhBao("");

        const [
          tonKhoThap,
          loSapHetHan,
        ] = await Promise.all([
          layTonKhoThapDashboard(
            NGUONG_TON_KHO_MAC_DINH,
          ),
          layLoSapHetHanDashboard(
            SO_NGAY_CANH_BAO_HET_HAN,
          ),
        ]);

        setDanhSachTonKhoThap(
          tonKhoThap,
        );

        setDanhSachLoSapHetHan(
          loSapHetHan,
        );
      } catch (error) {
        console.error(
          "Không thể tải cảnh báo Dashboard:",
          error,
        );

        setDanhSachTonKhoThap([]);
        setDanhSachLoSapHetHan([]);

        setLoiCanhBao(
          layThongBaoLoi(
            error,
            "Không thể tải dữ liệu cảnh báo kho.",
          ),
        );
      } finally {
        setDangTaiCanhBao(false);
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

        setDoanhThuTheoKhoang(
          duLieu,
        );
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
    }, [
      tuNgay,
      denNgay,
    ]);

  const lamMoiDashboard =
    useCallback(async () => {
      await Promise.all([
        taiTongQuan(),
        taiCanhBao(),
      ]);
    }, [
      taiTongQuan,
      taiCanhBao,
    ]);

  useEffect(() => {
    void Promise.all([
      taiTongQuan(),
      taiCanhBao(),
    ]);
  }, [
    taiTongQuan,
    taiCanhBao,
  ]);

  return {
    tongQuan,
    doanhThuTheoKhoang,

    danhSachTonKhoThap,
    danhSachLoSapHetHan,

    tuNgay,
    denNgay,

    dangTaiTongQuan,
    dangTaiDoanhThu,
    dangTaiCanhBao,

    loiTongQuan,
    loiDoanhThu,
    loiCanhBao,

    setTuNgay,
    setDenNgay,

    taiTongQuan,
    taiCanhBao,
    lamMoiDashboard,
    xemDoanhThuTheoKhoang,

    nguongTonKhoMacDinh:
      NGUONG_TON_KHO_MAC_DINH,

    soNgayCanhBaoHetHan:
      SO_NGAY_CANH_BAO_HET_HAN,
  };
}

export default useDashboard;