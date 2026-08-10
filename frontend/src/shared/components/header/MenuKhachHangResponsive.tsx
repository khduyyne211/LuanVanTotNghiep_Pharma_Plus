import {
  useEffect,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDanhMucSanPham } from "../../../features/khach-hang/danh-muc/hooks/useDanhMucSanPham";
import { useXacThucContext } from "../../../features/xac-thuc/context/XacThucContext";
import { taoSlug } from "../../utils/taoSlug";

interface MenuKhachHangResponsiveProps {
  dangMo: boolean;
  dongMenu: () => void;
}

function MenuKhachHangResponsive({
  dangMo,
  dongMenu,
}: MenuKhachHangResponsiveProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { danhSachDanhMuc } =
    useDanhMucSanPham();

  const {
    nguoiDungDangNhap,
    daDangNhap,
    moHopThoaiDangNhap,
    dangXuat,
  } = useXacThucContext();

  const [
    maDanhMucDangMo,
    setMaDanhMucDangMo,
  ] = useState<number | null>(null);

  useEffect(() => {
    if (!dangMo) {
      return;
    }

    const overflowCu =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        overflowCu;
    };
  }, [dangMo]);

  useEffect(() => {
    dongMenu();
    setMaDanhMucDangMo(null);
  }, [
    location.pathname,
    location.search,
  ]);

  if (!dangMo) {
    return null;
  }

  const chuyenTrang = (
    duongDan: string,
  ) => {
    dongMenu();
    navigate(duongDan);
  };

  const chuyenDenDanhMuc = (
    maDanhMuc: number,
    tenDanhMuc: string,
  ) => {
    chuyenTrang(
      `/danh-muc/${maDanhMuc}/${taoSlug(
        tenDanhMuc,
      )}`,
    );
  };

  const xuLyDangNhap = () => {
    dongMenu();
    moHopThoaiDangNhap();
  };

  const xuLyDangXuat = () => {
    dongMenu();
    dangXuat();
    navigate("/");
  };

  const batTatDanhMucCon = (
    maDanhMuc: number,
  ) => {
    setMaDanhMucDangMo(
      (maHienTai) =>
        maHienTai === maDanhMuc
          ? null
          : maDanhMuc,
    );
  };

  return (
    <div
      className="menu-khach-hang-responsive-overlay"
      onMouseDown={dongMenu}
    >
      <aside
        className="menu-khach-hang-responsive"
        role="dialog"
        aria-modal="true"
        aria-label="Menu khách hàng"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="menu-khach-hang-responsive-header">
          <strong>Menu</strong>

          <button
            type="button"
            className="menu-khach-hang-responsive-dong"
            onClick={dongMenu}
            aria-label="Đóng menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="menu-khach-hang-responsive-noi-dung">
          <section className="menu-khach-hang-responsive-tai-khoan">
            {!daDangNhap ? (
              <button
                type="button"
                className="menu-khach-hang-responsive-dang-nhap"
                onClick={xuLyDangNhap}
              >
                <i className="bi bi-person-circle"></i>

                <span>Đăng nhập</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="menu-khach-hang-responsive-nguoi-dung"
                  onClick={() =>
                    chuyenTrang(
                      "/tai-khoan",
                    )
                  }
                >
                  <span className="menu-khach-hang-responsive-avatar">
                    <i className="bi bi-person-fill"></i>
                  </span>

                  <span className="menu-khach-hang-responsive-thong-tin">
                    <small>
                      Tài khoản
                    </small>

                    <strong>
                      {nguoiDungDangNhap?.hoTen}
                    </strong>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

                <div className="menu-khach-hang-responsive-danh-sach-tai-khoan">
                  <button
                    type="button"
                    onClick={() =>
                      chuyenTrang(
                        "/tai-khoan",
                      )
                    }
                  >
                    <i className="bi bi-person"></i>
                    <span>
                      Thông tin cá nhân
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      chuyenTrang(
                        "/tai-khoan/don-hang",
                      )
                    }
                  >
                    <i className="bi bi-box-seam"></i>
                    <span>
                      Đơn hàng của tôi
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      chuyenTrang(
                        "/tai-khoan/so-dia-chi",
                      )
                    }
                  >
                    <i className="bi bi-geo-alt"></i>
                    <span>
                      Sổ địa chỉ nhận hàng
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      chuyenTrang(
                        "/tai-khoan/yeu-cau-tu-van",
                      )
                    }
                  >
                    <i className="bi bi-chat-left-text"></i>
                    <span>
                      Yêu cầu tư vấn
                    </span>
                  </button>

                  <button
                    type="button"
                    className="menu-khach-hang-responsive-dang-xuat"
                    onClick={xuLyDangXuat}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="menu-khach-hang-responsive-danh-muc">
            <h3>
              Danh mục sản phẩm
            </h3>

            <div className="menu-khach-hang-responsive-danh-sach-danh-muc">
              {danhSachDanhMuc.map(
                (danhMuc) => {
                  const coDanhMucCon =
                    danhMuc
                      .danhSachDanhMucCon
                      .length > 0;

                  const dangMoDanhMucCon =
                    maDanhMucDangMo
                    === danhMuc.maDanhMuc;

                  return (
                    <div
                      className="menu-khach-hang-responsive-danh-muc-item"
                      key={
                        danhMuc.maDanhMuc
                      }
                    >
                      <div className="menu-khach-hang-responsive-danh-muc-cha">
                        <button
                          type="button"
                          className="menu-khach-hang-responsive-danh-muc-ten"
                          onClick={() =>
                            chuyenDenDanhMuc(
                              danhMuc.maDanhMuc,
                              danhMuc.tenDanhMuc,
                            )
                          }
                        >
                          {
                            danhMuc.tenDanhMuc
                          }
                        </button>

                        {coDanhMucCon && (
                          <button
                            type="button"
                            className="menu-khach-hang-responsive-mo-danh-muc"
                            aria-label={
                              dangMoDanhMucCon
                                ? "Thu gọn danh mục"
                                : "Mở danh mục con"
                            }
                            aria-expanded={
                              dangMoDanhMucCon
                            }
                            onClick={() =>
                              batTatDanhMucCon(
                                danhMuc.maDanhMuc,
                              )
                            }
                          >
                            <i
                              className={
                                dangMoDanhMucCon
                                  ? "bi bi-chevron-up"
                                  : "bi bi-chevron-down"
                              }
                            ></i>
                          </button>
                        )}
                      </div>

                      {coDanhMucCon
                        && dangMoDanhMucCon && (
                          <div className="menu-khach-hang-responsive-danh-muc-con">
                            {danhMuc.danhSachDanhMucCon.map(
                              (
                                danhMucCon,
                              ) => (
                                <button
                                  type="button"
                                  key={
                                    danhMucCon.maDanhMuc
                                  }
                                  onClick={() =>
                                    chuyenDenDanhMuc(
                                      danhMucCon.maDanhMuc,
                                      danhMucCon.tenDanhMuc,
                                    )
                                  }
                                >
                                  {
                                    danhMucCon.tenDanhMuc
                                  }
                                </button>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  );
                },
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default MenuKhachHangResponsive;