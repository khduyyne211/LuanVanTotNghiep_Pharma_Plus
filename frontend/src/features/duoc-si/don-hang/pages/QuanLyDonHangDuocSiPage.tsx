import { useCallback, useEffect, useState } from "react";

import { isAxiosError } from "axios";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import DuocSiLoading from "../../shared/components/loading/DuocSiLoading";
import DuocSiXacNhan from "../../shared/components/xac-nhan/DuocSiXacNhan";

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

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  thongBao?: string;
};

type ThaoTacXacNhan = "TIEP_NHAN" | "HUY_DON" | null;

const dinhDangTien = (giaTri: number | null | undefined) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri ?? 0);

const dinhDangNgay = (giaTri: string | null | undefined) => {
  if (!giaTri) {
    return "—";
  }

  const ngay = new Date(giaTri);

  if (Number.isNaN(ngay.getTime())) {
    return giaTri;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(ngay);
};

const hienThiTrangThaiDonHang = (giaTri: TrangThaiDonHang) => {
  const nhan: Record<TrangThaiDonHang, string> = {
    CHO_XU_LY: "Chờ xử lý",
    DANG_XU_LY: "Đang xử lý",
    DANG_GIAO: "Đang giao",
    HOAN_THANH: "Hoàn thành",
    DA_HUY: "Đã hủy",
  };

  return nhan[giaTri];
};

const hienThiTrangThaiThanhToan = (giaTri: TrangThaiThanhToan) => {
  const nhan: Record<TrangThaiThanhToan, string> = {
    CHUA_THANH_TOAN: "Chưa thanh toán",

    CHO_THANH_TOAN: "Chờ thanh toán",

    DA_THANH_TOAN: "Đã thanh toán",

    THANH_TOAN_THAT_BAI: "Thanh toán thất bại",

    DA_HUY: "Đã hủy",
  };

  return nhan[giaTri];
};

const hienThiKiemDuyet = (giaTri: TrangThaiKiemDuyetDonHang) => {
  const nhan: Record<TrangThaiKiemDuyetDonHang, string> = {
    KHONG_CAN_DUYET: "Không cần duyệt",

    CHO_DUYET: "Chờ duyệt",

    DA_DUYET: "Đã duyệt",

    TU_CHOI: "Từ chối",
  };

  return nhan[giaTri];
};

function layThongBaoLoi(
  error: unknown,
  macDinh: string = "Không thể thực hiện thao tác.",
) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.thongBao ||
      error.response?.data?.message ||
      macDinh
    );
  }

  return macDinh;
}

function QuanLyDonHangDuocSiPage() {
  const thongBao = useThongBaoHeThong();

  const [danhSach, setDanhSach] = useState<DonHangDuocSiDanhSach[]>([]);

  const [dangTai, setDangTai] = useState(true);

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [keywordInput, setKeywordInput] = useState("");

  const [keyword, setKeyword] = useState("");

  const [trangThaiDonHang, setTrangThaiDonHang] = useState<
    TrangThaiDonHang | ""
  >("");

  const [trangThaiThanhToan, setTrangThaiThanhToan] = useState<
    TrangThaiThanhToan | ""
  >("");

  const [trangThaiKiemDuyet, setTrangThaiKiemDuyet] = useState<
    TrangThaiKiemDuyetDonHang | ""
  >("");

  const [chiTiet, setChiTiet] = useState<DonHangDuocSiChiTiet | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [dangXuLy, setDangXuLy] = useState(false);

  const [thaoTacChoXacNhan, setThaoTacChoXacNhan] =
    useState<ThaoTacXacNhan>(null);

  const taiDanhSach = useCallback(async () => {
    try {
      setDangTai(true);

      const data = await layDanhSachDonHangDuocSi({
        page,
        size,

        keyword: keyword || undefined,

        trangThaiDonHang: trangThaiDonHang || undefined,

        trangThaiThanhToan: trangThaiThanhToan || undefined,

        trangThaiKiemDuyet: trangThaiKiemDuyet || undefined,
      });

      setDanhSach(data.content);

      setTotalElements(data.totalElements);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi tải danh sách đơn hàng:", error);

      setDanhSach([]);
      setTotalElements(0);
      setTotalPages(0);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải danh sách đơn hàng."),
        "LOI",
        "Không thể tải dữ liệu",
      );
    } finally {
      setDangTai(false);
    }
  }, [
    page,
    size,
    keyword,
    trangThaiDonHang,
    trangThaiThanhToan,
    trangThaiKiemDuyet,
    thongBao.hienThongBao,
  ]);

  useEffect(() => {
    void taiDanhSach();
  }, [taiDanhSach]);

  const moChiTiet = async (maDonHang: number) => {
    try {
      setChiTiet(null);

      setDangTaiChiTiet(true);

      const data = await layChiTietDonHangDuocSi(maDonHang);

      setChiTiet(data);
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải chi tiết đơn hàng."),
        "LOI",
        "Không thể tải dữ liệu",
      );
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTiet = () => {
    if (dangXuLy) {
      return;
    }

    setChiTiet(null);

    setThaoTacChoXacNhan(null);
  };

  const sauKhiCapNhat = async (data: DonHangDuocSiChiTiet) => {
    setChiTiet(data);

    await taiDanhSach();
  };

  const moXacNhanTiepNhan = () => {
    if (!chiTiet) {
      return;
    }

    setThaoTacChoXacNhan("TIEP_NHAN");
  };

  const moXacNhanHuyDon = () => {
    if (!chiTiet) {
      return;
    }

    setThaoTacChoXacNhan("HUY_DON");
  };

  const dongXacNhan = () => {
    if (dangXuLy) {
      return;
    }

    setThaoTacChoXacNhan(null);
  };

  const tiepNhan = async () => {
    if (!chiTiet) {
      return;
    }

    try {
      setDangXuLy(true);

      const data = await tiepNhanDonHangDuocSi(chiTiet.maDonHang);

      setThaoTacChoXacNhan(null);

      await sauKhiCapNhat(data);

      thongBao.hienThongBao(
        `Đã tiếp nhận đơn hàng #${data.maDonHang}.`,
        "THANH_CONG",
        "Tiếp nhận thành công",
      );
    } catch (error) {
      console.error("Lỗi tiếp nhận đơn hàng:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tiếp nhận đơn hàng."),
        "LOI",
        "Tiếp nhận thất bại",
      );
    } finally {
      setDangXuLy(false);
    }
  };

  const capNhatTrangThai = async (trangThaiMoi: TrangThaiDonHang) => {
    if (!chiTiet) {
      return;
    }

    try {
      setDangXuLy(true);

      const data = await capNhatTrangThaiDonHangDuocSi(chiTiet.maDonHang, {
        trangThaiDonHang: trangThaiMoi,
      });

      await sauKhiCapNhat(data);

      thongBao.hienThongBao(
        `Đơn hàng #${data.maDonHang} đã chuyển sang "${hienThiTrangThaiDonHang(
          data.trangThaiDonHang,
        )}".`,
        "THANH_CONG",
        "Cập nhật trạng thái thành công",
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể cập nhật trạng thái đơn hàng."),
        "LOI",
        "Cập nhật thất bại",
      );
    } finally {
      setDangXuLy(false);
    }
  };

  const huyDon = async () => {
    if (!chiTiet) {
      return;
    }

    try {
      setDangXuLy(true);

      const data = await huyDonHangDuocSi(chiTiet.maDonHang);

      setThaoTacChoXacNhan(null);

      await sauKhiCapNhat(data);

      thongBao.hienThongBao(
        `Đã hủy đơn hàng #${data.maDonHang}.`,
        "THANH_CONG",
        "Hủy đơn hàng thành công",
      );
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể hủy đơn hàng."),
        "LOI",
        "Hủy đơn hàng thất bại",
      );
    } finally {
      setDangXuLy(false);
    }
  };

  const xacNhanThaoTac = () => {
    if (thaoTacChoXacNhan === "TIEP_NHAN") {
      void tiepNhan();

      return;
    }

    if (thaoTacChoXacNhan === "HUY_DON") {
      void huyDon();
    }
  };

  const coTheTiepNhan =
    chiTiet &&
    chiTiet.maNhanVienXuLy === null &&
    ((chiTiet.phuongThucThanhToan === "COD" &&
      chiTiet.trangThaiDonHang === "CHO_XU_LY" &&
      chiTiet.trangThaiThanhToan === "CHUA_THANH_TOAN") ||
      (chiTiet.phuongThucThanhToan === "ZALOPAY" &&
        chiTiet.trangThaiDonHang === "DANG_XU_LY" &&
        chiTiet.trangThaiThanhToan === "DA_THANH_TOAN"));

  const tieuDeXacNhan =
    thaoTacChoXacNhan === "HUY_DON"
      ? "Xác nhận hủy đơn hàng"
      : "Xác nhận tiếp nhận đơn hàng";

  const noiDungXacNhan = chiTiet
    ? thaoTacChoXacNhan === "HUY_DON"
      ? `Bạn có chắc muốn hủy đơn hàng #${chiTiet.maDonHang} không?`
      : `Bạn có chắc muốn tiếp nhận đơn hàng #${chiTiet.maDonHang} không?`
    : "";

  return (
    <div className="ds-dh-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <DuocSiXacNhan
        dangHien={thaoTacChoXacNhan !== null}
        tieuDe={tieuDeXacNhan}
        noiDung={noiDungXacNhan}
        nhanXacNhan={thaoTacChoXacNhan === "HUY_DON" ? "Hủy đơn" : "Tiếp nhận"}
        loai={thaoTacChoXacNhan === "HUY_DON" ? "NGUY_HIEM" : "BINH_THUONG"}
        dangXuLy={dangXuLy}
        onXacNhan={xacNhanThaoTac}
        onHuy={dongXacNhan}
      />

      <div className="ds-dh-header">
        <div>
          <h1>Quản lý đơn hàng</h1>

          <p>Tiếp nhận và cập nhật trạng thái đơn hàng của nhà thuốc.</p>
        </div>

        <strong>Tổng: {totalElements}</strong>
      </div>

      <div className="ds-dh-filter">
        <form
          onSubmit={(event) => {
            event.preventDefault();

            setPage(0);

            setKeyword(keywordInput.trim());
          }}
        >
          <input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Tìm mã đơn, khách hàng, số điện thoại"
          />

          <button type="submit">Tìm kiếm</button>
        </form>

        <select
          value={trangThaiDonHang}
          onChange={(event) => {
            setTrangThaiDonHang(event.target.value as TrangThaiDonHang | "");

            setPage(0);
          }}
        >
          <option value="">Tất cả trạng thái đơn</option>

          <option value="CHO_XU_LY">Chờ xử lý</option>

          <option value="DANG_XU_LY">Đang xử lý</option>

          <option value="DANG_GIAO">Đang giao</option>

          <option value="HOAN_THANH">Hoàn thành</option>

          <option value="DA_HUY">Đã hủy</option>
        </select>

        <select
          value={trangThaiThanhToan}
          onChange={(event) => {
            setTrangThaiThanhToan(
              event.target.value as TrangThaiThanhToan | "",
            );

            setPage(0);
          }}
        >
          <option value="">Tất cả thanh toán</option>

          <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>

          <option value="CHO_THANH_TOAN">Chờ thanh toán</option>

          <option value="DA_THANH_TOAN">Đã thanh toán</option>

          <option value="THANH_TOAN_THAT_BAI">Thanh toán thất bại</option>

          <option value="DA_HUY">Đã hủy</option>
        </select>

        <select
          value={trangThaiKiemDuyet}
          onChange={(event) => {
            setTrangThaiKiemDuyet(
              event.target.value as TrangThaiKiemDuyetDonHang | "",
            );

            setPage(0);
          }}
        >
          <option value="">Tất cả kiểm duyệt</option>

          <option value="KHONG_CAN_DUYET">Không cần duyệt</option>

          <option value="CHO_DUYET">Chờ duyệt</option>

          <option value="DA_DUYET">Đã duyệt</option>

          <option value="TU_CHOI">Từ chối</option>
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
                  <DuocSiLoading gon noiDung="Đang tải danh sách đơn hàng..." />
                </td>
              </tr>
            ) : danhSach.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có đơn hàng phù hợp.</td>
              </tr>
            ) : (
              danhSach.map((donHang) => (
                <tr key={donHang.maDonHang}>
                  <td>#{donHang.maDonHang}</td>

                  <td>
                    <strong>{donHang.tenKhachHang || "Khách vãng lai"}</strong>

                    <small>{donHang.soDienThoaiKhachHang || "—"}</small>
                  </td>

                  <td>{dinhDangNgay(donHang.ngayDatHang)}</td>

                  <td>{dinhDangTien(donHang.tongThanhToan)}</td>

                  <td>
                    {hienThiTrangThaiThanhToan(donHang.trangThaiThanhToan)}
                  </td>

                  <td>
                    <span
                      className={
                        `ds-dh-status ` +
                        `ds-dh-status--${donHang.trangThaiDonHang.toLowerCase()}`
                      }
                    >
                      {hienThiTrangThaiDonHang(donHang.trangThaiDonHang)}
                    </span>
                  </td>

                  <td>{donHang.tenNhanVienXuLy || "Chưa tiếp nhận"}</td>

                  <td>
                    <button
                      type="button"
                      className="ds-dh-link-button"
                      onClick={() => void moChiTiet(donHang.maDonHang)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ds-dh-pagination">
        <select
          value={size}
          onChange={(event) => {
            setSize(Number(event.target.value));

            setPage(0);
          }}
        >
          <option value={10}>10 / trang</option>

          <option value={20}>20 / trang</option>

          <option value={50}>50 / trang</option>
        </select>

        <span>
          Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page <= 0 || dangTai}
          onClick={() => setPage((giaTri) => Math.max(0, giaTri - 1))}
        >
          Trước
        </button>

        <button
          type="button"
          disabled={totalPages === 0 || page >= totalPages - 1 || dangTai}
          onClick={() => setPage((giaTri) => giaTri + 1)}
        >
          Sau
        </button>
      </div>

      {(chiTiet || dangTaiChiTiet) && (
        <div
          className="ds-dh-modal-overlay"
          onMouseDown={() => {
            if (!dangXuLy) {
              dongChiTiet();
            }
          }}
        >
          <div
            className="ds-dh-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {dangTaiChiTiet && !chiTiet ? (
              <DuocSiLoading noiDung="Đang tải chi tiết đơn hàng..." />
            ) : (
              chiTiet && (
                <>
                  <div className="ds-dh-modal-header">
                    <div>
                      <h2>Đơn hàng #{chiTiet.maDonHang}</h2>

                      <p>{dinhDangNgay(chiTiet.ngayDatHang)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={dongChiTiet}
                      disabled={dangXuLy}
                    >
                      ×
                    </button>
                  </div>

                  <div className="ds-dh-detail-grid">
                    <section>
                      <h3>Khách hàng</h3>

                      <p>{chiTiet.tenKhachHang || "Khách vãng lai"}</p>

                      <p>{chiTiet.soDienThoaiKhachHang || "—"}</p>
                    </section>

                    <section>
                      <h3>Giao hàng</h3>

                      <p>
                        {chiTiet.tenNguoiNhan || "—"}

                        {" - "}

                        {chiTiet.soDienThoaiNhan || "—"}
                      </p>

                      <p>
                        {[
                          chiTiet.diaChiChiTiet,
                          chiTiet.phuongKhuVuc,
                          chiTiet.thanhPho,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>
                    </section>

                    <section>
                      <h3>Xử lý</h3>

                      <p>
                        Trạng thái:{" "}
                        <strong>
                          {hienThiTrangThaiDonHang(chiTiet.trangThaiDonHang)}
                        </strong>
                      </p>

                      <p>
                        Dược sĩ: {chiTiet.tenNhanVienXuLy || "Chưa tiếp nhận"}
                      </p>

                      <p>
                        Kiểm duyệt:{" "}
                        {hienThiKiemDuyet(chiTiet.trangThaiKiemDuyet)}
                      </p>
                    </section>

                    <section>
                      <h3>Thanh toán</h3>

                      <p>Phương thức: {chiTiet.phuongThucThanhToan || "—"}</p>

                      <p>
                        Trạng thái:{" "}
                        {hienThiTrangThaiThanhToan(chiTiet.trangThaiThanhToan)}
                      </p>

                      <p>
                        Tổng thanh toán:{" "}
                        <strong>{dinhDangTien(chiTiet.tongThanhToan)}</strong>
                      </p>
                    </section>
                  </div>

                  {chiTiet.maDonThuoc && (
                    <section className="ds-dh-prescription">
                      <h3>Đơn thuốc</h3>

                      <p>Mã đơn thuốc: #{chiTiet.maDonThuoc}</p>

                      <p>Trạng thái: {chiTiet.trangThaiDonThuoc || "—"}</p>

                      {chiTiet.anhDonThuoc && (
                        <a
                          href={chiTiet.anhDonThuoc}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Xem ảnh đơn thuốc
                        </a>
                      )}
                    </section>
                  )}

                  <div className="ds-dh-products">
                    <h3>Sản phẩm</h3>

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
                        {chiTiet.danhSachChiTiet.map((sanPham) => (
                          <tr key={sanPham.maChiTietDonHang}>
                            <td>{sanPham.tenSanPham}</td>

                            <td>{sanPham.tenDonViTinh}</td>

                            <td>{sanPham.soLuong}</td>

                            <td>{dinhDangTien(sanPham.donGia)}</td>

                            <td>{dinhDangTien(sanPham.thanhTien)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="ds-dh-modal-actions">
                    {coTheTiepNhan && (
                      <button
                        type="button"
                        className="ds-dh-primary"
                        onClick={moXacNhanTiepNhan}
                        disabled={dangXuLy}
                      >
                        Tiếp nhận đơn
                      </button>
                    )}

                    {chiTiet.maNhanVienXuLy !== null &&
                      chiTiet.trangThaiDonHang === "DANG_XU_LY" && (
                        <button
                          type="button"
                          className="ds-dh-primary"
                          onClick={() => void capNhatTrangThai("DANG_GIAO")}
                          disabled={dangXuLy}
                        >
                          {dangXuLy ? "Đang xử lý..." : "Chuyển sang đang giao"}
                        </button>
                      )}

                    {chiTiet.maNhanVienXuLy !== null &&
                      chiTiet.trangThaiDonHang === "DANG_GIAO" && (
                        <button
                          type="button"
                          className="ds-dh-primary"
                          onClick={() => void capNhatTrangThai("HOAN_THANH")}
                          disabled={dangXuLy}
                        >
                          {dangXuLy ? "Đang xử lý..." : "Hoàn thành đơn"}
                        </button>
                      )}

                    {chiTiet.trangThaiDonHang === "CHO_XU_LY" && (
                      <button
                        type="button"
                        className="ds-dh-danger"
                        onClick={moXacNhanHuyDon}
                        disabled={dangXuLy}
                      >
                        Hủy đơn hàng
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={dongChiTiet}
                      disabled={dangXuLy}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyDonHangDuocSiPage;
