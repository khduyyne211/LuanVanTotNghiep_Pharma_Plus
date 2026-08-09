import { useContext } from "react";

import { DanhMucSanPhamContext } from "../context/DanhMucSanPhamContext";

export function useDanhMucSanPham() {
  const context = useContext(DanhMucSanPhamContext);

  if (context === undefined) {
    throw new Error(
      "useDanhMucSanPham phải được sử dụng bên trong DanhMucSanPhamProvider."
    );
  }

  return context;
}