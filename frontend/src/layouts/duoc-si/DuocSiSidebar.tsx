import {
  NavLink,
} from "react-router-dom";

import "./DuocSiLayout.css";

const DANH_SACH_MENU = [
  {
    duongDan:
      "/duoc-si/yeu-cau-tu-van",

    nhan:
      "Yêu cầu tư vấn",

    icon:
      "bi-chat-left-text",
  },
  {
    duongDan:
      "/duoc-si/don-hang",

    nhan:
      "Quản lý đơn hàng",

    icon:
      "bi-box-seam",
  },
  {
    duongDan:
      "/duoc-si/tao-don-tai-quay",

    nhan:
      "Tạo đơn tại quầy",

    icon:
      "bi-cart-plus",
  },
];

function DuocSiSidebar() {
  return (
    <aside className="duoc-si-sidebar">
      <div className="duoc-si-sidebar-brand">
        <div className="duoc-si-sidebar-logo">
          <i className="bi bi-capsule-pill" />
        </div>

        <div>
          <strong>
            Pharma+
          </strong>

          <span>
            Dược sĩ
          </span>
        </div>
      </div>

      <nav className="duoc-si-sidebar-menu">
        {DANH_SACH_MENU.map(
          (menu) => (
            <NavLink
              key={menu.duongDan}
              to={menu.duongDan}
              className={({
                isActive,
              }) =>
                isActive
                  ? "duoc-si-menu-item duoc-si-menu-item--active"
                  : "duoc-si-menu-item"
              }
            >
              <i
                className={
                  `bi ${menu.icon}`
                }
              />

              <span>
                {menu.nhan}
              </span>
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}

export default DuocSiSidebar;