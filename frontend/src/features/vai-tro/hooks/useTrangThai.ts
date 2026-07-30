import { useState } from "react";
import { isAxiosError } from "axios";
import { doiTrangThai } from "../api/vaiTroApi";
import type { VaiTro } from "../types/VaiTro";

type UseTrangThaiProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThai({ onTaiLaiDanhSach }: UseTrangThaiProps) {
  const [maVaiTroDangXuLy, setMaVaiTroDangXuLy] = useState<number | null>(null);

  const xuLyDoiTrangThai = async (VaiTro: VaiTro) => {
    const hanhDong = VaiTro.trangThai;
    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} vai trò "${VaiTro.tenVaiTro}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaVaiTroDangXuLy(VaiTro.maVaiTro);

      await doiTrangThai(VaiTro.maVaiTro);

      onTaiLaiDanhSach();
    } catch (error) {
      console.error("Không thể cập nhật trạng thái vai trò:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể cập nhật trạng thái vai trò.");
    } finally {
      setMaVaiTroDangXuLy(null);
    }
  };

  return {
    maVaiTroDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThai;