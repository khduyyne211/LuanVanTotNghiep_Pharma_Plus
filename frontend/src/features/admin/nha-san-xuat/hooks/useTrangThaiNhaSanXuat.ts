import { useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anNhaSanXuat,
  hienNhaSanXuat,
} from "../api/nhaSanXuatApi";

import type { NhaSanXuat } from "../types/NhaSanXuat";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseTrangThaiNhaSanXuatProps = {
  onTaiLaiDanhSach: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiNhaSanXuat({
  onTaiLaiDanhSach,
  onThongBao,
}: UseTrangThaiNhaSanXuatProps) {
  const [
    maNhaSanXuatDangXuLy,
    setMaNhaSanXuatDangXuLy,
  ] = useState<number | null>(null);

  const [
    nhaSanXuatChoXuLy,
    setNhaSanXuatChoXuLy,
  ] = useState<NhaSanXuat | null>(null);

  const moXacNhanDoiTrangThai = (
    nhaSanXuat: NhaSanXuat,
  ) => {
    setNhaSanXuatChoXuLy(nhaSanXuat);
  };

  const dongXacNhanDoiTrangThai = () => {
    if (maNhaSanXuatDangXuLy !== null) {
      return;
    }

    setNhaSanXuatChoXuLy(null);
  };

  const xacNhanDoiTrangThai = async () => {
    if (!nhaSanXuatChoXuLy) {
      return;
    }

    const nhaSanXuat = nhaSanXuatChoXuLy;
    const dangHienThi =
      nhaSanXuat.trangThai;

    try {
      setMaNhaSanXuatDangXuLy(
        nhaSanXuat.maNhaSanXuat,
      );

      if (dangHienThi) {
        await anNhaSanXuat(
          nhaSanXuat.maNhaSanXuat,
        );
      } else {
        await hienNhaSanXuat(
          nhaSanXuat.maNhaSanXuat,
        );
      }

      setNhaSanXuatChoXuLy(null);

      onTaiLaiDanhSach();

      onThongBao(
        dangHienThi
          ? "Ẩn nhà sản xuất thành công."
          : "Hiển thị nhà sản xuất thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái nhà sản xuất:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      setNhaSanXuatChoXuLy(null);

      onThongBao(
        message ??
          "Không thể cập nhật trạng thái nhà sản xuất.",
        "LOI",
        "Không thể cập nhật trạng thái",
      );
    } finally {
      setMaNhaSanXuatDangXuLy(null);
    }
  };

  return {
    maNhaSanXuatDangXuLy,
    nhaSanXuatChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  };
}

export default useTrangThaiNhaSanXuat;