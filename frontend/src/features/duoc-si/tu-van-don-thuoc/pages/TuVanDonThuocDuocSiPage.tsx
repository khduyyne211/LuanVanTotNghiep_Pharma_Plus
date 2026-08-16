import {
  NavLink,
  Outlet,
} from "react-router-dom";

function TuVanDonThuocDuocSiPage() {
  return (
    <div className="duoc-si-feature-module">
      <div className="duoc-si-feature-tabs">
        <NavLink
          to="/duoc-si/tu-van-don-thuoc/yeu-cau-tu-van"
          className={({ isActive }) =>
            isActive
              ? "duoc-si-feature-tab duoc-si-feature-tab--active"
              : "duoc-si-feature-tab"
          }
        >
          Yêu cầu tư vấn
        </NavLink>

        <NavLink
          to="/duoc-si/tu-van-don-thuoc/don-thuoc"
          className={({ isActive }) =>
            isActive
              ? "duoc-si-feature-tab duoc-si-feature-tab--active"
              : "duoc-si-feature-tab"
          }
        >
          Đơn thuốc
        </NavLink>
      </div>

      <div className="duoc-si-feature-content">
        <Outlet />
      </div>
    </div>
  );
}

export default TuVanDonThuocDuocSiPage;