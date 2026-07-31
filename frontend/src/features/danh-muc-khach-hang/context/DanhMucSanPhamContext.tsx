import { createContext, useEffect, useState, type ReactNode } from "react";

import { layDanhMucMenuApi } from "../api/DanhMucSanPhamApi";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";

interface DanhMucSanPhamContextValue {
  danhSachDanhMuc: DanhMucSanPham[];
  dangTaiDanhMuc: boolean;
  loiTaiDanhMuc: string;
}

interface DanhMucSanPhamProviderProps {
  children: ReactNode;
}

export const DanhMucSanPhamContext =
  createContext<DanhMucSanPhamContextValue | undefined>(undefined);

export function DanhMucSanPhamProvider({ children }: DanhMucSanPhamProviderProps) {
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMucSanPham[]>([]);
  const [dangTaiDanhMuc, setDangTaiDanhMuc] = useState(true);
  const [loiTaiDanhMuc, setLoiTaiDanhMuc] = useState("");

  useEffect(() => {
    let daHuyCapNhatState = false;

    const taiDanhMuc = async () => {
      try {
        setDangTaiDanhMuc(true);
        setLoiTaiDanhMuc("");

        const danhSachDanhMucMoi = await layDanhMucMenuApi();

        if (!daHuyCapNhatState) {
          setDanhSachDanhMuc(danhSachDanhMucMoi);
        }
      } catch {
        if (!daHuyCapNhatState) {
          setDanhSachDanhMuc([]);
          setLoiTaiDanhMuc("Không thể tải danh sách danh mục sản phẩm.");
        }
      } finally {
        if (!daHuyCapNhatState) {
          setDangTaiDanhMuc(false);
        }
      }
    };

    taiDanhMuc();

    return () => {
      daHuyCapNhatState = true;
    };
  }, []);

  return (
    <DanhMucSanPhamContext.Provider
      value={{ danhSachDanhMuc, dangTaiDanhMuc, loiTaiDanhMuc }}
    >
      {children}
    </DanhMucSanPhamContext.Provider>
  );
}