import { useState } from "react";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anQuyDoiDonVi as anQuyDoiDonViApi,
  hienQuyDoiDonVi as hienQuyDoiDonViApi,
} from "../api/sanPhamApi";

import type {
  QuyDoiDonVi,
  SanPham,
} from "../types/SanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseQuyDoiDonViProps = {
  sanPhamChiTiet: SanPham | null;
  napLaiChiTietSanPham: (
    maSanPham: number,
  ) => Promise<SanPham>;
  onThongBao: HienThongBao;
};

function useQuyDoiDonVi({
  sanPhamChiTiet,
  napLaiChiTietSanPham,
  onThongBao,
}: UseQuyDoiDonViProps) {
  const [hienFormQuyDoi, setHienFormQuyDoi] =
    useState(false);

  const [quyDoiCanSua, setQuyDoiCanSua] =
    useState<QuyDoiDonVi | null>(null);

  const [
    maQuyDoiChoAn,
    setMaQuyDoiChoAn,
  ] = useState<number | null>(null);

  const [
    maQuyDoiDangXuLy,
    setMaQuyDoiDangXuLy,
  ] = useState<number | null>(null);

  const moFormThemQuyDoi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setQuyDoiCanSua(null);
    setHienFormQuyDoi(true);
  };

  const moFormSuaQuyDoi = (
    quyDoi: QuyDoiDonVi,
  ) => {
    setQuyDoiCanSua(quyDoi);
    setHienFormQuyDoi(true);
  };

  const dongFormQuyDoi = () => {
    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const xuLyLuuQuyDoiThanhCong =
    async () => {
      if (!sanPhamChiTiet) {
        return;
      }

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham,
      );
    };

  const anQuyDoiDonVi = (
    maQuyDoi: number,
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    setMaQuyDoiChoAn(maQuyDoi);
  };

  const dongXacNhanAnQuyDoiDonVi = () => {
    if (maQuyDoiDangXuLy !== null) {
      return;
    }

    setMaQuyDoiChoAn(null);
  };

  const xacNhanAnQuyDoiDonVi = async () => {
    if (
      !sanPhamChiTiet
      || maQuyDoiChoAn === null
    ) {
      return;
    }

    const maQuyDoi = maQuyDoiChoAn;

    try {
      setMaQuyDoiDangXuLy(maQuyDoi);

      await anQuyDoiDonViApi(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham,
      );

      setMaQuyDoiChoAn(null);

      onThongBao(
        "Ẩn quy đổi đơn vị thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn quy đổi đơn vị:",
        error,
      );

      onThongBao(
        "Ẩn quy đổi đơn vị thất bại.",
        "LOI",
        "Không thể ẩn quy đổi đơn vị",
      );
    } finally {
      setMaQuyDoiDangXuLy(null);
    }
  };

  const hienQuyDoiDonVi = async (
    maQuyDoi: number,
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      setMaQuyDoiDangXuLy(maQuyDoi);

      await hienQuyDoiDonViApi(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham,
      );

      onThongBao(
        "Hiện quy đổi đơn vị thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện quy đổi đơn vị:",
        error,
      );

      onThongBao(
        "Hiện quy đổi đơn vị thất bại.",
        "LOI",
        "Không thể hiện quy đổi đơn vị",
      );
    } finally {
      setMaQuyDoiDangXuLy(null);
    }
  };

  return {
    hienFormQuyDoi,
    quyDoiCanSua,

    maQuyDoiChoAn,
    maQuyDoiDangXuLy,

    moFormThemQuyDoi,
    moFormSuaQuyDoi,
    dongFormQuyDoi,
    xuLyLuuQuyDoiThanhCong,

    anQuyDoiDonVi,
    hienQuyDoiDonVi,

    dongXacNhanAnQuyDoiDonVi,
    xacNhanAnQuyDoiDonVi,
  };
}

export default useQuyDoiDonVi;
