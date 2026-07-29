import { useEffect, useState } from "react";

import { layDanhSachHoatChat } from "../api/hoatChatApi";
import type { HoatChat } from "../types/HoatChat";

function useDanhSachHoatChat() {
  const [danhSachHoatChat, setDanhSachHoatChat] = useState<HoatChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);

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
  }, []);

  return {
    danhSachHoatChat,
    loading,
    loi,
  };
}

export default useDanhSachHoatChat;