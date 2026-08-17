import {
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

import type {
  VoucherDaApDung,
  VoucherKhachHang,
} from "../types/VoucherDonHang";

import "../styles/ChonVoucherGioHang.css";

interface ChonVoucherGioHangProps {
  danhSachVoucher: VoucherKhachHang[];
  voucherDaApDung: VoucherDaApDung | null;
  maGiamGiaDangNhap: string;
  dangMoDanhSachVoucher: boolean;
  dangTaiDanhSach: boolean;
  dangApDung: boolean;
  loiVoucher: string;

  thayDoiMaGiamGia: (
    giaTri: string,
  ) => void;

  moDanhSachVoucher: () => void;
  dongDanhSachVoucher: () => void;

  apDungVoucher: () => void;

  apDungVoucherTheoMaVoucher: (
    maVoucher: number,
  ) => void;

  boVoucher: () => void;
}

function dinhDangTien(
  soTien: number,
) {
  return (
    soTien.toLocaleString("vi-VN") +
    "đ"
  );
}

function dinhDangGiaTriGiam(
  voucher: VoucherKhachHang,
) {
  if (
    voucher.loaiGiamGia ===
    "PHAN_TRAM"
  ) {
    return `Giảm ${voucher.giaTriGiam.toLocaleString(
      "vi-VN",
      {
        maximumFractionDigits: 2,
      },
    )}%`;
  }

  return `Giảm ${dinhDangTien(
    voucher.giaTriGiam,
  )}`;
}

function dinhDangHanSuDung(
  thoiGianKetThuc: string,
) {
  const ngay = new Date(
    thoiGianKetThuc,
  );

  if (
    Number.isNaN(
      ngay.getTime(),
    )
  ) {
    return thoiGianKetThuc;
  }

  return ngay.toLocaleDateString(
    "vi-VN",
  );
}

function ChonVoucherGioHang({
  danhSachVoucher,
  voucherDaApDung,
  maGiamGiaDangNhap,
  dangMoDanhSachVoucher,
  dangTaiDanhSach,
  dangApDung,
  loiVoucher,
  thayDoiMaGiamGia,
  moDanhSachVoucher,
  dongDanhSachVoucher,
  apDungVoucher,
  apDungVoucherTheoMaVoucher,
  boVoucher,
}: ChonVoucherGioHangProps) {
  const coVoucherDuDieuKien =
    danhSachVoucher.some(
      (voucher) =>
        voucher.duDieuKien,
    );

  /*
   * Khi popup voucher mở:
   * khóa cuộn body để tránh trang phía sau
   * tiếp tục cuộn.
   */
  useEffect(() => {
    if (!dangMoDanhSachVoucher) {
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
  }, [dangMoDanhSachVoucher]);

  const popupVoucher =
    dangMoDanhSachVoucher &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="voucher-gio-hang-lop-phu"
            role="presentation"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                dongDanhSachVoucher();
              }
            }}
          >
            <section
              className="voucher-gio-hang-hop-thoai"
              role="dialog"
              aria-modal="true"
              aria-label="Chọn voucher"
            >
              <div className="voucher-gio-hang-tieu-de">
                <h3>
                  Chọn voucher
                </h3>

                <button
                  type="button"
                  className="voucher-gio-hang-nut-dong"
                  onClick={
                    dongDanhSachVoucher
                  }
                  disabled={
                    dangApDung
                  }
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {dangTaiDanhSach ? (
                <p className="voucher-gio-hang-trang-thai">
                  Đang kiểm tra voucher...
                </p>
              ) : (
                <>
                  {danhSachVoucher.length ===
                  0 ? (
                    <p className="voucher-gio-hang-trang-thai">
                      Hiện chưa có voucher
                      còn hiệu lực.
                    </p>
                  ) : (
                    <div className="voucher-gio-hang-danh-sach">
                      {danhSachVoucher.map(
                        (voucher) => {
                          const dangDuocApDung =
                            voucherDaApDung
                              ?.maVoucher ===
                            voucher.maVoucher;

                          return (
                            <article
                              key={
                                voucher.maVoucher
                              }
                              className={`voucher-gio-hang-the ${
                                voucher.duDieuKien
                                  ? "du-dieu-kien"
                                  : "chua-du-dieu-kien"
                              } ${
                                dangDuocApDung
                                  ? "dang-duoc-ap-dung"
                                  : ""
                              }`}
                            >
                              <div className="voucher-gio-hang-the-noi-dung">
                                <strong>
                                  {
                                    voucher.tenVoucher
                                  }
                                </strong>

                                <span>
                                  {dinhDangGiaTriGiam(
                                    voucher,
                                  )}

                                  {voucher.loaiGiamGia ===
                                    "PHAN_TRAM" &&
                                  voucher.soTienGiamToiDa !==
                                    null
                                    ? `, tối đa ${dinhDangTien(
                                        voucher.soTienGiamToiDa,
                                      )}`
                                    : ""}
                                </span>

                                <span>
                                  Đơn tối thiểu{" "}
                                  {dinhDangTien(
                                    voucher.donGiaToiThieu,
                                  )}
                                </span>

                                <span>
                                  HSD:{" "}
                                  {dinhDangHanSuDung(
                                    voucher.thoiGianKetThuc,
                                  )}
                                </span>

                                {voucher.duDieuKien &&
                                  voucher.soTienGiamDuKien >
                                    0 && (
                                    <span className="voucher-gio-hang-giam-du-kien">
                                      Giảm dự kiến{" "}
                                      {dinhDangTien(
                                        voucher.soTienGiamDuKien,
                                      )}
                                    </span>
                                  )}
                              </div>

                              <div className="voucher-gio-hang-the-trang-thai">
                                {voucher.duDieuKien ? (
                                  <>
                                    <span className="voucher-gio-hang-du-dieu-kien">
                                      Đủ điều kiện
                                    </span>

                                    <label
                                      className="voucher-gio-hang-radio"
                                      htmlFor={`voucher-${voucher.maVoucher}`}
                                    >
                                      <input
                                        id={`voucher-${voucher.maVoucher}`}
                                        type="radio"
                                        name="voucher-gio-hang"
                                        checked={
                                          dangDuocApDung
                                        }
                                        disabled={
                                          dangApDung
                                        }
                                        onChange={() =>
                                          apDungVoucherTheoMaVoucher(
                                            voucher.maVoucher,
                                          )
                                        }
                                      />

                                      <span>
                                        {dangDuocApDung
                                          ? "Đang áp dụng"
                                          : "Chọn"}
                                      </span>
                                    </label>
                                  </>
                                ) : (
                                  <>
                                    <span className="voucher-gio-hang-chua-du-dieu-kien">
                                      Chưa đủ điều kiện
                                    </span>

                                    <small>
                                      Cần mua thêm{" "}
                                      {dinhDangTien(
                                        voucher.soTienConThieu,
                                      )}
                                    </small>
                                  </>
                                )}
                              </div>
                            </article>
                          );
                        },
                      )}
                    </div>
                  )}

                  {danhSachVoucher.length >
                    0 &&
                    !coVoucherDuDieuKien && (
                      <p className="voucher-gio-hang-thong-bao-khong-du">
                        Giỏ hàng hiện chưa
                        đủ điều kiện áp dụng
                        các voucher đang có.
                      </p>
                    )}

                  <div className="voucher-gio-hang-nhap-ma">
                    <label htmlFor="ma-voucher-gio-hang">
                      Bạn có mã voucher riêng?
                    </label>

                    <p className="voucher-gio-hang-goi-y-ma">
                      Nhập mã voucher để
                      kiểm tra và áp dụng.
                    </p>

                    <div className="voucher-gio-hang-nhap-ma-hang">
                      <input
                        id="ma-voucher-gio-hang"
                        type="text"
                        value={
                          maGiamGiaDangNhap
                        }
                        onChange={(
                          event,
                        ) =>
                          thayDoiMaGiamGia(
                            event.target
                              .value,
                          )
                        }
                        onKeyDown={(
                          event,
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();

                            apDungVoucher();
                          }
                        }}
                        placeholder="Nhập mã voucher"
                        maxLength={50}
                        disabled={
                          dangApDung
                        }
                      />

                      <button
                        type="button"
                        onClick={
                          apDungVoucher
                        }
                        disabled={
                          dangApDung
                        }
                      >
                        {dangApDung
                          ? "Đang áp dụng..."
                          : "Áp dụng"}
                      </button>
                    </div>
                  </div>

                  {loiVoucher && (
                    <p className="voucher-gio-hang-loi">
                      {
                        loiVoucher
                      }
                    </p>
                  )}
                </>
              )}
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="voucher-gio-hang-khu-vuc">
        <div className="voucher-gio-hang-ben-trai">
          <i className="bi bi-ticket-perforated"></i>

          <div>
            <span className="voucher-gio-hang-nhan">
              Voucher
            </span>

            {voucherDaApDung && (
              <span className="voucher-gio-hang-da-ap-dung">
                {
                  voucherDaApDung.maGiamGia
                }
              </span>
            )}
          </div>
        </div>

        <div className="voucher-gio-hang-thao-tac">
          <button
            type="button"
            className="voucher-gio-hang-nut-chon"
            onClick={
              moDanhSachVoucher
            }
          >
            {voucherDaApDung
              ? "Đổi voucher"
              : "Chọn voucher"}
          </button>

          {voucherDaApDung && (
            <button
              type="button"
              className="voucher-gio-hang-nut-bo"
              onClick={
                boVoucher
              }
            >
              Bỏ
            </button>
          )}
        </div>
      </div>

      {popupVoucher}
    </>
  );
}

export default ChonVoucherGioHang;