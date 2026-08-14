import { useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anDonViTinh,
  hienDonViTinh,
} from "../api/donViTinhApi";

import type { DonViTinh } from "../types/DonViTinh";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseTrangThaiDonViTinhProps = {
  onTaiLaiDanhSach: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiDonViTinh({
  onTaiLaiDanhSach,
  onThongBao,
}: UseTrangThaiDonViTinhProps) {
  const [maDonViTinhDangXuLy, setMaDonViTinhDangXuLy] =
    useState<number | null>(null);

  const [donViTinhChoXuLy, setDonViTinhChoXuLy] =
    useState<DonViTinh | null>(null);

  const moXacNhanDoiTrangThai = (
    donViTinh: DonViTinh,
  ) => {
    setDonViTinhChoXuLy(donViTinh);
  };

  const dongXacNhanDoiTrangThai = () => {
    if (maDonViTinhDangXuLy !== null) {
      return;
    }

    setDonViTinhChoXuLy(null);
  };

  const xacNhanDoiTrangThai = async () => {
    if (!donViTinhChoXuLy) {
      return;
    }

    const donViTinh = donViTinhChoXuLy;
    const dangHienThi = donViTinh.trangThai;

    try {
      setMaDonViTinhDangXuLy(
        donViTinh.maDonViTinh,
      );

      if (dangHienThi) {
        await anDonViTinh(
          donViTinh.maDonViTinh,
        );
      } else {
        await hienDonViTinh(
          donViTinh.maDonViTinh,
        );
      }

      setDonViTinhChoXuLy(null);

      onTaiLaiDanhSach();

      onThongBao(
        dangHienThi
          ? "Ẩn đơn vị tính thành công."
          : "Hiển thị đơn vị tính thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái đơn vị tính:",
        error,
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      setDonViTinhChoXuLy(null);

      onThongBao(
        message ??
          "Không thể cập nhật trạng thái đơn vị tính.",
        "LOI",
        "Không thể cập nhật trạng thái",
      );
    } finally {
      setMaDonViTinhDangXuLy(null);
    }
  };

  return {
    maDonViTinhDangXuLy,
    donViTinhChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  };
}

export default useTrangThaiDonViTinh;