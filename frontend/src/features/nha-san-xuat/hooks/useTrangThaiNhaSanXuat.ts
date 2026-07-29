import { useState } from "react";
import { isAxiosError } from "axios";

import {
  anNhaSanXuat,
  hienNhaSanXuat,
} from "../api/nhaSanXuatApi";
import type { NhaSanXuat } from "../types/NhaSanXuat";

type UseTrangThaiNhaSanXuatProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiNhaSanXuat({
  onTaiLaiDanhSach,
}: UseTrangThaiNhaSanXuatProps) {
  const [
    maNhaSanXuatDangXuLy,
    setMaNhaSanXuatDangXuLy,
  ] = useState<number | null>(null);

  const xuLyDoiTrangThai = async (
    nhaSanXuat: NhaSanXuat
  ) => {
    const hanhDong = nhaSanXuat.trangThai
      ? "ẩn"
      : "hiển thị";

    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} nhà sản xuất "${nhaSanXuat.tenNhaSanXuat}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaNhaSanXuatDangXuLy(
        nhaSanXuat.maNhaSanXuat
      );

      if (nhaSanXuat.trangThai) {
        await anNhaSanXuat(
          nhaSanXuat.maNhaSanXuat
        );
      } else {
        await hienNhaSanXuat(
          nhaSanXuat.maNhaSanXuat
        );
      }

      onTaiLaiDanhSach();
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái nhà sản xuất:",
        error
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      alert(
        message ??
          "Không thể cập nhật trạng thái nhà sản xuất."
      );
    } finally {
      setMaNhaSanXuatDangXuLy(null);
    }
  };

  return {
    maNhaSanXuatDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThaiNhaSanXuat;