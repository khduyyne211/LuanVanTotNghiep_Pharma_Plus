import { useCallback, useState } from "react";

import { layChiTietPhieuNhap } from "../api/phieuNhapApi";
import type { PhieuNhap } from "../types/PhieuNhap";

function useChiTietPhieuNhap() {
  const [phieuNhapChiTiet, setPhieuNhapChiTiet] =
    useState<PhieuNhap | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] =
    useState(false);

  const [loiChiTiet, setLoiChiTiet] =
    useState<string | null>(null);

  const [hienChiTiet, setHienChiTiet] =
    useState(false);

  const moChiTiet = useCallback(
    async (maPhieuNhap: number) => {
      try {
        setHienChiTiet(true);
        setDangTaiChiTiet(true);
        setLoiChiTiet(null);
        setPhieuNhapChiTiet(null);

        const response =
          await layChiTietPhieuNhap(maPhieuNhap);

        setPhieuNhapChiTiet(response.data);
      } catch (error) {
        console.error(
          "Không thể tải chi tiết phiếu nhập:",
          error
        );

        setLoiChiTiet(
          "Không thể tải chi tiết phiếu nhập."
        );
      } finally {
        setDangTaiChiTiet(false);
      }
    },
    []
  );

  const dongChiTiet = useCallback(() => {
    if (dangTaiChiTiet) {
      return;
    }

    setHienChiTiet(false);
    setPhieuNhapChiTiet(null);
    setLoiChiTiet(null);
  }, [dangTaiChiTiet]);

  return {
    hienChiTiet,
    phieuNhapChiTiet,
    dangTaiChiTiet,
    loiChiTiet,
    moChiTiet,
    dongChiTiet,
  };
}

export default useChiTietPhieuNhap;