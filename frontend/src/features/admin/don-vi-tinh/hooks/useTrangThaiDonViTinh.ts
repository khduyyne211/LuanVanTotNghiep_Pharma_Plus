import { useState } from "react";
import { isAxiosError } from "axios";

import { anDonViTinh, hienDonViTinh } from "../api/donViTinhApi";
import type { DonViTinh } from "../types/DonViTinh";

type UseTrangThaiDonViTinhProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiDonViTinh({
  onTaiLaiDanhSach,
}: UseTrangThaiDonViTinhProps) {
  const [maDonViTinhDangXuLy, setMaDonViTinhDangXuLy] =
    useState<number | null>(null);

  const xuLyDoiTrangThai = async (donViTinh: DonViTinh) => {
    const hanhDong = donViTinh.trangThai ? "ẩn" : "hiển thị";

    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} đơn vị tính "${donViTinh.tenDonViTinh}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaDonViTinhDangXuLy(donViTinh.maDonViTinh);

      if (donViTinh.trangThai) {
        await anDonViTinh(donViTinh.maDonViTinh);
      } else {
        await hienDonViTinh(donViTinh.maDonViTinh);
      }

      onTaiLaiDanhSach();
    } catch (error) {
      console.error("Không thể cập nhật trạng thái đơn vị tính:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể cập nhật trạng thái đơn vị tính.");
    } finally {
      setMaDonViTinhDangXuLy(null);
    }
  };

  return {
    maDonViTinhDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThaiDonViTinh;