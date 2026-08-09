import { Outlet } from "react-router-dom";

import "../../App.css";

import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;