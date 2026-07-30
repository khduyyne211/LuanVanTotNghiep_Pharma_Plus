import { useCallback, useEffect, useState } from "react";
import { layDanhSachVaiTro } from "../api/vaiTroApi";
import type { VaiTro } from "../types/VaiTro";

function useDanhSachVaiTro() {
  const [danhSachVaiTro, setDanhSachVaiTro] = useState<VaiTro[]>([]);
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
        const response = await layDanhSachVaiTro();

        if (daHuy) {
          return;
        }

        setDanhSachVaiTro(response.data);
        setLoi(null);
      } catch (error) {
        console.error("Không thể tải danh sách vai trò:", error);

        if (!daHuy) {
          setLoi("Không thể tải danh sách vai trò.");
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
    danhSachVaiTro,
    loading,
    loi,
    taiLaiDanhSach,
  };
}

export default useDanhSachVaiTro;