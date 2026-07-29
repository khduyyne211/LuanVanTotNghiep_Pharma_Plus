import { useEffect, useState } from "react";

import { layDanhSachDonViTinh } from "../api/donViTinhApi";
import type { DonViTinh } from "../types/DonViTinh";

function useDanhSachDonViTinh() {
  const [danhSachDonViTinh, setDanhSachDonViTinh] =
    useState<DonViTinh[]>([]);
  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSach = async () => {
      try {
        const response = await layDanhSachDonViTinh();

        if (daHuy) {
          return;
        }

        setDanhSachDonViTinh(response.data);
        setLoi(null);
      } catch (error) {
        console.error(
          "Không thể tải danh sách đơn vị tính:",
          error
        );

        if (!daHuy) {
          setLoi(
            "Không thể tải danh sách đơn vị tính."
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
  }, []);

  return {
    danhSachDonViTinh,
    loading,
    loi,
  };
}

export default useDanhSachDonViTinh;