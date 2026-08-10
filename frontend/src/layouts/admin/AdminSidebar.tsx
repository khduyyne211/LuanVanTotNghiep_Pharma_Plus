import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { NavLink } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
  icon: string;
};

const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_MAX_WIDTH = 340;
const SIDEBAR_DEFAULT_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const SIDEBAR_WIDTH_STORAGE_KEY = "admin_sidebar_width";
const SIDEBAR_COLLAPSED_STORAGE_KEY = "admin_sidebar_collapsed";

const danhSachMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: "bi-grid",
  },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/san-pham",
    icon: "bi-box-seam",
  },
  {
    label: "Quản lý danh mục",
    path: "/admin/danh-muc",
    icon: "bi-collection",
  },
  {
    label: "Quản lý nhà sản xuất",
    path: "/admin/nha-san-xuat",
    icon: "bi-buildings",
  },
  {
    label: "Quản lý đơn vị tính",
    path: "/admin/don-vi-tinh",
    icon: "bi-rulers",
  },
  {
    label: "Quản lý hoạt chất",
    path: "/admin/hoat-chat",
    icon: "bi-capsule",
  },
  {
    label: "Quản lý khuyến mãi",
    path: "/admin/khuyen-mai",
    icon: "bi-tags",
  },
  {
    label: "Quản lý đơn hàng",
    path: "/admin/don-hang",
    icon: "bi-receipt",
  },
  {
    label: "Quản lý nhà cung cấp",
    path: "/admin/nha-cung-cap",
    icon: "bi-truck",
  },
  {
    label: "Quản lý phiếu nhập",
    path: "/admin/phieu-nhap",
    icon: "bi-clipboard-check",
  },
];

function layChieuRongSidebarDaLuu(): number {
  const giaTriDaLuu = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);

  if (!giaTriDaLuu) {
    return SIDEBAR_DEFAULT_WIDTH;
  }

  const giaTriSo = Number(giaTriDaLuu);

  if (Number.isNaN(giaTriSo)) {
    return SIDEBAR_DEFAULT_WIDTH;
  }

  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, giaTriSo));
}

function layTrangThaiThuGonDaLuu(): boolean {
  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
}

function AdminSidebar() {
  const [chieuRong, setChieuRong] = useState<number>(layChieuRongSidebarDaLuu);

  const [daThuGon, setDaThuGon] = useState<boolean>(layTrangThaiThuGonDaLuu);

  const [dangResize, setDangResize] = useState(false);
  const [menuMobileDangMo, setMenuMobileDangMo] = useState(false);

  const viTriBatDauResize = useRef(0);
  const chieuRongBatDauResize = useRef(SIDEBAR_DEFAULT_WIDTH);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(chieuRong));
  }, [chieuRong]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(daThuGon));
  }, [daThuGon]);

  useEffect(() => {
    if (!dangResize) {
      return;
    }

    const xuLyDiChuyenChuot = (event: PointerEvent) => {
      const khoangCach = event.clientX - viTriBatDauResize.current;

      const chieuRongMoi = chieuRongBatDauResize.current + khoangCach;

      const chieuRongHopLe = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, chieuRongMoi),
      );

      setChieuRong(chieuRongHopLe);
    };

    const ketThucResize = () => {
      setDangResize(false);
    };

    window.addEventListener("pointermove", xuLyDiChuyenChuot);
    window.addEventListener("pointerup", ketThucResize);

    document.body.classList.add("admin-sidebar-is-resizing");

    return () => {
      window.removeEventListener("pointermove", xuLyDiChuyenChuot);
      window.removeEventListener("pointerup", ketThucResize);

      document.body.classList.remove("admin-sidebar-is-resizing");
    };
  }, [dangResize]);

  useEffect(() => {
    const xuLyPhimTat = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuMobileDangMo(false);
      }
    };

    window.addEventListener("keydown", xuLyPhimTat);

    return () => {
      window.removeEventListener("keydown", xuLyPhimTat);
    };
  }, []);

  const batDauResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (daThuGon) {
      return;
    }

    event.preventDefault();

    viTriBatDauResize.current = event.clientX;
    chieuRongBatDauResize.current = chieuRong;

    setDangResize(true);
  };

  const thayDoiTrangThaiThuGon = () => {
    setDaThuGon((trangThaiHienTai) => !trangThaiHienTai);
  };

  const dongMenuMobile = () => {
    setMenuMobileDangMo(false);
  };

  const chieuRongDangHienThi = daThuGon ? SIDEBAR_COLLAPSED_WIDTH : chieuRong;

  return (
    <>
      <button
        type="button"
        className="admin-mobile-menu-button"
        onClick={() => setMenuMobileDangMo(true)}
        aria-label="Mở menu quản trị"
        title="Mở menu"
      >
        <i className="bi bi-list" />
      </button>

      {menuMobileDangMo && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={dongMenuMobile}
          aria-label="Đóng menu quản trị"
        />
      )}

      <aside
        className={[
          "admin-sidebar",
          daThuGon ? "admin-sidebar-collapsed" : "",
          menuMobileDangMo ? "admin-sidebar-mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          width: `${chieuRongDangHienThi}px`,
        }}
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo-icon">
              <i className="bi bi-capsule" />
            </div>

            {!daThuGon && (
              <div className="admin-sidebar-brand-text">
                <strong>Pharma</strong>
                <span>Quản trị viên</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="admin-sidebar-collapse-button"
            onClick={thayDoiTrangThaiThuGon}
            aria-label={
              daThuGon ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"
            }
            title={daThuGon ? "Mở rộng" : "Thu gọn"}
          >
            <i
              className={
                daThuGon ? "bi bi-chevron-right" : "bi bi-chevron-left"
              }
            />
          </button>

          <button
            type="button"
            className="admin-sidebar-mobile-close"
            onClick={dongMenuMobile}
            aria-label="Đóng menu quản trị"
            title="Đóng menu"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="admin-sidebar-menu">
          {danhSachMenu.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={dongMenuMobile}
              title={daThuGon ? menu.label : undefined}
              className={({ isActive }) =>
                [
                  "admin-sidebar-menu-item",
                  isActive ? "admin-sidebar-menu-item-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="admin-sidebar-menu-icon">
                <i className={`bi ${menu.icon}`} />
              </span>

              {!daThuGon && (
                <span className="admin-sidebar-menu-label">{menu.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-avatar">
              <i className="bi bi-person" />
            </div>

            {!daThuGon && (
              <div className="admin-sidebar-user-info">
                <strong>Admin</strong>
                <span>Quản trị viên</span>
              </div>
            )}
          </div>
        </div>

        {!daThuGon && (
          <div
            className={[
              "admin-sidebar-resize-handle",
              dangResize ? "admin-sidebar-resize-handle-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onPointerDown={batDauResize}
            role="separator"
            aria-orientation="vertical"
            aria-label="Điều chỉnh độ rộng thanh điều hướng"
            title="Kéo để thay đổi độ rộng"
          />
        )}
      </aside>
    </>
  );
}

export default AdminSidebar;
