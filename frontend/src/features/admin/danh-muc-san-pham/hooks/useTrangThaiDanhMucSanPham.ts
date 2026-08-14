import { useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anDanhMucSanPham,
  hienDanhMucSanPham,
} from "../api/danhMucSanPhamApi";

import type { DanhMucSanPham } from "../types/DanhMucSanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseTrangThaiDanhMucSanPhamProps = {
  onTaiLaiDanhSach: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiDanhMucSanPham({
  onTaiLaiDanhSach,
  onThongBao,
}: UseTrangThaiDanhMucSanPhamProps) {
  const [maDanhMucDangXuLy, setMaDanhMucDangXuLy] =
    useState<number | null>(null);

  const [danhMucChoXuLy, setDanhMucChoXuLy] =
    useState<DanhMucSanPham | null>(null);

  const moXacNhanDoiTrangThai = (
    danhMuc: DanhMucSanPham,
  ) => {
    setDanhMucChoXuLy(danhMuc);
  };

  const dongXacNhanDoiTrangThai = () => {
    if (maDanhMucDangXuLy !== null) {
      return;
    }

    setDanhMucChoXuLy(null);
  };

  const xacNhanDoiTrangThai = async () => {
    if (!danhMucChoXuLy) {
      return;
    }

    const danhMuc = danhMucChoXuLy;
    const dangHienThi = danhMuc.trangThaiHienThi;

    try {
      setMaDanhMucDangXuLy(danhMuc.maDanhMuc);

      if (dangHienThi) {
        await anDanhMucSanPham(danhMuc.maDanhMuc);
      } else {
        await hienDanhMucSanPham(danhMuc.maDanhMuc);
      }

      setDanhMucChoXuLy(null);

      onTaiLaiDanhSach();

      onThongBao(
        dangHienThi
          ? "Ẩn danh mục sản phẩm thành công."
          : "Hiển thị danh mục sản phẩm thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái danh mục:",
        error,
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      setDanhMucChoXuLy(null);

      onThongBao(
        message ??
          "Không thể cập nhật trạng thái danh mục sản phẩm.",
        "LOI",
        "Không thể cập nhật trạng thái",
      );
    } finally {
      setMaDanhMucDangXuLy(null);
    }
  };

  return {
    maDanhMucDangXuLy,
    danhMucChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  };
}

export default useTrangThaiDanhMucSanPham;