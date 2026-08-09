import {
  lazy,
  Suspense,
} from "react";

import {
  Route,
} from "react-router-dom";

import BatBuocDangNhap
  from "../features/xac-thuc/components/BatBuocDangNhap";

const AdminLayout =
  lazy(() =>
    import("../layouts/admin/AdminLayout")
  );

export const AdminRoutes = (
  <Route
    path="/admin/*"
    element={
      <BatBuocDangNhap vaiTroBatBuoc="ADMIN">
        <Suspense
          fallback={
            <div>
              Đang tải trang quản trị...
            </div>
          }
        >
          <AdminLayout />
        </Suspense>
      </BatBuocDangNhap>
    }
  />
);
