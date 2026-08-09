import { useCallback, useEffect, useState } from "react";
import { layDanhSachHoatChat } from "../api/hoatChatApi";
import type { HoatChat } from "../types/HoatChat";

function useDanhSachHoatChat() {
  const [danhSachHoatChat, setDanhSachHoatChat] = useState<HoatChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [lanTaiDanhSach, setLanTaiDanhSach] = useState(0);

  const taiLaiDanhSach = useCallback(() => {
    setLoading(true);
    setLoi(null);
    setLanTaiDanhSach((giaTriCu) => giaTriCu + 1);
  }, []);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSach = async () => {
      try {
        const response = await layDanhSachHoatChat();

        if (daHuy) {
          return;
        }

        setDanhSachHoatChat(response.data);
        setLoi(null);
      } catch (error) {
        console.error("Không thể tải danh sách hoạt chất:", error);

        if (!daHuy) {
          setLoi("Không thể tải danh sách hoạt chất.");
        }
      } finally {
        if (!daHuy) {
          setLoading(false);
        }
      }
    };

    void taiDanhSach();

    return () => {
      daHuy = true;
    };
  }, [lanTaiDanhSach]);

  return {
    danhSachHoatChat,
    loading,
    loi,
    taiLaiDanhSach,
  };
}

export default useDanhSachHoatChat;