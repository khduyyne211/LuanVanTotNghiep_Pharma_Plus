import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useXacThucContext } from "../context/XacThucContext";

interface BatBuocDangNhapProps {
  children: ReactNode;
}

function BatBuocDangNhap({
  children,
}: BatBuocDangNhapProps) {
  const {
    daDangNhap,
    moHopThoaiDangNhap,
  } = useXacThucContext();

  useEffect(() => {
    if (!daDangNhap) {
      moHopThoaiDangNhap();
    }
  }, [
    daDangNhap,
    moHopThoaiDangNhap,
  ]);

  if (!daDangNhap) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default BatBuocDangNhap;