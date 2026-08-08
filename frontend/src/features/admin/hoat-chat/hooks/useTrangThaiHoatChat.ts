import { useState } from "react";
import { isAxiosError } from "axios";
import { anHoatChat, hienHoatChat } from "../api/hoatChatApi";
import type { HoatChat } from "../types/HoatChat";

type UseTrangThaiHoatChatProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiHoatChat({ onTaiLaiDanhSach }: UseTrangThaiHoatChatProps) {
  const [maHoatChatDangXuLy, setMaHoatChatDangXuLy] = useState<number | null>(null);

  const xuLyDoiTrangThai = async (hoatChat: HoatChat) => {
    const hanhDong = hoatChat.trangThai ? "ẩn" : "hiển thị";
    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} hoạt chất "${hoatChat.tenHoatChat}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaHoatChatDangXuLy(hoatChat.maHoatChat);

      if (hoatChat.trangThai) {
        await anHoatChat(hoatChat.maHoatChat);
      } else {
        await hienHoatChat(hoatChat.maHoatChat);
      }

      onTaiLaiDanhSach();
    } catch (error) {
      console.error("Không thể cập nhật trạng thái hoạt chất:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể cập nhật trạng thái hoạt chất.");
    } finally {
      setMaHoatChatDangXuLy(null);
    }
  };

  return {
    maHoatChatDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThaiHoatChat;