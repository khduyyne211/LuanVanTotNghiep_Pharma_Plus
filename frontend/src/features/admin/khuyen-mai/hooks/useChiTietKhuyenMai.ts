import { useState } from "react";
import { layChiTietKhuyenMai } from "../api/khuyenMaiApi";
import type { KhuyenMai } from "../types/KhuyenMai";

function useChiTietKhuyenMai() {
  const [khuyenMaiChiTiet, setKhuyenMaiChiTiet] =
    useState<KhuyenMai | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] =
    useState(false);

  const napLaiChiTietKhuyenMai = async (
    ma: number
  ): Promise<KhuyenMai> => {
    const response =
      await layChiTietKhuyenMai(ma);

    setKhuyenMaiChiTiet(response.data);
    return response.data;
  };

  const xemChiTietKhuyenMai = async (
    maSanPham: number
  ) => {
    try {
      setDangTaiChiTiet(true);
      setKhuyenMaiChiTiet(null);

      await napLaiChiTietKhuyenMai(maSanPham);
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

  const dongChiTietKhuyenMai = () => {
    setKhuyenMaiChiTiet(null);
  };

  return {
    khuyenMaiChiTiet,
    dangTaiChiTiet,

    napLaiChiTietKhuyenMai,
    xemChiTietKhuyenMai,
    dongChiTietKhuyenMai,
  };
}

export default useChiTietKhuyenMai;