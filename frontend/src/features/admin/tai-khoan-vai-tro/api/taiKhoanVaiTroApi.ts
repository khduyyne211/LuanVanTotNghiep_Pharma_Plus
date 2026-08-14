import axiosClient from "../../../../shared/api/axiosClient";

import type {
  TaiKhoanNhanVien,
  TaiKhoanNhanVienCapNhatRequest,
  TaiKhoanNhanVienTaoRequest,
  VaiTro,
  VaiTroRequest,
} from "../types/TaiKhoanVaiTro";

export const layDanhSachTaiKhoanNhanVien =
  async (): Promise<TaiKhoanNhanVien[]> => {
    const response =
      await axiosClient.get<TaiKhoanNhanVien[]>(
        "/tai-khoan-nhan-vien",
      );

    return response.data;
  };

export const themTaiKhoanNhanVien = async (
  request: TaiKhoanNhanVienTaoRequest,
): Promise<TaiKhoanNhanVien> => {
  const response =
    await axiosClient.post<TaiKhoanNhanVien>(
      "/tai-khoan-nhan-vien",
      request,
    );

  return response.data;
};

export const capNhatTaiKhoanNhanVien = async (
  maNhanVien: number,
  request: TaiKhoanNhanVienCapNhatRequest,
): Promise<TaiKhoanNhanVien> => {
  const response =
    await axiosClient.put<TaiKhoanNhanVien>(
      `/tai-khoan-nhan-vien/${maNhanVien}`,
      request,
    );

  return response.data;
};

export const doiTrangThaiTaiKhoanNhanVien =
  async (
    maNhanVien: number,
  ): Promise<TaiKhoanNhanVien> => {
    const response =
      await axiosClient.put<TaiKhoanNhanVien>(
        `/tai-khoan-nhan-vien/${maNhanVien}/doi-trang-thai`,
      );

    return response.data;
  };

export const layDanhSachVaiTro =
  async (): Promise<VaiTro[]> => {
    const response =
      await axiosClient.get<VaiTro[]>(
        "/vai-tro",
      );

    return response.data;
  };

export const themVaiTro = async (
  request: VaiTroRequest,
): Promise<VaiTro> => {
  const response =
    await axiosClient.post<VaiTro>(
      "/vai-tro",
      request,
    );

  return response.data;
};

export const capNhatVaiTro = async (
  maVaiTro: number,
  request: VaiTroRequest,
): Promise<VaiTro> => {
  const response =
    await axiosClient.put<VaiTro>(
      `/vai-tro/${maVaiTro}`,
      request,
    );

  return response.data;
};

export const doiTrangThaiVaiTro =
  async (
    maVaiTro: number,
  ): Promise<VaiTro> => {
    const response =
      await axiosClient.put<VaiTro>(
        `/vai-tro/${maVaiTro}/doi-trang-thai`,
      );

    return response.data;
  };