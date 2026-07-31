import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { dangNhapApi } from "../api/XacThucApi";
import HopThoaiDangNhap from "../components/HopThoaiDangNhap";
import type {
  DangNhapRequest,
  DangNhapResponse,
  NguoiDungDangNhap,
} from "../types/XacThuc";

import "../styles/XacThuc.css";

interface MoHopThoaiDangNhapOptions {
  soDienThoaiMacDinh?: string;
}

interface XacThucContextValue {
  nguoiDungDangNhap: NguoiDungDangNhap | null;
  daDangNhap: boolean;
  dangNhap: (request: DangNhapRequest) => Promise<void>;
  dangXuat: () => void;
  moHopThoaiDangNhap: (
    options?: MoHopThoaiDangNhapOptions,
  ) => void;
  dongHopThoaiDangNhap: () => void;
}

interface XacThucProviderProps {
  children: ReactNode;
}

const XacThucContext =
  createContext<XacThucContextValue | undefined>(
    undefined,
  );

function layNguoiDungDaLuu(): NguoiDungDangNhap | null {
  const accessToken = localStorage.getItem(
    "pharma_access_token",
  );

  const nguoiDungJson = localStorage.getItem(
    "pharma_nguoi_dung",
  );

  if (!accessToken || !nguoiDungJson) {
    return null;
  }

  try {
    return JSON.parse(
      nguoiDungJson,
    ) as NguoiDungDangNhap;
  } catch {
    localStorage.removeItem(
      "pharma_access_token",
    );

    localStorage.removeItem(
      "pharma_nguoi_dung",
    );

    return null;
  }
}

function chuyenSangNguoiDungDangNhap(
  response: DangNhapResponse,
): NguoiDungDangNhap {
  return {
    maTaiKhoan: response.maTaiKhoan,
    maKhachHang: response.maKhachHang,
    hoTen: response.hoTen,
    soDienThoai: response.soDienThoai,
    vaiTro: response.vaiTro,
  };
}

export function XacThucProvider({
  children,
}: XacThucProviderProps) {
  const [
    nguoiDungDangNhap,
    setNguoiDungDangNhap,
  ] = useState<NguoiDungDangNhap | null>(
    layNguoiDungDaLuu,
  );

  const [
    dangHienHopThoaiDangNhap,
    setDangHienHopThoaiDangNhap,
  ] = useState(false);

  const [
    soDienThoaiMacDinh,
    setSoDienThoaiMacDinh,
  ] = useState("");

  const daDangNhap =
    nguoiDungDangNhap !== null;

  const xoaDuLieuMoHopThoai = () => {
    setSoDienThoaiMacDinh("");
  };

  const dangNhap = async (
    request: DangNhapRequest,
  ) => {
    const duLieuDangNhap =
      await dangNhapApi(request);

    const nguoiDungMoi =
      chuyenSangNguoiDungDangNhap(
        duLieuDangNhap,
      );

    localStorage.setItem(
      "pharma_access_token",
      duLieuDangNhap.accessToken,
    );

    localStorage.setItem(
      "pharma_nguoi_dung",
      JSON.stringify(nguoiDungMoi),
    );

    setNguoiDungDangNhap(
      nguoiDungMoi,
    );

    setDangHienHopThoaiDangNhap(
      false,
    );

    xoaDuLieuMoHopThoai();
  };

  const dangXuat = () => {
    localStorage.removeItem(
      "pharma_access_token",
    );

    localStorage.removeItem(
      "pharma_nguoi_dung",
    );

    setNguoiDungDangNhap(null);
    setDangHienHopThoaiDangNhap(false);
    xoaDuLieuMoHopThoai();
  };

  const moHopThoaiDangNhap = (
    options?: MoHopThoaiDangNhapOptions,
  ) => {
    setSoDienThoaiMacDinh(
      options?.soDienThoaiMacDinh ?? "",
    );

    setDangHienHopThoaiDangNhap(
      true,
    );
  };

  const dongHopThoaiDangNhap = () => {
    setDangHienHopThoaiDangNhap(
      false,
    );

    xoaDuLieuMoHopThoai();
  };

  useEffect(() => {
    const xuLyTokenKhongHopLe = () => {
      setNguoiDungDangNhap(null);
      setSoDienThoaiMacDinh("");
      setDangHienHopThoaiDangNhap(true);
    };

    window.addEventListener(
      "pharma:dang-xuat",
      xuLyTokenKhongHopLe,
    );

    return () => {
      window.removeEventListener(
        "pharma:dang-xuat",
        xuLyTokenKhongHopLe,
      );
    };
  }, []);

  return (
    <XacThucContext.Provider
      value={{
        nguoiDungDangNhap,
        daDangNhap,
        dangNhap,
        dangXuat,
        moHopThoaiDangNhap,
        dongHopThoaiDangNhap,
      }}
    >
      {children}

      <HopThoaiDangNhap
        dangHien={dangHienHopThoaiDangNhap}
        dongHopThoai={dongHopThoaiDangNhap}
        dangNhap={dangNhap}
        soDienThoaiMacDinh={soDienThoaiMacDinh}
      />
    </XacThucContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useXacThucContext() {
  const context = useContext(
    XacThucContext,
  );

  if (!context) {
    throw new Error(
      "useXacThucContext phải được dùng trong XacThucProvider",
    );
  }

  return context;
}