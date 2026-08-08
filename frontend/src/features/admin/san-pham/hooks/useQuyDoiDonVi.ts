import { useState } from "react";
import {
  anQuyDoiDonVi as anQuyDoiDonViApi,
  hienQuyDoiDonVi as hienQuyDoiDonViApi,
} from "../api/sanPhamApi";
import type {
  QuyDoiDonVi,
  SanPham,
} from "../types/SanPham";

type UseQuyDoiDonViProps = {
  sanPhamChiTiet: SanPham | null;
  napLaiChiTietSanPham: (
    maSanPham: number
  ) => Promise<SanPham>;
};

function useQuyDoiDonVi({
  sanPhamChiTiet,
  napLaiChiTietSanPham,
}: UseQuyDoiDonViProps) {
  const [hienFormQuyDoi, setHienFormQuyDoi] =
    useState(false);
  const [quyDoiCanSua, setQuyDoiCanSua] =
    useState<QuyDoiDonVi | null>(null);

  const moFormThemQuyDoi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setQuyDoiCanSua(null);
    setHienFormQuyDoi(true);
  };

  const moFormSuaQuyDoi = (
    quyDoi: QuyDoiDonVi
  ) => {
    setQuyDoiCanSua(quyDoi);
    setHienFormQuyDoi(true);
  };

  const dongFormQuyDoi = () => {
    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const xuLyLuuQuyDoiThanhCong = async () => {
    if (!sanPhamChiTiet) {
      return;
    }

    await napLaiChiTietSanPham(
      sanPhamChiTiet.maSanPham
    );
  };

  const anQuyDoiDonVi = async (
    maQuyDoi: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    const dongY = confirm(
      "Bạn có chắc muốn ẩn quy đổi đơn vị này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await anQuyDoiDonViApi(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn quy đổi đơn vị:",
        error
      );
      alert("Ẩn quy đổi đơn vị thất bại");
    }
  };

  const hienQuyDoiDonVi = async (
    maQuyDoi: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      await hienQuyDoiDonViApi(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện quy đổi đơn vị:",
        error
      );
      alert("Hiện quy đổi đơn vị thất bại");
    }
  };

  return {
    hienFormQuyDoi,
    quyDoiCanSua,

    moFormThemQuyDoi,
    moFormSuaQuyDoi,
    dongFormQuyDoi,
    xuLyLuuQuyDoiThanhCong,
    anQuyDoiDonVi,
    hienQuyDoiDonVi,
  };
}

export default useQuyDoiDonVi;