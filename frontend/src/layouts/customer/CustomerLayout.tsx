import { Outlet } from "react-router-dom";

import ThanhDanhMucSanPham from "../../features/customer/danh-muc/components/ThanhDanhMucSanPham";
import Footer from "../../shared/components/footer/Footer";
import Header from "../../shared/components/header/Header";

import "../../shared/styles/customer/CustomerCommon.css";
import "./CustomerLayout.css";

function CustomerLayout() {
  return (
    <div className="customer-layout">
      <div className="customer-layout-sticky-header">
        <Header />
        <ThanhDanhMucSanPham />
      </div>

      <main className="customer-layout-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;