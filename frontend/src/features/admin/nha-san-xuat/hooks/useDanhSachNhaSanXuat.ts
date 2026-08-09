import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { layDanhSachNhaSanXuat } from "../api/nhaSanXuatApi";
import type { NhaSanXuat } from "../types/NhaSanXuat";

function useDanhSachNhaSanXuat() {
  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] =
    useState<NhaSanXuat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [lanTaiDanhSach, setLanTaiDanhSach] =
    useState(0);

  const taiLaiDanhSach = useCallback(() => {
    setLoading(true);
    setLoi(null);
    setLanTaiDanhSach((giaTriCu) => giaTriCu + 1);
  }, []);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSach = async () => {
      try {
        const response = await layDanhSachNhaSanXuat();

        if (daHuy) {
          return;
        }

        setDanhSachNhaSanXuat(response.data);
        setLoi(null);
      } catch (error) {
        console.error(
          "Không thể tải danh sách nhà sản xuất:",
          error
        );

        if (!daHuy) {
          setLoi(
            "Không thể tải danh sách nhà sản xuất."
          );
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
    danhSachNhaSanXuat,
    loading,
    loi,
    taiLaiDanhSach,
  };
}

export default useDanhSachNhaSanXuat;