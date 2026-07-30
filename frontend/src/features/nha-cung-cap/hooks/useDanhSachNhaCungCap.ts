import { useCallback, useEffect, useState } from "react";
import { layDanhSachNhaCungCap } from "../api/nhaCungCapApi";
import type { NhaCungCap } from "../types/NhaCungCap";

function useDanhSachNhaCungCap() {
  const [danhSachNhaCungCap, setDanhSachNhaCungCap] = useState<NhaCungCap[]>([]);
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
        const response = await layDanhSachNhaCungCap();

        if (daHuy) {
          return;
        }

        setDanhSachNhaCungCap(response.data);
        setLoi(null);
      } catch (error) {
        console.error("Không thể tải danh sách nhà cung cấp:", error);

        if (!daHuy) {
          setLoi("Không thể tải danh sách nhà cung cấp.");
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
    danhSachNhaCungCap,
    loading,
    loi,
    taiLaiDanhSach,
  };
}

export default useDanhSachNhaCungCap;