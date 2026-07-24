import { useState } from "react";
import { layChiTietSanPhamDayDu } from "../api/sanPhamApi";
import type { SanPham } from "../types/SanPham";

function useChiTietSanPham() {
  const [sanPhamChiTiet, setSanPhamChiTiet] =
    useState<SanPham | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] =
    useState(false);

  const napLaiChiTietSanPham = async (
    maSanPham: number
  ): Promise<SanPham> => {
    const response =
      await layChiTietSanPhamDayDu(maSanPham);

    setSanPhamChiTiet(response.data);
    return response.data;
  };

  const xemChiTietSanPham = async (
    maSanPham: number
  ) => {
    try {
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);

      await napLaiChiTietSanPham(maSanPham);
    } catch (error) {
      console.error(
        "Lỗi khi lấy chi tiết sản phẩm:",
        error
      );
      alert("Không thể tải chi tiết sản phẩm");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTietSanPhamCoBan = () => {
    setSanPhamChiTiet(null);
  };

  return {
    sanPhamChiTiet,
    dangTaiChiTiet,

    napLaiChiTietSanPham,
    xemChiTietSanPham,
    dongChiTietSanPhamCoBan,
  };
}

export default useChiTietSanPham;