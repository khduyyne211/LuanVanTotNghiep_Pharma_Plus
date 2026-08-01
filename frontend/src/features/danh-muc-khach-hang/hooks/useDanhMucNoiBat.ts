import { useEffect, useState } from "react";

import { layDanhMucNoiBatApi } from "../api/DanhMucSanPhamApi";
import type { DanhMucNoiBat } from "../types/DanhMucNoiBat";

export function useDanhMucNoiBat(gioiHan = 12) {
  const [danhSachDanhMucNoiBat, setDanhSachDanhMucNoiBat] = useState<DanhMucNoiBat[]>([]);
  const [dangTaiDanhMucNoiBat, setDangTaiDanhMucNoiBat] = useState(true);
  const [loiTaiDanhMucNoiBat, setLoiTaiDanhMucNoiBat] = useState("");

  useEffect(() => {
    let daHuyCapNhatState = false;

    const taiDanhMucNoiBat = async () => {
      try {
        setDangTaiDanhMucNoiBat(true);
        setLoiTaiDanhMucNoiBat("");

        const danhSachDanhMuc = await layDanhMucNoiBatApi(gioiHan);

        if (!daHuyCapNhatState) {
          setDanhSachDanhMucNoiBat(danhSachDanhMuc);
        }
      } catch {
        if (!daHuyCapNhatState) {
          setDanhSachDanhMucNoiBat([]);
          setLoiTaiDanhMucNoiBat("Không thể tải danh mục nổi bật.");
        }
      } finally {
        if (!daHuyCapNhatState) {
          setDangTaiDanhMucNoiBat(false);
        }
      }
    };

    taiDanhMucNoiBat();

    return () => {
      daHuyCapNhatState = true;
    };
  }, [gioiHan]);

  return { danhSachDanhMucNoiBat, dangTaiDanhMucNoiBat, loiTaiDanhMucNoiBat };
}