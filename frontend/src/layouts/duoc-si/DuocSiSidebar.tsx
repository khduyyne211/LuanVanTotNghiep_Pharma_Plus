import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { NavLink } from "react-router-dom";

import { useXacThucContext } from "../../features/xac-thuc/context/XacThucContext";

import "./DuocSiLayout.css";

type MenuItem = {
  nhan: string;
  duongDan: string;
  icon: string;
};

const SIDEBAR_MIN_WIDTH = 220;

const SIDEBAR_MAX_WIDTH = 340;

const SIDEBAR_DEFAULT_WIDTH = 260;

const SIDEBAR_COLLAPSED_WIDTH = 72;

const SIDEBAR_WIDTH_STORAGE_KEY = "duoc_si_sidebar_width";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "duoc_si_sidebar_collapsed";

const DANH_SACH_MENU: MenuItem[] = [
  {
    duongDan: "/duoc-si/tu-van-don-thuoc",

    nhan: "Tư vấn & đơn thuốc",

    icon: "bi-chat-left-text",
  },
  {
    duongDan: "/duoc-si/don-hang",

    nhan: "Quản lý đơn hàng",

    icon: "bi-box-seam",
  },
  {
    duongDan: "/duoc-si/tao-don-tai-quay",

    nhan: "Tạo đơn tại quầy",

    icon: "bi-cart-plus",
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

function DuocSiSidebar() {
  const { dangXuat, nguoiDungDangNhap } = useXacThucContext();

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

    document.body.classList.add("duoc-si-sidebar-is-resizing");

    return () => {
      window.removeEventListener("pointermove", xuLyDiChuyenChuot);

      window.removeEventListener("pointerup", ketThucResize);

      document.body.classList.remove("duoc-si-sidebar-is-resizing");
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

  const xuLyDangXuat = () => {
    dangXuat();

    dongMenuMobile();
  };

  const chieuRongDangHienThi = daThuGon ? SIDEBAR_COLLAPSED_WIDTH : chieuRong;

  const tenDuocSi = nguoiDungDangNhap?.hoTen?.trim() || "Dược sĩ";

  return (
    <>
      <button
        type="button"
        className="duoc-si-mobile-menu-button"
        onClick={() => setMenuMobileDangMo(true)}
        aria-label="Mở menu Dược sĩ"
        title="Mở menu"
      >
        <i className="bi bi-list" />
      </button>

      {menuMobileDangMo && (
        <button
          type="button"
          className="duoc-si-sidebar-overlay"
          onClick={dongMenuMobile}
          aria-label="Đóng menu Dược sĩ"
        />
      )}

      <aside
        className={[
          "duoc-si-sidebar",
          daThuGon ? "duoc-si-sidebar-collapsed" : "",
          menuMobileDangMo ? "duoc-si-sidebar-mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          width: `${chieuRongDangHienThi}px`,
        }}
      >
        <div className="duoc-si-sidebar-header">
          <div className="duoc-si-sidebar-brand">
            <div className="duoc-si-sidebar-logo">
              <i className="bi bi-capsule-pill" />
            </div>

            {!daThuGon && (
              <div className="duoc-si-sidebar-brand-text">
                <strong>Pharma+</strong>

                <span>Dược sĩ</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="duoc-si-sidebar-collapse-button"
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
            className="duoc-si-sidebar-mobile-close"
            onClick={dongMenuMobile}
            aria-label="Đóng menu Dược sĩ"
            title="Đóng menu"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="duoc-si-sidebar-menu">
          {DANH_SACH_MENU.map((menu) => (
            <NavLink
              key={menu.duongDan}
              to={menu.duongDan}
              onClick={dongMenuMobile}
              title={daThuGon ? menu.nhan : undefined}
              className={({ isActive }) =>
                [
                  "duoc-si-menu-item",
                  isActive ? "duoc-si-menu-item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="duoc-si-menu-icon">
                <i className={`bi ${menu.icon}`} />
              </span>

              {!daThuGon && (
                <span className="duoc-si-menu-label">{menu.nhan}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="duoc-si-sidebar-footer">
          <div className="duoc-si-sidebar-user">
            <div className="duoc-si-sidebar-user-avatar">
              <i className="bi bi-person" />
            </div>

            {!daThuGon && (
              <div className="duoc-si-sidebar-user-info">
                <strong>{tenDuocSi}</strong>

                <span>Dược sĩ</span>
              </div>
            )}
          </div>

          <NavLink
            to="/"
            onClick={xuLyDangXuat}
            title={daThuGon ? "Đăng xuất" : undefined}
            className="duoc-si-menu-item"
          >
            <span className="duoc-si-menu-icon">
              <i className="bi bi-box-arrow-right" />
            </span>

            {!daThuGon && <span className="duoc-si-menu-label">Đăng xuất</span>}
          </NavLink>
        </div>

        {!daThuGon && (
          <div
            className={[
              "duoc-si-sidebar-resize-handle",
              dangResize ? "duoc-si-sidebar-resize-handle--active" : "",
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

export default DuocSiSidebar;
