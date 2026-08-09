import { useCallback, useEffect, useState } from "react";

import { isAxiosError } from "axios";

import {
  layDoanhThu7NgayDashboard,
  layDoanhThuTheoKhoang,
  layLoSapHetHanDashboard,
  layTonKhoThapDashboard,
  layTongQuanDashboard,
  layTrangThaiDonHangDashboard,
} from "../api/dashboardApi";

import type {
  DashboardDoanhThu,
  DashboardDoanhThuTheoNgay,
  DashboardLoSapHetHan,
  DashboardTonKhoThap,
  DashboardTongQuan,
  DashboardTrangThaiDonHang,
} from "../types/Dashboard";

type ApiErrorResponse = {
  message?: string;
};

const NGUONG_TON_KHO_MAC_DINH = 10;
const SO_NGAY_CANH_BAO_HET_HAN = 30;

const dinhDangNgayNhap = (ngay: Date) => {
  const nam = ngay.getFullYear();

  const thang = String(ngay.getMonth() + 1).padStart(2, "0");

  const ngayTrongThang = String(ngay.getDate()).padStart(2, "0");

  return `${nam}-${thang}-${ngayTrongThang}`;
};

const taoKhoangNgayMacDinh = () => {
  const homNay = new Date();

  const dauThang = new Date(homNay.getFullYear(), homNay.getMonth(), 1);

  return {
    tuNgay: dinhDangNgayNhap(dauThang),
    denNgay: dinhDangNgayNhap(homNay),
  };
};

const layThongBaoLoi = (error: unknown, thongBaoMacDinh: string) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? thongBaoMacDinh;
  }

  return thongBaoMacDinh;
};

function useDashboard() {
  const khoangNgayMacDinh = taoKhoangNgayMacDinh();

  const [tongQuan, setTongQuan] = useState<DashboardTongQuan | null>(null);

  const [doanhThuTheoKhoang, setDoanhThuTheoKhoang] =
    useState<DashboardDoanhThu | null>(null);

  const [doanhThu7Ngay, setDoanhThu7Ngay] = useState<
    DashboardDoanhThuTheoNgay[]
  >([]);

  const [thongKeTrangThaiDonHang, setThongKeTrangThaiDonHang] = useState<
    DashboardTrangThaiDonHang[]
  >([]);

  const [danhSachTonKhoThap, setDanhSachTonKhoThap] = useState<
    DashboardTonKhoThap[]
  >([]);

  const [danhSachLoSapHetHan, setDanhSachLoSapHetHan] = useState<
    DashboardLoSapHetHan[]
  >([]);

  const [tuNgay, setTuNgay] = useState(khoangNgayMacDinh.tuNgay);

  const [denNgay, setDenNgay] = useState(khoangNgayMacDinh.denNgay);

  const [dangTaiTongQuan, setDangTaiTongQuan] = useState(true);

  const [dangTaiDoanhThu, setDangTaiDoanhThu] = useState(false);

  const [dangTaiBieuDo, setDangTaiBieuDo] = useState(true);

  const [dangTaiCanhBao, setDangTaiCanhBao] = useState(true);

  const [loiTongQuan, setLoiTongQuan] = useState("");

  const [loiDoanhThu, setLoiDoanhThu] = useState("");

  const [loiBieuDo, setLoiBieuDo] = useState("");

  const [loiCanhBao, setLoiCanhBao] = useState("");

  const taiTongQuan = useCallback(async () => {
    try {
      setDangTaiTongQuan(true);
      setLoiTongQuan("");

      const duLieu = await layTongQuanDashboard();

      setTongQuan(duLieu);
    } catch (error) {
      console.error("Không thể tải tổng quan Dashboard:", error);

      setTongQuan(null);

      setLoiTongQuan(layThongBaoLoi(error, "Không thể tải dữ liệu tổng quan."));
    } finally {
      setDangTaiTongQuan(false);
    }
  }, []);

  const taiBieuDo = useCallback(async () => {
    try {
      setDangTaiBieuDo(true);
      setLoiBieuDo("");

      const [duLieuDoanhThu, duLieuTrangThai] = await Promise.all([
        layDoanhThu7NgayDashboard(),
        layTrangThaiDonHangDashboard(),
      ]);

      setDoanhThu7Ngay(duLieuDoanhThu);

      setThongKeTrangThaiDonHang(duLieuTrangThai);
    } catch (error) {
      console.error("Không thể tải dữ liệu biểu đồ Dashboard:", error);

      setDoanhThu7Ngay([]);
      setThongKeTrangThaiDonHang([]);

      setLoiBieuDo(layThongBaoLoi(error, "Không thể tải dữ liệu biểu đồ."));
    } finally {
      setDangTaiBieuDo(false);
    }
  }, []);

  const taiCanhBao = useCallback(async () => {
    try {
      setDangTaiCanhBao(true);
      setLoiCanhBao("");

      const [tonKhoThap, loSapHetHan] = await Promise.all([
        layTonKhoThapDashboard(NGUONG_TON_KHO_MAC_DINH),
        layLoSapHetHanDashboard(SO_NGAY_CANH_BAO_HET_HAN),
      ]);

      setDanhSachTonKhoThap(tonKhoThap);

      setDanhSachLoSapHetHan(loSapHetHan);
    } catch (error) {
      console.error("Không thể tải cảnh báo Dashboard:", error);

      setDanhSachTonKhoThap([]);
      setDanhSachLoSapHetHan([]);

      setLoiCanhBao(
        layThongBaoLoi(error, "Không thể tải dữ liệu cảnh báo kho."),
      );
    } finally {
      setDangTaiCanhBao(false);
    }
  }, []);

  const xemDoanhThuTheoKhoang = useCallback(async () => {
    if (!tuNgay || !denNgay) {
      setLoiDoanhThu("Vui lòng chọn đầy đủ khoảng ngày.");

      return;
    }

    if (tuNgay > denNgay) {
      setLoiDoanhThu("Ngày bắt đầu không được lớn hơn ngày kết thúc.");

      return;
    }

    try {
      setDangTaiDoanhThu(true);
      setLoiDoanhThu("");

      const duLieu = await layDoanhThuTheoKhoang(tuNgay, denNgay);

      setDoanhThuTheoKhoang(duLieu);
    } catch (error) {
      console.error("Không thể tải doanh thu theo khoảng:", error);

      setDoanhThuTheoKhoang(null);

      setLoiDoanhThu(
        layThongBaoLoi(error, "Không thể tải doanh thu theo khoảng ngày."),
      );
    } finally {
      setDangTaiDoanhThu(false);
    }
  }, [tuNgay, denNgay]);

  const lamMoiDashboard = useCallback(async () => {
    await Promise.all([taiTongQuan(), taiBieuDo(), taiCanhBao()]);
  }, [taiTongQuan, taiBieuDo, taiCanhBao]);

  useEffect(() => {
    void Promise.all([taiTongQuan(), taiBieuDo(), taiCanhBao()]);
  }, [taiTongQuan, taiBieuDo, taiCanhBao]);

  return {
    tongQuan,
    doanhThuTheoKhoang,
    doanhThu7Ngay,
    thongKeTrangThaiDonHang,

    danhSachTonKhoThap,
    danhSachLoSapHetHan,

    tuNgay,
    denNgay,

    dangTaiTongQuan,
    dangTaiDoanhThu,
    dangTaiBieuDo,
    dangTaiCanhBao,

    loiTongQuan,
    loiDoanhThu,
    loiBieuDo,
    loiCanhBao,

    setTuNgay,
    setDenNgay,

    taiTongQuan,
    taiBieuDo,
    taiCanhBao,
    lamMoiDashboard,
    xemDoanhThuTheoKhoang,

    nguongTonKhoMacDinh: NGUONG_TON_KHO_MAC_DINH,

    soNgayCanhBaoHetHan: SO_NGAY_CANH_BAO_HET_HAN,
  };
}

export default useDashboard;
