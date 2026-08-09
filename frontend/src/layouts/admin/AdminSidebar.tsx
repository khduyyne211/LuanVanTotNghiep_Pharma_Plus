import { NavLink } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
};

const danhSachMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/san-pham",
  },
  {
    label: "Quản lý danh mục",
    path: "/admin/danh-muc",
  },
  {
    label: "Quản lý nhà sản xuất",
    path: "/admin/nha-san-xuat",
  },
  {
    label: "Quản lý đơn vị tính",
    path: "/admin/don-vi-tinh",
  },
  {
    label: "Quản lý hoạt chất",
    path: "/admin/hoat-chat",
  },
  {
    label: "Quản lý khuyến mãi",
    path: "/admin/khuyen-mai",
  },
  {
    label: "Quản lý đơn hàng",
    path: "/admin/don-hang",
  },
  {
    label: "Quản lý nhà cung cấp",
    path: "/admin/nha-cung-cap",
  },
  {
    label: "Quản lý phiếu nhập",
    path: "/admin/phieu-nhap",
  },
];

function AdminSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Pharma</h2>
        <span>Quản trị viên</span>
      </div>

      <nav className="sidebar-menu">
        {danhSachMenu.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            {menu.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;