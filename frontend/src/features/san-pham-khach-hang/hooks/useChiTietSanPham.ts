import { useEffect, useState } from "react";
import apiClient from "../../../api/axiosClient";
import type { SanPhamChiTiet } from "../types/SanPhamChiTiet";

export function useChiTietSanPham(maSanPham?: number) {
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState<
    SanPhamChiTiet | undefined
  >(undefined);

  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);

  useEffect(() => {
    if (maSanPham === undefined) {
      return;
    }

    setDangTaiDuLieu(true);

    apiClient
      .get<SanPhamChiTiet>(`/san-pham/khach-hang/${maSanPham}`)
      .then((response) => {
        setSanPhamChiTiet(response.data);
      })
      .finally(() => {
        setDangTaiDuLieu(false);
      });
  }, [maSanPham]);

  return {
    sanPhamChiTiet,
    dangTaiDuLieu,
  };
}