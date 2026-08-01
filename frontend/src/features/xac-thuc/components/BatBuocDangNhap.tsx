import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useXacThucContext } from "../context/XacThucContext";

type VaiTroHeThong =
  | "KHACH_HANG"
  | "ADMIN"
  | "DUOC_SI";

interface BatBuocDangNhapProps {
  children: ReactNode;
  vaiTroBatBuoc?: VaiTroHeThong;
}

function layTrangMacDinhTheoVaiTro(
  vaiTro: string | undefined,
) {
  if (vaiTro === "ADMIN") {
    return "/admin";
  }

  return "/";
}

function BatBuocDangNhap({
  children,
  vaiTroBatBuoc,
}: BatBuocDangNhapProps) {
  const location = useLocation();

  const {
    nguoiDungDangNhap,
    daDangNhap,
    moHopThoaiDangNhap,
  } = useXacThucContext();

  const duongDanHienTai =
    location.pathname +
    location.search +
    location.hash;

  useEffect(() => {
    if (!daDangNhap) {
      moHopThoaiDangNhap({
        duongDanSauDangNhap:
          duongDanHienTai,
      });
    }
  }, [
    daDangNhap,
    duongDanHienTai,
    moHopThoaiDangNhap,
  ]);

  if (!daDangNhap) {
    return <Navigate to="/" replace />;
  }

  if (
    vaiTroBatBuoc &&
    nguoiDungDangNhap?.vaiTro !==
      vaiTroBatBuoc
  ) {
    return (
      <Navigate
        to={layTrangMacDinhTheoVaiTro(
          nguoiDungDangNhap?.vaiTro,
        )}
        replace
      />
    );
  }

  return children;
}

export default BatBuocDangNhap;
