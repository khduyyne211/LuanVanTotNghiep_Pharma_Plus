import { useEffect, useState } from "react";

import { layDanhSachDanhMucSanPham } from "../api/danhMucSanPhamApi";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";

function useDanhSachDanhMucSanPham() {
  const [danhSachDanhMuc, setDanhSachDanhMuc] =
    useState<DanhMucSanPham[]>([]);

  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSach = async () => {
      try {
        const response =
          await layDanhSachDanhMucSanPham();

        if (daHuy) {
          return;
        }

        setDanhSachDanhMuc(response.data);
        setLoi(null);
      } catch (error) {
        console.error(
          "Không thể tải danh sách danh mục:",
          error
        );

        if (!daHuy) {
          setLoi(
            "Không thể tải danh sách danh mục sản phẩm."
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
    danhSachDanhMuc,
    loading,
    loi,
  };
}

export default useDanhSachDanhMucSanPham;