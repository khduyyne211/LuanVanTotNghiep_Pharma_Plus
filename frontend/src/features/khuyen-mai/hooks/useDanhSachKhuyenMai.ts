import { useCallback, useEffect, useState } from "react";
import { layDanhSachKhuyenMai } from "../api/khuyenMaiApi";
import type { KhuyenMai } from "../types/KhuyenMai";

export function useDanhSachKhuyenMai() {
  const [danhSachKhuyenMai, setDanhSachKhuyenMai] = useState<KhuyenMai[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const taiDanhSachKhuyenMai = useCallback(async () => {
    try {
      const response = await layDanhSachKhuyenMai();
      setDanhSachKhuyenMai(response.data);
      setLoi("");
    } catch {
      setLoi("Không thể tải danh sách khuyến mãi");
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void taiDanhSachKhuyenMai();
  }, [taiDanhSachKhuyenMai]);

  return {
    danhSachKhuyenMai,
    dangTai,
    loi,
    taiDanhSachKhuyenMai,
  };
}