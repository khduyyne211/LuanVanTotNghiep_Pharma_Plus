import { useState } from "react";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import { layChiTietSanPhamDayDu } from "../api/sanPhamApi";

import type { SanPham } from "../types/SanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseChiTietSanPhamProps = {
  onThongBao: HienThongBao;
};

function useChiTietSanPham({
  onThongBao,
}: UseChiTietSanPhamProps) {
  const [sanPhamChiTiet, setSanPhamChiTiet] =
    useState<SanPham | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] =
    useState(false);

  const napLaiChiTietSanPham = async (
    maSanPham: number,
  ): Promise<SanPham> => {
    const response =
      await layChiTietSanPhamDayDu(maSanPham);

    setSanPhamChiTiet(response.data);

    return response.data;
  };

  const xemChiTietSanPham = async (
    maSanPham: number,
  ) => {
    try {
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);

      await napLaiChiTietSanPham(maSanPham);
    } catch (error) {
      console.error(
        "Lỗi khi lấy chi tiết sản phẩm:",
        error,
      );

      onThongBao(
        "Không thể tải chi tiết sản phẩm.",
        "LOI",
        "Không thể tải dữ liệu",
      );
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