import { Outlet } from "react-router-dom";

import "./AdminLayout.css";

import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;