import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

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
  duongDanSauDangNhap?: string;
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
    const nguoiDungDaLuu = JSON.parse(
      nguoiDungJson,
    ) as Partial<NguoiDungDangNhap>;

    if (
      nguoiDungDaLuu.maTaiKhoan == null ||
      !nguoiDungDaLuu.vaiTro
    ) {
      throw new Error(
        "Dữ liệu người dùng đã lưu không hợp lệ.",
      );
    }

    return {
      maTaiKhoan: nguoiDungDaLuu.maTaiKhoan,
      maKhachHang:
        nguoiDungDaLuu.maKhachHang ?? null,
      maNhanVien:
        nguoiDungDaLuu.maNhanVien ?? null,
      hoTen: nguoiDungDaLuu.hoTen ?? "",
      soDienThoai:
        nguoiDungDaLuu.soDienThoai ?? "",
      vaiTro: nguoiDungDaLuu.vaiTro
        .trim()
        .toUpperCase(),
    };
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
    maNhanVien: response.maNhanVien,
    hoTen: response.hoTen,
    soDienThoai: response.soDienThoai,
    vaiTro: response.vaiTro
      .trim()
      .toUpperCase(),
  };
}

export function XacThucProvider({
  children,
}: XacThucProviderProps) {
  const navigate = useNavigate();

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

  const [
    duongDanSauDangNhap,
    setDuongDanSauDangNhap,
  ] = useState<string | null>(null);
const daDangNhap =
    nguoiDungDangNhap !== null;

  const xoaDuLieuMoHopThoai = () => {
    setSoDienThoaiMacDinh("");
    setDuongDanSauDangNhap(null);
  };

  const dangNhap = async (
    request: DangNhapRequest,
  ) => {
    const duongDanCanChuyen =
      duongDanSauDangNhap;

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

    if (nguoiDungMoi.vaiTro === "ADMIN") {
      navigate("/admin", {
        replace: true,
      });
      return;
    }

    if (
      nguoiDungMoi.vaiTro === "KHACH_HANG" &&
      duongDanCanChuyen &&
      !duongDanCanChuyen.startsWith("/admin")
    ) {
      navigate(duongDanCanChuyen, {
        replace: true,
      });
    }
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

    setDuongDanSauDangNhap(
      options?.duongDanSauDangNhap ?? null,
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
      setDuongDanSauDangNhap(null);
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
        soDienThoaiMacDinh={
          soDienThoaiMacDinh
        }
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
