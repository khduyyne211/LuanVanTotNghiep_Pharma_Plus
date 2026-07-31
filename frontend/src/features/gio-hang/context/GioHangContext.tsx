import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ChiTietGioHangLocal } from "../types/GioHangLocal";
import {
  layGioHangLocal,
  luuGioHangLocal,
  xoaGioHangLocal,
} from "../utils/gioHangLocalStorage";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";

interface GioHangContextValue {
  danhSachChiTietGioHangLocal: ChiTietGioHangLocal[];
  soDongChiTietGioHang: number;
  themSanPhamLocal: (chiTietMoi: ChiTietGioHangLocal) => void;
  capNhatSoLuongLocal: (maDonViSanPham: number, soLuongMoi: number) => void;
  xoaSanPhamLocal: (maDonViSanPham: number) => void;
  thayTheDanhSachGioHangLocal: (danhSachMoi: ChiTietGioHangLocal[]) => void;
  xoaToanBoGioHangLocal: () => void;
}

const GioHangContext = createContext<GioHangContextValue | undefined>(undefined);

interface GioHangProviderProps {
  children: ReactNode;
}

export function GioHangProvider({ children }: GioHangProviderProps) {
  const { nguoiDungDangNhap, daDangNhap } = useXacThucContext();
  const maKhachHang = nguoiDungDangNhap?.maKhachHang;

  const [danhSachChiTietGioHangLocal, setDanhSachChiTietGioHangLocal] =
    useState<ChiTietGioHangLocal[]>([]);

  const [daTaiGioHangLocal, setDaTaiGioHangLocal] = useState(false);

  const soDongChiTietGioHang = danhSachChiTietGioHangLocal.length;

  useEffect(() => {
    setDaTaiGioHangLocal(false);

    if (!daDangNhap || maKhachHang === undefined) {
      setDanhSachChiTietGioHangLocal([]);
      return;
    }

    setDanhSachChiTietGioHangLocal(layGioHangLocal(maKhachHang));
    setDaTaiGioHangLocal(true);
  }, [daDangNhap, maKhachHang]);

  useEffect(() => {
    if (!daTaiGioHangLocal || maKhachHang === undefined) return;

    if (danhSachChiTietGioHangLocal.length === 0) {
      xoaGioHangLocal(maKhachHang);
      return;
    }

    luuGioHangLocal(maKhachHang, danhSachChiTietGioHangLocal);
  }, [daTaiGioHangLocal, danhSachChiTietGioHangLocal, maKhachHang]);

  const themSanPhamLocal = (chiTietMoi: ChiTietGioHangLocal) => {
    if (maKhachHang === undefined) return;

    setDanhSachChiTietGioHangLocal((danhSachCu) => {
      const chiTietDaCo = danhSachCu.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham === chiTietMoi.maDonViSanPham
      );

      if (!chiTietDaCo) {
        return [
          ...danhSachCu,
          {
            ...chiTietMoi,
            soLuong: Math.max(1, Math.floor(chiTietMoi.soLuong)),
          },
        ];
      }

      return danhSachCu.map((chiTiet) =>
        chiTiet.maDonViSanPham === chiTietMoi.maDonViSanPham
          ? {
              ...chiTiet,
              ...chiTietMoi,
              soLuong:
                chiTiet.soLuong +
                Math.max(1, Math.floor(chiTietMoi.soLuong)),
            }
          : chiTiet
      );
    });
  };

  const capNhatSoLuongLocal = (
    maDonViSanPham: number,
    soLuongMoi: number
  ) => {
    if (!Number.isFinite(soLuongMoi)) return;

    setDanhSachChiTietGioHangLocal((danhSachCu) =>
      danhSachCu.map((chiTiet) =>
        chiTiet.maDonViSanPham === maDonViSanPham
          ? {
              ...chiTiet,
              soLuong: Math.max(1, Math.floor(soLuongMoi)),
            }
          : chiTiet
      )
    );
  };

  const xoaSanPhamLocal = (maDonViSanPham: number) => {
    setDanhSachChiTietGioHangLocal((danhSachCu) =>
      danhSachCu.filter(
        (chiTiet) => chiTiet.maDonViSanPham !== maDonViSanPham
      )
    );
  };

  const thayTheDanhSachGioHangLocal = (
    danhSachMoi: ChiTietGioHangLocal[]
  ) => {
    setDanhSachChiTietGioHangLocal(
      danhSachMoi
        .filter((chiTiet) => chiTiet.soLuong > 0)
        .map((chiTiet) => ({
          ...chiTiet,
          soLuong: Math.max(1, Math.floor(chiTiet.soLuong)),
        }))
    );
  };

  const xoaToanBoGioHangLocal = () => {
    if (maKhachHang !== undefined) {
      xoaGioHangLocal(maKhachHang);
    }

    setDanhSachChiTietGioHangLocal([]);
  };

  return (
    <GioHangContext.Provider
      value={{
        danhSachChiTietGioHangLocal,
        soDongChiTietGioHang,
        themSanPhamLocal,
        capNhatSoLuongLocal,
        xoaSanPhamLocal,
        thayTheDanhSachGioHangLocal,
        xoaToanBoGioHangLocal,
      }}
    >
      {children}

    </GioHangContext.Provider>
  );
}

export function useGioHangContext() {
  const context = useContext(GioHangContext);

  if (!context) {
    throw new Error(
      "useGioHangContext phải được dùng trong GioHangProvider"
    );
  }

  return context;
}