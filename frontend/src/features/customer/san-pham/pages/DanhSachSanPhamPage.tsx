import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import BoLocSanPham, {
  type NhomBoLocResponsive,
} from "../../san-pham/components/BoLocSanPham";

import ThanhSapXepSanPham from "../../san-pham/components/ThanhSapXepSanPham";
import ThanhBoLocDangChon from "../../san-pham/components/ThanhBoLocDangChon";
import BangSanPham from "../../san-pham/components/BangSanPham";
import NutXemThem from "../../san-pham/components/NutXemThem";
import ThongBaoKhongCoSanPham from "../../san-pham/components/ThongBaoKhongCoSanPham";

import { useSanPham } from "../../san-pham/hooks/useSanPham";

import KhuDieuHuongDanhMuc from "../../danh-muc/components/KhuDieuHuongDanhMuc";

import "../../san-pham/styles/SanPham.css";

function SanPhamPage() {
  const navigate = useNavigate();

  const { maDanhMuc } = useParams();

  const [searchParams] =
    useSearchParams();

  const [
    dangMoBoLocResponsive,
    setDangMoBoLocResponsive,
  ] = useState(false);

  const [
    nhomBoLocResponsive,
    setNhomBoLocResponsive,
  ] =
    useState<NhomBoLocResponsive>(
      "TAT_CA",
    );

  const tuKhoa =
    searchParams
      .get("tuKhoa")
      ?.trim()
    || undefined;

  const maDanhMucDangChon =
    maDanhMuc
      ? Number(maDanhMuc)
      : undefined;

  const sanPham =
    useSanPham({
      tuKhoa,
      maDanhMuc:
        maDanhMucDangChon,
    });

  const khongCoBoLocDangChon =
    sanPham
      .danhSachBoLocDangChon
      .length === 0;

  const laTimKiemKhongCoKetQua =
    Boolean(tuKhoa)
    && maDanhMucDangChon === undefined
    && khongCoBoLocDangChon
    && sanPham.daTaiXongYeuCauHienTai
    && sanPham.khongCoSanPham;

  /*
   * Nếu tìm kiếm bằng từ khóa nhưng
   * không có kết quả:
   *
   * quay về trang chủ để Header
   * có thể hiển thị lại từ khóa
   * khách vừa tìm.
   */
  useEffect(() => {
    if (
      !laTimKiemKhongCoKetQua
    ) {
      return;
    }

    navigate(
      "/",
      {
        replace: true,
        state: {
          tuKhoaKhongCoKetQua:
            tuKhoa,
        },
      },
    );
  }, [
    laTimKiemKhongCoKetQua,
    tuKhoa,
    navigate,
  ]);

  /*
   * Khi bottom sheet bộ lọc
   * đang mở thì khóa scroll body.
   */
  useEffect(() => {
    if (
      !dangMoBoLocResponsive
    ) {
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
  }, [
    dangMoBoLocResponsive,
  ]);

  const moBoLocResponsive = (
    nhom: NhomBoLocResponsive,
  ) => {
    setNhomBoLocResponsive(
      nhom,
    );

    setDangMoBoLocResponsive(
      true,
    );
  };

  const dongBoLocResponsive = () => {
    setDangMoBoLocResponsive(
      false,
    );
  };

  return (
    <div className="page-container trang-san-pham">
      <KhuDieuHuongDanhMuc
        maDanhMucDangChon={
          maDanhMucDangChon
        }
      />

      <div className="khung-san-pham">
        <BoLocSanPham
          boLocDuoi100={
            sanPham.boLocDuoi100
          }
          boLocTu100Den300={
            sanPham.boLocTu100Den300
          }
          boLocTu300Den500={
            sanPham.boLocTu300Den500
          }
          boLocTren500={
            sanPham.boLocTren500
          }
          chonNhaSanXuat={
            sanPham.chonNhaSanXuat
          }
          dangMoResponsive={
            dangMoBoLocResponsive
          }
          nhomDangMoResponsive={
            nhomBoLocResponsive
          }
          dongBoLocResponsive={
            dongBoLocResponsive
          }
        />

        <div className="khu-vuc-san-pham">
          <div className="dau-trang-san-pham">
            <h2 className="tieu-de-san-pham">
              Danh sách sản phẩm
            </h2>

            <div className="thanh-bo-loc-responsive">
              <button
                type="button"
                className="bo-loc-responsive-nut bo-loc-responsive-nut--chinh"
                onClick={() =>
                  moBoLocResponsive(
                    "TAT_CA",
                  )
                }
              >
                <i className="bi bi-sliders"></i>

                <span>Lọc</span>

                {sanPham
                  .danhSachBoLocDangChon
                  .length > 0 && (
                  <span className="bo-loc-responsive-so-luong">
                    {
                      sanPham
                        .danhSachBoLocDangChon
                        .length
                    }
                  </span>
                )}
              </button>

              <button
                type="button"
                className="bo-loc-responsive-nut"
                onClick={() =>
                  moBoLocResponsive(
                    "GIA_BAN",
                  )
                }
              >
                <span>
                  Giá bán
                </span>

                <i className="bi bi-chevron-down"></i>
              </button>

              <button
                type="button"
                className="bo-loc-responsive-nut"
                onClick={() =>
                  moBoLocResponsive(
                    "NHA_SAN_XUAT",
                  )
                }
              >
                <span>
                  Nhà sản xuất
                </span>

                <i className="bi bi-chevron-down"></i>
              </button>
            </div>

            <ThanhSapXepSanPham
              sapXep={
                sanPham.sapXep
              }
              setSapXep={
                sanPham.setSapXep
              }
            />
          </div>

          <p className="ghi-chu-san-pham">
            Lưu ý: Thuốc kê đơn và một số
            sản phẩm sẽ cần tư vấn từ dược sĩ
          </p>

          <ThanhBoLocDangChon
            danhSachBoLocDangChon={
              sanPham
                .danhSachBoLocDangChon
            }
            xoaTatCaBoLoc={
              sanPham.xoaTatCaBoLoc
            }
          />

          {sanPham.dangTaiDuLieu && (
            <div className="dang-tai-san-pham">
              Đang tải sản phẩm...
            </div>
          )}

          {sanPham.khongCoSanPham
            && !laTimKiemKhongCoKetQua && (
              <ThongBaoKhongCoSanPham />
            )}

          {!sanPham.dangTaiDuLieu
            && !sanPham.khongCoSanPham && (
              <>
                <BangSanPham
                  danhSachSanPham={
                    sanPham
                      .danhSachDangHienThi
                  }
                />

                <p className="san-pham-so-luong-hien-thi">
                  Đang hiển thị{" "}
                  {
                    sanPham
                      .danhSachDangHienThi
                      .length
                  }
                  {" / "}
                  {
                    sanPham
                      .tongSoPhanTu
                  }{" "}
                  sản phẩm
                </p>

                <NutXemThem
                  conSanPhamDeXemThem={
                    sanPham
                      .conSanPhamDeXemThem
                  }
                  xemThemSanPham={
                    sanPham
                      .xemThemSanPham
                  }
                  dangTaiThem={
                    sanPham
                      .dangTaiThem
                  }
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default SanPhamPage;