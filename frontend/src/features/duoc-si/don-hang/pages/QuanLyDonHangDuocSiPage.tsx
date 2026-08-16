import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  capNhatTrangThaiDonHangDuocSi,
  huyDonHangDuocSi,
  layChiTietDonHangDuocSi,
  layDanhSachDonHangDuocSi,
  tiepNhanDonHangDuocSi,
} from "../api/donHangDuocSiApi";

import type {
  DonHangDuocSiChiTiet,
  DonHangDuocSiDanhSach,
  TrangThaiDonHang,
  TrangThaiKiemDuyetDonHang,
  TrangThaiThanhToan,
} from "../types/DonHangDuocSi";

import "../styles/QuanLyDonHangDuocSi.css";

const dinhDangTien = (
  giaTri: number | null | undefined,
) =>
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
    },
  ).format(giaTri ?? 0);

const dinhDangNgay = (
  giaTri: string | null | undefined,
) => {
  if (!giaTri) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(
    new Date(giaTri),
  );
};

const hienThiTrangThaiDonHang = (
  giaTri: TrangThaiDonHang,
) => {
  const nhan: Record<
    TrangThaiDonHang,
    string
  > = {
    CHO_XU_LY: "Chờ xử lý",
    DANG_XU_LY: "Đang xử lý",
    DANG_GIAO: "Đang giao",
    HOAN_THANH: "Hoàn thành",
    DA_HUY: "Đã hủy",
  };

  return nhan[giaTri];
};

const hienThiTrangThaiThanhToan = (
  giaTri: TrangThaiThanhToan,
) => {
  const nhan: Record<
    TrangThaiThanhToan,
    string
  > = {
    CHUA_THANH_TOAN: "Chưa thanh toán",
    CHO_THANH_TOAN: "Chờ thanh toán",
    DA_THANH_TOAN: "Đã thanh toán",
    THANH_TOAN_THAT_BAI: "Thanh toán thất bại",
    DA_HUY: "Đã hủy",
  };

  return nhan[giaTri];
};

const hienThiKiemDuyet = (
  giaTri: TrangThaiKiemDuyetDonHang,
) => {
  const nhan: Record<
    TrangThaiKiemDuyetDonHang,
    string
  > = {
    KHONG_CAN_DUYET: "Không cần duyệt",
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    TU_CHOI: "Từ chối",
  };

  return nhan[giaTri];
};

const layThongBaoLoi = (
  error: unknown,
) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (
      data
      &&
      typeof data === "object"
      &&
      "message" in data
      &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  return "Không thể thực hiện thao tác.";
};

function QuanLyDonHangDuocSiPage() {
  const [
    danhSach,
    setDanhSach,
  ] = useState<DonHangDuocSiDanhSach[]>([]);

  const [
    dangTai,
    setDangTai,
  ] = useState(true);

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    size,
    setSize,
  ] = useState(10);

  const [
    totalElements,
    setTotalElements,
  ] = useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [
    keywordInput,
    setKeywordInput,
  ] = useState("");

  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    trangThaiDonHang,
    setTrangThaiDonHang,
  ] = useState<TrangThaiDonHang | "">("");

  const [
    trangThaiThanhToan,
    setTrangThaiThanhToan,
  ] = useState<TrangThaiThanhToan | "">("");

  const [
    trangThaiKiemDuyet,
    setTrangThaiKiemDuyet,
  ] =
    useState<TrangThaiKiemDuyetDonHang | "">("");

  const [
    chiTiet,
    setChiTiet,
  ] =
    useState<DonHangDuocSiChiTiet | null>(
      null,
    );

  const [
    dangTaiChiTiet,
    setDangTaiChiTiet,
  ] = useState(false);

  const [
    dangXuLy,
    setDangXuLy,
  ] = useState(false);

  const taiDanhSach =
    useCallback(
      async () => {
        try {
          setDangTai(true);

          const data =
            await layDanhSachDonHangDuocSi({
              page,
              size,
              keyword:
                keyword || undefined,
              trangThaiDonHang:
                trangThaiDonHang || undefined,
              trangThaiThanhToan:
                trangThaiThanhToan || undefined,
              trangThaiKiemDuyet:
                trangThaiKiemDuyet || undefined,
            });

          setDanhSach(data.content);
          setTotalElements(
            data.totalElements,
          );
          setTotalPages(
            data.totalPages,
          );
        } catch (error) {
          console.error(
            "Lỗi tải danh sách đơn hàng:",
            error,
          );

          alert(
            layThongBaoLoi(error),
          );
        } finally {
          setDangTai(false);
        }
      },
      [
        page,
        size,
        keyword,
        trangThaiDonHang,
        trangThaiThanhToan,
        trangThaiKiemDuyet,
      ],
    );

  useEffect(
    () => {
      void taiDanhSach();
    },
    [taiDanhSach],
  );

  const moChiTiet =
    async (
      maDonHang: number,
    ) => {
      try {
        setDangTaiChiTiet(true);

        const data =
          await layChiTietDonHangDuocSi(
            maDonHang,
          );

        setChiTiet(data);
      } catch (error) {
        alert(
          layThongBaoLoi(error),
        );
      } finally {
        setDangTaiChiTiet(false);
      }
    };

  const sauKhiCapNhat =
    async (
      data: DonHangDuocSiChiTiet,
    ) => {
      setChiTiet(data);
      await taiDanhSach();
    };

  const tiepNhan =
    async () => {
      if (!chiTiet) {
        return;
      }

      if (
        !window.confirm(
          `Tiếp nhận đơn #${chiTiet.maDonHang}?`,
        )
      ) {
        return;
      }

      try {
        setDangXuLy(true);

        const data =
          await tiepNhanDonHangDuocSi(
            chiTiet.maDonHang,
          );

        await sauKhiCapNhat(data);
      } catch (error) {
        alert(
          layThongBaoLoi(error),
        );
      } finally {
        setDangXuLy(false);
      }
    };

  const capNhatTrangThai =
    async (
      trangThaiMoi: TrangThaiDonHang,
    ) => {
      if (!chiTiet) {
        return;
      }

      try {
        setDangXuLy(true);

        const data =
          await capNhatTrangThaiDonHangDuocSi(
            chiTiet.maDonHang,
            {
              trangThaiDonHang:
                trangThaiMoi,
            },
          );

        await sauKhiCapNhat(data);
      } catch (error) {
        alert(
          layThongBaoLoi(error),
        );
      } finally {
        setDangXuLy(false);
      }
    };

  const huyDon =
    async () => {
      if (!chiTiet) {
        return;
      }

      if (
        !window.confirm(
          `Xác nhận hủy đơn #${chiTiet.maDonHang}?`,
        )
      ) {
        return;
      }

      try {
        setDangXuLy(true);

        const data =
          await huyDonHangDuocSi(
            chiTiet.maDonHang,
          );

        await sauKhiCapNhat(data);
      } catch (error) {
        alert(
          layThongBaoLoi(error),
        );
      } finally {
        setDangXuLy(false);
      }
    };

  const coTheTiepNhan =
    chiTiet
    &&
    chiTiet.maNhanVienXuLy === null
    &&
    (
      (
        chiTiet.phuongThucThanhToan
          === "COD"
        &&
        chiTiet.trangThaiDonHang
          === "CHO_XU_LY"
        &&
        chiTiet.trangThaiThanhToan
          === "CHUA_THANH_TOAN"
      )
      ||
      (
        chiTiet.phuongThucThanhToan
          === "ZALOPAY"
        &&
        chiTiet.trangThaiDonHang
          === "DANG_XU_LY"
        &&
        chiTiet.trangThaiThanhToan
          === "DA_THANH_TOAN"
      )
    );

  return (
    <div className="ds-dh-page">
      <div className="ds-dh-header">
        <div>
          <h1>
            Quản lý đơn hàng
          </h1>

          <p>
            Tiếp nhận và cập nhật trạng thái
            đơn hàng của nhà thuốc.
          </p>
        </div>

        <strong>
          Tổng: {totalElements}
        </strong>
      </div>

      <div className="ds-dh-filter">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPage(0);
            setKeyword(
              keywordInput.trim(),
            );
          }}
        >
          <input
            value={keywordInput}
            onChange={(event) =>
              setKeywordInput(
                event.target.value,
              )
            }
            placeholder="Tìm mã đơn, khách hàng, số điện thoại"
          />

          <button type="submit">
            Tìm kiếm
          </button>
        </form>

        <select
          value={trangThaiDonHang}
          onChange={(event) => {
            setTrangThaiDonHang(
              event.target
                .value as TrangThaiDonHang | "",
            );
            setPage(0);
          }}
        >
          <option value="">
            Tất cả trạng thái đơn
          </option>
          <option value="CHO_XU_LY">
            Chờ xử lý
          </option>
          <option value="DANG_XU_LY">
            Đang xử lý
          </option>
          <option value="DANG_GIAO">
            Đang giao
          </option>
          <option value="HOAN_THANH">
            Hoàn thành
          </option>
          <option value="DA_HUY">
            Đã hủy
          </option>
        </select>

        <select
          value={trangThaiThanhToan}
          onChange={(event) => {
            setTrangThaiThanhToan(
              event.target
                .value as TrangThaiThanhToan | "",
            );
            setPage(0);
          }}
        >
          <option value="">
            Tất cả thanh toán
          </option>
          <option value="CHUA_THANH_TOAN">
            Chưa thanh toán
          </option>
          <option value="CHO_THANH_TOAN">
            Chờ thanh toán
          </option>
          <option value="DA_THANH_TOAN">
            Đã thanh toán
          </option>
          <option value="THANH_TOAN_THAT_BAI">
            Thanh toán thất bại
          </option>
          <option value="DA_HUY">
            Đã hủy
          </option>
        </select>

        <select
          value={trangThaiKiemDuyet}
          onChange={(event) => {
            setTrangThaiKiemDuyet(
              event.target
                .value as TrangThaiKiemDuyetDonHang | "",
            );
            setPage(0);
          }}
        >
          <option value="">
            Tất cả kiểm duyệt
          </option>
          <option value="KHONG_CAN_DUYET">
            Không cần duyệt
          </option>
          <option value="CHO_DUYET">
            Chờ duyệt
          </option>
          <option value="DA_DUYET">
            Đã duyệt
          </option>
          <option value="TU_CHOI">
            Từ chối
          </option>
        </select>
      </div>

      <div className="ds-dh-table-wrap">
        <table className="ds-dh-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Dược sĩ xử lý</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan={8}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSach.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            ) : (
              danhSach.map(
                (donHang) => (
                  <tr
                    key={
                      donHang.maDonHang
                    }
                  >
                    <td>
                      #{donHang.maDonHang}
                    </td>

                    <td>
                      <strong>
                        {
                          donHang.tenKhachHang
                          || "Khách vãng lai"
                        }
                      </strong>
                      <small>
                        {
                          donHang.soDienThoaiKhachHang
                          || "—"
                        }
                      </small>
                    </td>

                    <td>
                      {
                        dinhDangNgay(
                          donHang.ngayDatHang,
                        )
                      }
                    </td>

                    <td>
                      {
                        dinhDangTien(
                          donHang.tongThanhToan,
                        )
                      }
                    </td>

                    <td>
                      {
                        hienThiTrangThaiThanhToan(
                          donHang.trangThaiThanhToan,
                        )
                      }
                    </td>

                    <td>
                      <span
                        className={
                          `ds-dh-status ds-dh-status--${donHang.trangThaiDonHang.toLowerCase()}`
                        }
                      >
                        {
                          hienThiTrangThaiDonHang(
                            donHang.trangThaiDonHang,
                          )
                        }
                      </span>
                    </td>

                    <td>
                      {
                        donHang.tenNhanVienXuLy
                        || "Chưa tiếp nhận"
                      }
                    </td>

                    <td>
                      <button
                        type="button"
                        className="ds-dh-link-button"
                        onClick={() =>
                          void moChiTiet(
                            donHang.maDonHang,
                          )
                        }
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="ds-dh-pagination">
        <select
          value={size}
          onChange={(event) => {
            setSize(
              Number(
                event.target.value,
              ),
            );
            setPage(0);
          }}
        >
          <option value={10}>
            10 / trang
          </option>
          <option value={20}>
            20 / trang
          </option>
          <option value={50}>
            50 / trang
          </option>
        </select>

        <span>
          Trang {
            totalPages === 0
              ? 0
              : page + 1
          } / {totalPages}
        </span>

        <button
          type="button"
          disabled={page <= 0}
          onClick={() =>
            setPage(
              (giaTri) =>
                Math.max(
                  0,
                  giaTri - 1,
                ),
            )
          }
        >
          Trước
        </button>

        <button
          type="button"
          disabled={
            totalPages === 0
            ||
            page >= totalPages - 1
          }
          onClick={() =>
            setPage(
              (giaTri) =>
                giaTri + 1,
            )
          }
        >
          Sau
        </button>
      </div>

      {(chiTiet || dangTaiChiTiet) && (
        <div
          className="ds-dh-modal-overlay"
          onMouseDown={() => {
            if (!dangXuLy) {
              setChiTiet(null);
            }
          }}
        >
          <div
            className="ds-dh-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {dangTaiChiTiet && !chiTiet ? (
              <p>
                Đang tải chi tiết...
              </p>
            ) : chiTiet && (
              <>
                <div className="ds-dh-modal-header">
                  <div>
                    <h2>
                      Đơn hàng #
                      {chiTiet.maDonHang}
                    </h2>

                    <p>
                      {
                        dinhDangNgay(
                          chiTiet.ngayDatHang,
                        )
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setChiTiet(null)
                    }
                    disabled={dangXuLy}
                  >
                    ×
                  </button>
                </div>

                <div className="ds-dh-detail-grid">
                  <section>
                    <h3>
                      Khách hàng
                    </h3>
                    <p>
                      {
                        chiTiet.tenKhachHang
                        || "Khách vãng lai"
                      }
                    </p>
                    <p>
                      {
                        chiTiet.soDienThoaiKhachHang
                        || "—"
                      }
                    </p>
                  </section>

                  <section>
                    <h3>
                      Giao hàng
                    </h3>
                    <p>
                      {
                        chiTiet.tenNguoiNhan
                        || "—"
                      }
                      {" - "}
                      {
                        chiTiet.soDienThoaiNhan
                        || "—"
                      }
                    </p>
                    <p>
                      {
                        [
                          chiTiet.diaChiChiTiet,
                          chiTiet.phuongKhuVuc,
                          chiTiet.thanhPho,
                        ]
                          .filter(Boolean)
                          .join(", ")
                        || "—"
                      }
                    </p>
                  </section>

                  <section>
                    <h3>
                      Xử lý
                    </h3>
                    <p>
                      Trạng thái:{" "}
                      <strong>
                        {
                          hienThiTrangThaiDonHang(
                            chiTiet.trangThaiDonHang,
                          )
                        }
                      </strong>
                    </p>
                    <p>
                      Dược sĩ:{" "}
                      {
                        chiTiet.tenNhanVienXuLy
                        || "Chưa tiếp nhận"
                      }
                    </p>
                    <p>
                      Kiểm duyệt:{" "}
                      {
                        hienThiKiemDuyet(
                          chiTiet.trangThaiKiemDuyet,
                        )
                      }
                    </p>
                  </section>

                  <section>
                    <h3>
                      Thanh toán
                    </h3>
                    <p>
                      Phương thức:{" "}
                      {
                        chiTiet.phuongThucThanhToan
                        || "—"
                      }
                    </p>
                    <p>
                      Trạng thái:{" "}
                      {
                        hienThiTrangThaiThanhToan(
                          chiTiet.trangThaiThanhToan,
                        )
                      }
                    </p>
                    <p>
                      Tổng thanh toán:{" "}
                      <strong>
                        {
                          dinhDangTien(
                            chiTiet.tongThanhToan,
                          )
                        }
                      </strong>
                    </p>
                  </section>
                </div>

                {chiTiet.maDonThuoc && (
                  <section className="ds-dh-prescription">
                    <h3>
                      Đơn thuốc
                    </h3>
                    <p>
                      Mã đơn thuốc: #
                      {chiTiet.maDonThuoc}
                    </p>
                    <p>
                      Trạng thái:{" "}
                      {
                        chiTiet.trangThaiDonThuoc
                        || "—"
                      }
                    </p>

                    {chiTiet.anhDonThuoc && (
                      <a
                        href={
                          chiTiet.anhDonThuoc
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Xem ảnh đơn thuốc
                      </a>
                    )}
                  </section>
                )}

                <div className="ds-dh-products">
                  <h3>
                    Sản phẩm
                  </h3>

                  <table>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn vị</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        chiTiet.danhSachChiTiet.map(
                          (sanPham) => (
                            <tr
                              key={
                                sanPham.maChiTietDonHang
                              }
                            >
                              <td>
                                {
                                  sanPham.tenSanPham
                                }
                              </td>
                              <td>
                                {
                                  sanPham.tenDonViTinh
                                }
                              </td>
                              <td>
                                {
                                  sanPham.soLuong
                                }
                              </td>
                              <td>
                                {
                                  dinhDangTien(
                                    sanPham.donGia,
                                  )
                                }
                              </td>
                              <td>
                                {
                                  dinhDangTien(
                                    sanPham.thanhTien,
                                  )
                                }
                              </td>
                            </tr>
                          ),
                        )
                      }
                    </tbody>
                  </table>
                </div>

                <div className="ds-dh-modal-actions">
                  {coTheTiepNhan && (
                    <button
                      type="button"
                      className="ds-dh-primary"
                      onClick={() =>
                        void tiepNhan()
                      }
                      disabled={dangXuLy}
                    >
                      Tiếp nhận đơn
                    </button>
                  )}

                  {
                    chiTiet.maNhanVienXuLy !== null
                    &&
                    chiTiet.trangThaiDonHang
                      === "DANG_XU_LY"
                    &&
                    (
                      <button
                        type="button"
                        className="ds-dh-primary"
                        onClick={() =>
                          void capNhatTrangThai(
                            "DANG_GIAO",
                          )
                        }
                        disabled={dangXuLy}
                      >
                        Chuyển sang đang giao
                      </button>
                    )
                  }

                  {
                    chiTiet.maNhanVienXuLy !== null
                    &&
                    chiTiet.trangThaiDonHang
                      === "DANG_GIAO"
                    &&
                    (
                      <button
                        type="button"
                        className="ds-dh-primary"
                        onClick={() =>
                          void capNhatTrangThai(
                            "HOAN_THANH",
                          )
                        }
                        disabled={dangXuLy}
                      >
                        Hoàn thành đơn
                      </button>
                    )
                  }

                  {
                    chiTiet.trangThaiDonHang
                      === "CHO_XU_LY"
                    &&
                    (
                      <button
                        type="button"
                        className="ds-dh-danger"
                        onClick={() =>
                          void huyDon()
                        }
                        disabled={dangXuLy}
                      >
                        Hủy đơn hàng
                      </button>
                    )
                  }

                  <button
                    type="button"
                    onClick={() =>
                      setChiTiet(null)
                    }
                    disabled={dangXuLy}
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyDonHangDuocSiPage;
