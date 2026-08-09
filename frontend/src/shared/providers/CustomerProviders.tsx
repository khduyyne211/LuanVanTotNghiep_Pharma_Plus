import type { ReactNode } from "react";

import { DanhMucSanPhamProvider } from "../../features/customer/danh-muc/context/DanhMucSanPhamContext";
import { GioHangProvider } from "../../features/gio-hang/context/GioHangContext";

interface CustomerProvidersProps {
  children: ReactNode;
}

function CustomerProviders({
  children,
}: CustomerProvidersProps) {
  return (
    <GioHangProvider>
      <DanhMucSanPhamProvider>
        {children}
      </DanhMucSanPhamProvider>
    </GioHangProvider>
  );
}

export default CustomerProviders;
