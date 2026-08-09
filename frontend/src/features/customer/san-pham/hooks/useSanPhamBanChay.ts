import { useEffect, useState } from "react";

import { laySanPhamBanChayApi } from "../api/SanPhamApi";
import type { SanPhamBanChay } from "../types/SanPhamBanChay";

export function useSanPhamBanChay(gioiHan = 12) {
  const [danhSachSanPhamBanChay, setDanhSachSanPhamBanChay] = useState<SanPhamBanChay[]>([]);
  const [dangTaiSanPhamBanChay, setDangTaiSanPhamBanChay] = useState(true);
  const [loiTaiSanPhamBanChay, setLoiTaiSanPhamBanChay] = useState("");

  useEffect(() => {
    let daHuyCapNhatState = false;

    const taiSanPhamBanChay = async () => {
      try {
        setDangTaiSanPhamBanChay(true);
        setLoiTaiSanPhamBanChay("");

        const danhSachSanPham = await laySanPhamBanChayApi(gioiHan);

        if (!daHuyCapNhatState) {
          setDanhSachSanPhamBanChay(danhSachSanPham);
        }
      } catch {
        if (!daHuyCapNhatState) {
          setDanhSachSanPhamBanChay([]);
          setLoiTaiSanPhamBanChay("Không thể tải danh sách sản phẩm bán chạy.");
        }
      } finally {
        if (!daHuyCapNhatState) {
          setDangTaiSanPhamBanChay(false);
        }
      }
    };

    taiSanPhamBanChay();

    return () => {
      daHuyCapNhatState = true;
    };
  }, [gioiHan]);

  return { danhSachSanPhamBanChay, dangTaiSanPhamBanChay, loiTaiSanPhamBanChay };
}