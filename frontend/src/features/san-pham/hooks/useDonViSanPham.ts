import { useState } from "react";
import {
  anDonViSanPham as anDonViSanPhamApi,
  hienDonViSanPham as hienDonViSanPhamApi,
} from "../api/sanPhamApi";
import type {
  DonViSanPham,
  SanPham,
} from "../types/SanPham";

type UseDonViSanPhamProps = {
  sanPhamChiTiet: SanPham | null;
  napLaiChiTietSanPham: (
    maSanPham: number
  ) => Promise<SanPham>;
};

function useDonViSanPham({
  sanPhamChiTiet,
  napLaiChiTietSanPham,
}: UseDonViSanPhamProps) {
  const [hienFormDonVi, setHienFormDonVi] =
    useState(false);
  const [donViCanSua, setDonViCanSua] =
    useState<DonViSanPham | null>(null);

  const moFormThemDonVi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setDonViCanSua(null);
    setHienFormDonVi(true);
  };

  const moFormSuaDonVi = (
    donVi: DonViSanPham
  ) => {
    setDonViCanSua(donVi);
    setHienFormDonVi(true);
  };

  const dongFormDonVi = () => {
    setHienFormDonVi(false);
    setDonViCanSua(null);
  };

  const xuLyLuuDonViThanhCong = async () => {
    if (!sanPhamChiTiet) {
      return;
    }

    await napLaiChiTietSanPham(
      sanPhamChiTiet.maSanPham
    );
  };

  const anDonViSanPham = async (
    maDonViSanPham: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    const dongY = confirm(
      "Bạn có chắc muốn ẩn đơn vị sản phẩm này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await anDonViSanPhamApi(maDonViSanPham);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn đơn vị sản phẩm:",
        error
      );
      alert("Ẩn đơn vị sản phẩm thất bại");
    }
  };

  const hienDonViSanPham = async (
    maDonViSanPham: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      await hienDonViSanPhamApi(maDonViSanPham);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện đơn vị sản phẩm:",
        error
      );
      alert("Hiện đơn vị sản phẩm thất bại");
    }
  };

  return {
    hienFormDonVi,
    donViCanSua,

    moFormThemDonVi,
    moFormSuaDonVi,
    dongFormDonVi,
    xuLyLuuDonViThanhCong,
    anDonViSanPham,
    hienDonViSanPham,
  };
}

export default useDonViSanPham;