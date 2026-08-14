import { useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anHoatChat,
  hienHoatChat,
} from "../api/hoatChatApi";

import type { HoatChat } from "../types/HoatChat";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseTrangThaiHoatChatProps = {
  onTaiLaiDanhSach: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiHoatChat({
  onTaiLaiDanhSach,
  onThongBao,
}: UseTrangThaiHoatChatProps) {
  const [maHoatChatDangXuLy, setMaHoatChatDangXuLy] =
    useState<number | null>(null);

  const [hoatChatChoXuLy, setHoatChatChoXuLy] =
    useState<HoatChat | null>(null);

  const moXacNhanDoiTrangThai = (
    hoatChat: HoatChat,
  ) => {
    setHoatChatChoXuLy(hoatChat);
  };

  const dongXacNhanDoiTrangThai = () => {
    if (maHoatChatDangXuLy !== null) {
      return;
    }

    setHoatChatChoXuLy(null);
  };

  const xacNhanDoiTrangThai = async () => {
    if (!hoatChatChoXuLy) {
      return;
    }

    const hoatChat = hoatChatChoXuLy;
    const dangHienThi = hoatChat.trangThai;

    try {
      setMaHoatChatDangXuLy(
        hoatChat.maHoatChat,
      );

      if (dangHienThi) {
        await anHoatChat(
          hoatChat.maHoatChat,
        );
      } else {
        await hienHoatChat(
          hoatChat.maHoatChat,
        );
      }

      setHoatChatChoXuLy(null);

      onTaiLaiDanhSach();

      onThongBao(
        dangHienThi
          ? "Ẩn hoạt chất thành công."
          : "Hiển thị hoạt chất thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái hoạt chất:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      setHoatChatChoXuLy(null);

      onThongBao(
        message ??
          "Không thể cập nhật trạng thái hoạt chất.",
        "LOI",
        "Không thể cập nhật trạng thái",
      );
    } finally {
      setMaHoatChatDangXuLy(null);
    }
  };

  return {
    maHoatChatDangXuLy,
    hoatChatChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  };
}

export default useTrangThaiHoatChat;