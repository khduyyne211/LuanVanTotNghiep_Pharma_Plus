import { useState } from "react";
import { isAxiosError } from "axios";
import { doiTrangThaiHopTac } from "../api/nhaCungCapApi";
import type { NhaCungCap } from "../types/NhaCungCap";

type UseTrangThaiNhaCungCapProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiNhaCungCap({ onTaiLaiDanhSach }: UseTrangThaiNhaCungCapProps) {
  const [maNhaCungCapDangXuLy, setMaNhaCungCapDangXuLy] = useState<number | null>(null);

  const xuLyDoiTrangThai = async (nhaCungCap: NhaCungCap) => {
    const hanhDong = nhaCungCap.trangThaiHopTac;
    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} nhà cung cấp "${nhaCungCap.tenNhaCungCap}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaNhaCungCapDangXuLy(nhaCungCap.maNhaCungCap);

      await doiTrangThaiHopTac(nhaCungCap.maNhaCungCap);

      onTaiLaiDanhSach();
    } catch (error) {
      console.error("Không thể cập nhật trạng thái nhà cung cấp:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể cập nhật trạng thái nhà cung cấp.");
    } finally {
      setMaNhaCungCapDangXuLy(null);
    }
  };

  return {
    maNhaCungCapDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThaiNhaCungCap;