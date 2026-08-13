import { useCallback, useEffect, useState } from "react";

import { layChiTietDonHang, layDanhSachDonHang } from "../api/donHangApi";

import DonHangChiTietModal from "../components/DonHangChiTietModal";

import type {
  DonHangChiTiet,
  DonHangDanhSach,
  TrangThaiDonHang,
  TrangThaiKiemDuyetDonHang,
  TrangThaiThanhToan,
} from "../types/DonHang";

import AdminLoading from "../../shared/components/loading/AdminLoading";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import PhanTrangQuanLy from "../../shared/components/quan-ly/PhanTrangQuanLy";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import "../../shared/styles/quan-ly/QuanLyCommon.css";
import "../styles/DonHang.css";

const dinhDangTien = (giaTri: number | null | undefined) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri ?? 0);

const dinhDangNgay = (giaTri: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(giaTri));

const hienThiLoaiKhach = (giaTri: string | null | undefined) => {
  switch (giaTri) {
    case "CO_TAI_KHOAN":
      return "Có tài khoản";

    case "VANG_LAI":
      return "Khách vãng lai";

    default:
      return "Chưa xác định";
  }
};

const hienThiTrangThaiThanhToan = (
  giaTri: TrangThaiThanhToan | null | undefined,
) => {
  switch (giaTri) {
    case "CHUA_THANH_TOAN":
      return "Chưa thanh toán";

    case "CHO_THANH_TOAN":
      return "Chờ thanh toán";

    case "DA_THANH_TOAN":
      return "Đã thanh toán";

    case "THANH_TOAN_THAT_BAI":
      return "Thanh toán thất bại";

    case "DA_HUY":
      return "Đã hủy";

    default:
      return "Chưa xác định";
  }
};

const hienThiTrangThaiDonHang = (
  giaTri: TrangThaiDonHang | null | undefined,
) => {
  switch (giaTri) {
    case "CHO_XU_LY":
      return "Chờ xử lý";

    case "DANG_XU_LY":
      return "Đang xử lý";

    case "DANG_GIAO":
      return "Đang giao";

    case "HOAN_THANH":
      return "Hoàn thành";

    case "DA_HUY":
      return "Đã hủy";

    default:
      return "Chưa xác định";
  }
};

const hienThiTrangThaiKiemDuyet = (
  giaTri: TrangThaiKiemDuyetDonHang | null | undefined,
) => {
  switch (giaTri) {
    case "KHONG_CAN_DUYET":
      return "Không cần duyệt";

    case "CHO_DUYET":
      return "Chờ duyệt";

    case "DA_DUYET":
      return "Đã duyệt";

    case "TU_CHOI":
      return "Từ chối";

    default:
      return "Chưa xác định";
  }
};

export default function QuanLyDonHangPage() {
  const [danhSachDonHang, setDanhSachDonHang] = useState<DonHangDanhSach[]>([]);

  const [dangTai, setDangTai] = useState(true);

  const [loi, setLoi] = useState("");

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [first, setFirst] = useState(true);

  const [last, setLast] = useState(true);

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

  const [chiTiet, setChiTiet] = useState<DonHangChiTiet | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const taiDanhSach = useCallback(async () => {
    try {
      setDangTai(true);
      setLoi("");

      const data = await layDanhSachDonHang({
        page,
        size,
        keyword: keyword || undefined,
        trangThaiDonHang: trangThaiDonHang || undefined,
        trangThaiThanhToan: trangThaiThanhToan || undefined,
        trangThaiKiemDuyet: trangThaiKiemDuyet || undefined,
      });

      setDanhSachDonHang(data.content);

      setTotalElements(data.totalElements);

      setTotalPages(data.totalPages);

      setFirst(data.first);
      setLast(data.last);
    } catch (error) {
      console.error("Không thể tải danh sách đơn hàng:", error);

      setDanhSachDonHang([]);
      setTotalElements(0);
      setTotalPages(0);
      setFirst(true);
      setLast(true);

      setLoi("Không thể tải danh sách đơn hàng");
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
  ]);

  useEffect(() => {
    void taiDanhSach();
  }, [taiDanhSach]);

  const timKiem = () => {
    setPage(0);

    setKeyword(keywordInput.trim());
  };

  const xoaBoLoc = () => {
    setKeywordInput("");
    setKeyword("");

    setTrangThaiDonHang("");
    setTrangThaiThanhToan("");
    setTrangThaiKiemDuyet("");

    setPage(0);
  };

  const moChiTiet = async (maDonHang: number) => {
    try {
      setDangTaiChiTiet(true);
      setChiTiet(null);

      const data = await layChiTietDonHang(maDonHang);

      setChiTiet(data);
    } catch (error) {
      console.error("Không thể tải chi tiết đơn hàng:", error);

      alert("Không thể tải chi tiết đơn hàng");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const thanhCongCu = (
    <div className="dh-filter-row">
      <div className="dh-search-box dh-list-search">
        <i className="bi bi-search" />

        <input
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              timKiem();
            }
          }}
          placeholder="Mã đơn, tên hoặc số điện thoại..."
        />

        <button type="button" onClick={timKiem}>
          Tìm
        </button>
      </div>

      <select
        className="ql-filter-control"
        value={trangThaiDonHang}
        onChange={(event) => {
          setTrangThaiDonHang(event.target.value as TrangThaiDonHang | "");

          setPage(0);
        }}
      >
        <option value="">Tất cả trạng thái</option>

        <option value="CHO_XU_LY">Chờ xử lý</option>

        <option value="DANG_XU_LY">Đang xử lý</option>

        <option value="DANG_GIAO">Đang giao</option>

        <option value="HOAN_THANH">Hoàn thành</option>

        <option value="DA_HUY">Đã hủy</option>
      </select>

      <select
        className="ql-filter-control"
        value={trangThaiThanhToan}
        onChange={(event) => {
          setTrangThaiThanhToan(event.target.value as TrangThaiThanhToan | "");

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
        className="ql-filter-control"
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

      <button
        type="button"
        className="ql-button ql-button-ghost"
        onClick={xoaBoLoc}
      >
        <i className="bi bi-arrow-counterclockwise" />
        Xóa lọc
      </button>
    </div>
  );

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý đơn hàng"
        moTa="Theo dõi và quản lý các đơn hàng trong hệ thống"
      />

      <section className="dh-summary-grid">
        <div className="dh-summary-card">
          <span>Tổng đơn hàng</span>

          <strong>{totalElements}</strong>

          <i className="bi bi-receipt-cutoff" />
        </div>

        <div className="dh-summary-card">
          <span>Đơn trên trang</span>

          <strong>{danhSachDonHang.length}</strong>

          <i className="bi bi-list-check" />
        </div>

        <div className="dh-summary-card">
          <span>Đơn kê đơn</span>

          <strong>
            {danhSachDonHang.filter((donHang) => donHang.coThuocKeDon).length}
          </strong>

          <i className="bi bi-prescription2" />
        </div>

        <div className="dh-summary-card">
          <span>Khách vãng lai</span>

          <strong>
            {
              danhSachDonHang.filter(
                (donHang) => donHang.loaiKhach === "VANG_LAI",
              ).length
            }
          </strong>

          <i className="bi bi-person-walking" />
        </div>
      </section>

      <KhungDanhSachQuanLy
        thanhCongCu={thanhCongCu}
        thongBaoLoi={loi}
        phanTrang={
          <PhanTrangQuanLy
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            first={first}
            last={last}
            tenDonVi="đơn"
            onDoiTrang={setPage}
            onDoiKichThuoc={(kichThuocMoi) => {
              setSize(kichThuocMoi);

              setPage(0);
            }}
          />
        }
      >
        <div className="dh-table-wrapper">
          <table className="dh-table">
            <thead>
              <tr>
                <th>Mã đơn</th>

                <th>Khách hàng</th>

                <th>Ngày tạo</th>

                <th>Tổng tiền</th>

                <th>Thanh toán</th>

                <th>Đơn hàng</th>

                <th>Kiểm duyệt</th>

                <th />
              </tr>
            </thead>

            <tbody>
              {dangTai ? (
                <tr>
                  <td colSpan={8} className="dh-table-message">
                    <AdminLoading noiDung="Đang tải danh sách đơn hàng..." />
                  </td>
                </tr>
              ) : danhSachDonHang.length === 0 ? (
                <tr>
                  <td colSpan={8} className="dh-table-message">
                    Chưa có đơn hàng phù hợp
                  </td>
                </tr>
              ) : (
                danhSachDonHang.map((donHang) => (
                  <tr key={donHang.maDonHang}>
                    <td>
                      <strong>#{donHang.maDonHang}</strong>

                      <small>{hienThiLoaiKhach(donHang.loaiKhach)}</small>
                    </td>

                    <td>
                      <strong>
                        {donHang.tenKhachHang || "Khách vãng lai"}
                      </strong>

                      <small>
                        {donHang.soDienThoaiKhachHang || "Không có SĐT"}
                      </small>
                    </td>

                    <td>{dinhDangNgay(donHang.ngayDatHang)}</td>

                    <td>
                      <strong>{dinhDangTien(donHang.tongThanhToan)}</strong>

                      {donHang.coThuocKeDon && (
                        <small className="dh-prescription-text">
                          Thuốc kê đơn
                        </small>
                      )}
                    </td>

                    <td>
                      <span
                        className={`dh-badge dh-badge-${donHang.trangThaiThanhToan.toLowerCase()}`}
                      >
                        {hienThiTrangThaiThanhToan(donHang.trangThaiThanhToan)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`dh-badge dh-badge-${donHang.trangThaiDonHang.toLowerCase()}`}
                      >
                        {hienThiTrangThaiDonHang(donHang.trangThaiDonHang)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`dh-badge dh-badge-${donHang.trangThaiKiemDuyet.toLowerCase()}`}
                      >
                        {hienThiTrangThaiKiemDuyet(donHang.trangThaiKiemDuyet)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="dh-table-action"
                        onClick={() => void moChiTiet(donHang.maDonHang)}
                        title="Xem chi tiết"
                      >
                        <i className="bi bi-eye" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </KhungDanhSachQuanLy>

      <DonHangChiTietModal
        donHang={chiTiet}
        dangTai={dangTaiChiTiet}
        onDong={() => {
          setChiTiet(null);
          setDangTaiChiTiet(false);
        }}
      />
    </div>
  );
}
