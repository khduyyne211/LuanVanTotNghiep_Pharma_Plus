import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logoPharma from "../../../assets/image/logo/pharma+.png";

import NutGioHang from "../../../features/customer/gio-hang/components/NutGioHang";
import NutTaiKhoan from "../../../features/xac-thuc/components/NutTaiKhoan";

import MenuKhachHangResponsive from "./MenuKhachHangResponsive";

import "./Header.css";

interface TrangThaiDieuHuongTimKiem {
  tuKhoaKhongCoKetQua?: string;
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tuKhoa, setTuKhoa] =
    useState("");

  const [
    dangMoMenuResponsive,
    setDangMoMenuResponsive,
  ] = useState(false);

  const trangThaiDieuHuong =
    location.state as TrangThaiDieuHuongTimKiem | null;

  const tuKhoaKhongCoKetQua =
    trangThaiDieuHuong
      ?.tuKhoaKhongCoKetQua;

  useEffect(() => {
    const tuKhoaTrenUrl =
      new URLSearchParams(
        location.search,
      ).get("tuKhoa");

    if (tuKhoaTrenUrl !== null) {
      setTuKhoa(tuKhoaTrenUrl);
      return;
    }

    const coThongTinTimKiemKhongKetQua =
      tuKhoaKhongCoKetQua
      !== undefined;

    if (
      coThongTinTimKiemKhongKetQua
    ) {
      setTuKhoa(
        tuKhoaKhongCoKetQua ?? "",
      );

      return;
    }

    setTuKhoa("");
  }, [
    location.pathname,
    location.search,
    tuKhoaKhongCoKetQua,
  ]);

  const xuLyTimKiem = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const tuKhoaDaChuanHoa =
      tuKhoa
        .trim()
        .replace(/\s+/g, " ");

    if (!tuKhoaDaChuanHoa) {
      return;
    }

    setTuKhoa(
      tuKhoaDaChuanHoa,
    );

    navigate(
      `/san-pham?tuKhoa=${encodeURIComponent(
        tuKhoaDaChuanHoa,
      )}`,
    );
  };

  return (
    <>
      <header className="customer-header">
        <div className="header-top">
          <div className="header-top-left">
            <span>Tư vấn ngay</span>
            <strong>
              0809.111.222
            </strong>
          </div>

          <div className="header-top-right">
            <span>
              Hệ thống nhà thuốc
              Pharma+
            </span>
          </div>
        </div>

        <div className="header-main">
          <button
            type="button"
            className="header-menu-responsive-button"
            aria-label="Mở menu"
            aria-expanded={
              dangMoMenuResponsive
            }
            onClick={() =>
              setDangMoMenuResponsive(
                true,
              )
            }
          >
            <i className="bi bi-list"></i>
          </button>

          <Link
            to="/"
            className="header-logo-image-wrap"
            aria-label="Trang chủ Pharma+"
          >
            <img
              className="header-logo-image"
              src={logoPharma}
              alt="Pharma+"
            />
          </Link>

          <div className="header-search-wrap">
            <form
              className="header-search"
              onSubmit={
                xuLyTimKiem
              }
            >
              <input
                type="search"
                value={tuKhoa}
                maxLength={100}
                placeholder="Tìm tên thuốc, bệnh lý, nhà sản xuất, hoạt chất..."
                aria-label="Nhập từ khóa tìm kiếm sản phẩm"
                onChange={(event) =>
                  setTuKhoa(
                    event.target.value,
                  )
                }
              />

              <button
                type="submit"
                className="header-search-button"
                aria-label="Tìm kiếm sản phẩm"
                title="Tìm kiếm"
              >
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <div className="header-actions">
            <NutTaiKhoan />
            <NutGioHang />
          </div>
        </div>
      </header>

      <MenuKhachHangResponsive
        dangMo={
          dangMoMenuResponsive
        }
        dongMenu={() =>
          setDangMoMenuResponsive(
            false,
          )
        }
      />
    </>
  );
}

export default Header;