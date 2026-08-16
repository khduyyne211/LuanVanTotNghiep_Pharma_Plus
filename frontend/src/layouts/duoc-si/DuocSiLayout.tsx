import { Outlet } from "react-router-dom";

import "./DuocSiLayout.css";

import DuocSiSidebar from "./DuocSiSidebar";

function DuocSiLayout() {
  return (
    <div className="duoc-si-shell">
      <DuocSiSidebar />

      <main className="duoc-si-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DuocSiLayout;