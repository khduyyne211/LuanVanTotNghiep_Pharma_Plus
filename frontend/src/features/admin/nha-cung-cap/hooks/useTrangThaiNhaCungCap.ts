import { useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import { doiTrangThaiHopTac } from "../api/nhaCungCapApi";

import type { NhaCungCap } from "../types/NhaCungCap";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseTrangThaiNhaCungCapProps = {
  onTaiLaiDanhSach: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiNhaCungCap({
  onTaiLaiDanhSach,
  onThongBao,
}: UseTrangThaiNhaCungCapProps) {
  const [
    maNhaCungCapDangXuLy,
    setMaNhaCungCapDangXuLy,
  ] = useState<number | null>(null);

  const [
    nhaCungCapChoXuLy,
    setNhaCungCapChoXuLy,
  ] = useState<NhaCungCap | null>(null);

  const moXacNhanDoiTrangThai = (
    nhaCungCap: NhaCungCap,
  ) => {
    setNhaCungCapChoXuLy(nhaCungCap);
  };

  const dongXacNhanDoiTrangThai = () => {
    if (maNhaCungCapDangXuLy !== null) {
      return;
    }

    setNhaCungCapChoXuLy(null);
  };

  const xacNhanDoiTrangThai = async () => {
    if (!nhaCungCapChoXuLy) {
      return;
    }

    const nhaCungCap = nhaCungCapChoXuLy;
    const dangHopTac =
      nhaCungCap.trangThaiHopTac;

    try {
      setMaNhaCungCapDangXuLy(
        nhaCungCap.maNhaCungCap,
      );

      await doiTrangThaiHopTac(
        nhaCungCap.maNhaCungCap,
      );

      setNhaCungCapChoXuLy(null);

      onTaiLaiDanhSach();

      onThongBao(
        dangHopTac
          ? "Ngừng hợp tác với nhà cung cấp thành công."
          : "Hợp tác lại với nhà cung cấp thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái nhà cung cấp:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      setNhaCungCapChoXuLy(null);

      onThongBao(
        message ??
          "Không thể cập nhật trạng thái nhà cung cấp.",
        "LOI",
        "Không thể cập nhật trạng thái",
      );
    } finally {
      setMaNhaCungCapDangXuLy(null);
    }
  };

  return {
    maNhaCungCapDangXuLy,
    nhaCungCapChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  };
}

export default useTrangThaiNhaCungCap;