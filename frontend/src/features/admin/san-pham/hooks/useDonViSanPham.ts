import { useState } from "react";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anDonViSanPham as anDonViSanPhamApi,
  hienDonViSanPham as hienDonViSanPhamApi,
} from "../api/sanPhamApi";

import type {
  DonViSanPham,
  SanPham,
} from "../types/SanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseDonViSanPhamProps = {
  sanPhamChiTiet: SanPham | null;
  napLaiChiTietSanPham: (
    maSanPham: number,
  ) => Promise<SanPham>;
  onThongBao: HienThongBao;
};

function useDonViSanPham({
  sanPhamChiTiet,
  napLaiChiTietSanPham,
  onThongBao,
}: UseDonViSanPhamProps) {
  const [hienFormDonVi, setHienFormDonVi] =
    useState(false);

  const [donViCanSua, setDonViCanSua] =
    useState<DonViSanPham | null>(null);

  const [
    maDonViSanPhamChoAn,
    setMaDonViSanPhamChoAn,
  ] = useState<number | null>(null);

  const [
    maDonViSanPhamDangXuLy,
    setMaDonViSanPhamDangXuLy,
  ] = useState<number | null>(null);

  const moFormThemDonVi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setDonViCanSua(null);
    setHienFormDonVi(true);
  };

  const moFormSuaDonVi = (
    donVi: DonViSanPham,
  ) => {
    setDonViCanSua(donVi);
    setHienFormDonVi(true);
  };

  const dongFormDonVi = () => {
    setHienFormDonVi(false);
    setDonViCanSua(null);
  };

  const xuLyLuuDonViThanhCong =
    async () => {
      if (!sanPhamChiTiet) {
        return;
      }

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham,
      );
    };

  const anDonViSanPham = (
    maDonViSanPham: number,
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    setMaDonViSanPhamChoAn(
      maDonViSanPham,
    );
  };

  const dongXacNhanAnDonViSanPham =
    () => {
      if (
        maDonViSanPhamDangXuLy !== null
      ) {
        return;
      }

      setMaDonViSanPhamChoAn(null);
    };

  const xacNhanAnDonViSanPham =
    async () => {
      if (
        !sanPhamChiTiet
        || maDonViSanPhamChoAn === null
      ) {
        return;
      }

      const maDonViSanPham =
        maDonViSanPhamChoAn;

      try {
        setMaDonViSanPhamDangXuLy(
          maDonViSanPham,
        );

        await anDonViSanPhamApi(
          maDonViSanPham,
        );

        await napLaiChiTietSanPham(
          sanPhamChiTiet.maSanPham,
        );

        setMaDonViSanPhamChoAn(null);

        onThongBao(
          "Ẩn đơn vị sản phẩm thành công.",
          "THANH_CONG",
          "Thành công",
        );
      } catch (error) {
        console.error(
          "Lỗi khi ẩn đơn vị sản phẩm:",
          error,
        );

        onThongBao(
          "Ẩn đơn vị sản phẩm thất bại.",
          "LOI",
          "Không thể ẩn đơn vị sản phẩm",
        );
      } finally {
        setMaDonViSanPhamDangXuLy(null);
      }
    };

  const hienDonViSanPham = async (
    maDonViSanPham: number,
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      setMaDonViSanPhamDangXuLy(
        maDonViSanPham,
      );

      await hienDonViSanPhamApi(
        maDonViSanPham,
      );

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham,
      );

      onThongBao(
        "Hiện đơn vị sản phẩm thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện đơn vị sản phẩm:",
        error,
      );

      onThongBao(
        "Hiện đơn vị sản phẩm thất bại.",
        "LOI",
        "Không thể hiện đơn vị sản phẩm",
      );
    } finally {
      setMaDonViSanPhamDangXuLy(null);
    }
  };

  return {
    hienFormDonVi,
    donViCanSua,

    maDonViSanPhamChoAn,
    maDonViSanPhamDangXuLy,

    moFormThemDonVi,
    moFormSuaDonVi,
    dongFormDonVi,
    xuLyLuuDonViThanhCong,

    anDonViSanPham,
    hienDonViSanPham,

    dongXacNhanAnDonViSanPham,
    xacNhanAnDonViSanPham,
  };
}

export default useDonViSanPham;