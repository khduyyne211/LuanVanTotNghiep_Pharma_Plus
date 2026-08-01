import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { kiemTraGioHangApi } from "../api/GioHangApi";
import { useGioHangContext } from "../context/GioHangContext";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";
import type { ChiTietGioHangLocal } from "../types/GioHangLocal";
import type {
  KiemTraGioHangResponse,
  ThongTinKiemTraGioHang,
} from "../types/KiemTraGioHang";
import type { ChiTietGioHangHienThi } from "../types/GioHangHienThi";

export function useKiemTraGioHangLocal() {
  const { nguoiDungDangNhap, daDangNhap } = useXacThucContext();
  const { danhSachChiTietGioHangLocal } = useGioHangContext();

  const [ketQuaKiemTra, setKetQuaKiemTra] =
    useState<KiemTraGioHangResponse | null>(null);

  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);
  const [thongBaoLoi, setThongBaoLoi] = useState("");

  const maKhachHangDaTuDongKiemTra = useRef<number | null>(null);

  const kiemTraDanhSachGioHang = useCallback(
    async (
      danhSachChiTiet: ChiTietGioHangLocal[]
    ): Promise<KiemTraGioHangResponse | null> => {
      if (!daDangNhap || !nguoiDungDangNhap) {
        setKetQuaKiemTra(null);
        return null;
      }

      if (danhSachChiTiet.length === 0) {
        const ketQuaRong: KiemTraGioHangResponse = {
          hopLe: true,
          danhSachThongTin: [],
        };

        setKetQuaKiemTra(ketQuaRong);
        setThongBaoLoi("");
        return ketQuaRong;
      }

      try {
        setDangTaiDuLieu(true);
        setThongBaoLoi("");

        const danhSachGuiBackend = danhSachChiTiet.map((chiTiet) => ({
          maDonViSanPham: chiTiet.maDonViSanPham,
          soLuong: chiTiet.soLuong,
        }));

        const response = await kiemTraGioHangApi(danhSachGuiBackend);

        setKetQuaKiemTra(response);
        return response;
      } catch {
        setKetQuaKiemTra(null);
        setThongBaoLoi(
          "Không thể kiểm tra giá và số lượng tồn kho của giỏ hàng."
        );

        return null;
      } finally {
        setDangTaiDuLieu(false);
      }
    },
    [daDangNhap, nguoiDungDangNhap]
  );

  const kiemTraLaiGioHang = useCallback(() => {
    return kiemTraDanhSachGioHang(danhSachChiTietGioHangLocal);
  }, [kiemTraDanhSachGioHang, danhSachChiTietGioHangLocal]);

  useEffect(() => {
    const maKhachHang = nguoiDungDangNhap?.maKhachHang;

    if (!daDangNhap || maKhachHang === undefined) {
      maKhachHangDaTuDongKiemTra.current = null;
      setKetQuaKiemTra(null);
      setThongBaoLoi("");
      return;
    }

    if (danhSachChiTietGioHangLocal.length === 0) {
      maKhachHangDaTuDongKiemTra.current = null;

      setKetQuaKiemTra({
        hopLe: true,
        danhSachThongTin: [],
      });

      setThongBaoLoi("");
      return;
    }

    if (maKhachHangDaTuDongKiemTra.current === maKhachHang) return;

    maKhachHangDaTuDongKiemTra.current = maKhachHang;
    void kiemTraDanhSachGioHang(danhSachChiTietGioHangLocal);
  }, [
    daDangNhap,
    nguoiDungDangNhap,
    danhSachChiTietGioHangLocal,
    kiemTraDanhSachGioHang,
  ]);

  const thongTinTheoDonVi = useMemo(() => {
    const ketQua = new Map<number, ThongTinKiemTraGioHang>();

    ketQuaKiemTra?.danhSachThongTin.forEach((thongTin) => {
      ketQua.set(thongTin.maDonViSanPham, thongTin);
    });

    return ketQua;
  }, [ketQuaKiemTra]);

  const danhSachChiTietHienThi = useMemo<ChiTietGioHangHienThi[]>(() => {
    return danhSachChiTietGioHangLocal.map((chiTietLocal) => {
      const thongTinMoi = thongTinTheoDonVi.get(
        chiTietLocal.maDonViSanPham
      );

      const giaBanTheoDonVi =
        thongTinMoi?.giaBanTheoDonVi ?? chiTietLocal.giaBanTamThoi;

      return {
        maSanPham: chiTietLocal.maSanPham,
        maDonViSanPham: chiTietLocal.maDonViSanPham,
        soLuong: chiTietLocal.soLuong,

        tenSanPham: chiTietLocal.tenSanPham,
        hinhAnh: chiTietLocal.hinhAnh,
        tenDonViTinh: chiTietLocal.tenDonViTinh,
        danhSachDonViBan: chiTietLocal.danhSachDonViBan,

        giaBanTheoDonVi,
        thanhTien: giaBanTheoDonVi * chiTietLocal.soLuong,

        heSoQuyDoiVeDonViCoSo:
          thongTinMoi?.heSoQuyDoiVeDonViCoSo ?? null,

        tonKhaDungTheoQuyDoi:
          thongTinMoi?.tonKhaDungTheoQuyDoi ?? null,

        daCoThongTinKiemTra: thongTinMoi !== undefined,
      };
    });
  }, [danhSachChiTietGioHangLocal, thongTinTheoDonVi]);

  const tongTien = useMemo(() => {
    return danhSachChiTietHienThi.reduce(
      (tong, chiTiet) => tong + chiTiet.thanhTien,
      0
    );
  }, [danhSachChiTietHienThi]);

  return {
    danhSachChiTietHienThi,
    tongTien,
    hopLe: ketQuaKiemTra?.hopLe ?? false,
    daKiemTraThanhCong: ketQuaKiemTra !== null,
    dangTaiDuLieu,
    thongBaoLoi,
    kiemTraLaiGioHang,
    kiemTraDanhSachGioHang,
  };
}