import type { ReactNode } from "react";

import { DanhMucSanPhamProvider } from "../../features/danh-muc-khach-hang/context/DanhMucSanPhamContext";
import { GioHangProvider } from "../../features/gio-hang/context/GioHangContext";
import { XacThucProvider } from "../../features/xac-thuc/context/XacThucContext";

interface CustomerProvidersProps {
  children: ReactNode;
}

function CustomerProviders({ children }: CustomerProvidersProps) {
  return (
    <XacThucProvider>
      <GioHangProvider>
        <DanhMucSanPhamProvider>
          {children}
        </DanhMucSanPhamProvider>
      </GioHangProvider>
    </XacThucProvider>
  );
}

export default CustomerProviders;