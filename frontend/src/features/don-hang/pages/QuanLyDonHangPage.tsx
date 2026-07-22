import { useCallback, useEffect, useState } from "react";
import {
  layChiTietDonHang,
  layDanhSachDonHang,
} from "../api/donHangApi";
import DonHangChiTietModal from "../components/DonHangChiTietModal";
import TaoDonTaiQuayModal from "../components/TaoDonTaiQuayModal";
import type {
  DonHangChiTiet,
  DonHangDanhSach,
} from "../types/DonHang";
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

const hienThiTrangThai = (giaTri: string | null | undefined) =>
  (giaTri || "CHUA_CO").replaceAll("_", " ");

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
  const [trangThaiDonHang, setTrangThaiDonHang] = useState("");
  const [trangThaiThanhToan, setTrangThaiThanhToan] = useState("");
  const [trangThaiKiemDuyet, setTrangThaiKiemDuyet] = useState("");

  const [hienFormTaiQuay, setHienFormTaiQuay] = useState(false);
  const [chiTiet, setChiTiet] = useState<DonHangChiTiet | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);
  const [thongBao, setThongBao] = useState("");

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
      console.error(error);
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
      console.error(error);
      alert("Không thể tải chi tiết đơn hàng");
      setDangTaiChiTiet(false);
      return;
    }

    setDangTaiChiTiet(false);
  };

  const taoThanhCong = (donHang: DonHangChiTiet) => {
    setHienFormTaiQuay(false);
    setThongBao(`Đã tạo thành công đơn hàng #${donHang.maDonHang}`);
    setChiTiet(donHang);
    setPage(0);
    void taiDanhSach();

    window.setTimeout(() => setThongBao(""), 3500);
  };

  return (
    <div className="dh-page">
      <header className="dh-page-header">
        <div>
          <h1>Quản lý đơn hàng</h1>
          <span>
            Theo dõi đơn online và tạo đơn trực tiếp cho khách tại quầy
          </span>
        </div>

        <button
          className="dh-button dh-button-primary"
          onClick={() => setHienFormTaiQuay(true)}
        >
          <i className="bi bi-plus-lg" />
          Tạo đơn tại quầy
        </button>
      </header>

      {thongBao && (
        <div className="dh-success-message">
          <i className="bi bi-check-circle-fill" />
          {thongBao}
        </div>
      )}

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
            {danhSachDonHang.filter((don) => don.coThuocKeDon).length}
          </strong>
          <i className="bi bi-prescription2" />
        </div>
        <div className="dh-summary-card">
          <span>Khách vãng lai</span>
          <strong>
            {
              danhSachDonHang.filter(
                (don) => don.loaiKhach === "VANG_LAI"
              ).length
            }
          </strong>
          <i className="bi bi-person-walking" />
        </div>
      </section>

      <section className="dh-panel">
        <div className="dh-filter-row">
          <div className="dh-search-box dh-list-search">
            <i className="bi bi-search" />
            <input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") timKiem();
              }}
              placeholder="Mã đơn, tên hoặc số điện thoại..."
            />
            <button type="button" onClick={timKiem}>
              Tìm
            </button>
          </div>

          <select
            value={trangThaiDonHang}
            onChange={(event) => {
              setTrangThaiDonHang(event.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả trạng thái đơn</option>
            <option value="CHO_XU_LY">Chờ xử lý</option>
            <option value="DANG_XU_LY">Đang xử lý</option>
            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
            <option value="DANG_GIAO">Đang giao</option>
            <option value="HOAN_THANH">Hoàn thành</option>
            <option value="DA_HUY">Đã hủy</option>
          </select>

          <select
            value={trangThaiThanhToan}
            onChange={(event) => {
              setTrangThaiThanhToan(event.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả thanh toán</option>
            <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
            <option value="DA_THANH_TOAN">Đã thanh toán</option>
          </select>

          <select
            value={trangThaiKiemDuyet}
            onChange={(event) => {
              setTrangThaiKiemDuyet(event.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả kiểm duyệt</option>
            <option value="KHONG_CAN_DUYET">Không cần duyệt</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_TU_VAN">Đang tư vấn</option>
            <option value="DA_DUYET">Đã duyệt</option>
            <option value="TU_CHOI">Từ chối</option>
          </select>

          <button
            className="dh-button dh-button-ghost"
            onClick={xoaBoLoc}
          >
            <i className="bi bi-arrow-counterclockwise" />
            Xóa lọc
          </button>
        </div>

        {loi && <div className="dh-error-message">{loi}</div>}

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
                    Đang tải dữ liệu...
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
                      <small>{hienThiTrangThai(donHang.loaiKhach)}</small>
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
                        className={`dh-badge dh-badge-${(
                          donHang.trangThaiThanhToan || ""
                        ).toLowerCase()}`}
                      >
                        {hienThiTrangThai(
                          donHang.trangThaiThanhToan
                        )}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`dh-badge dh-badge-${donHang.trangThaiDonHang.toLowerCase()}`}
                      >
                        {hienThiTrangThai(
                          donHang.trangThaiDonHang
                        )}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`dh-badge dh-badge-${donHang.trangThaiKiemDuyet.toLowerCase()}`}
                      >
                        {hienThiTrangThai(
                          donHang.trangThaiKiemDuyet
                        )}
                      </span>
                    </td>
                    <td>
                      <button
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

        <div className="dh-pagination">
          <div>
            <span>Hiển thị</span>
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(0);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>trên {totalElements} đơn</span>
          </div>

          <div className="dh-pagination-actions">
            <button
              disabled={first}
              onClick={() => setPage((giaTri) => Math.max(0, giaTri - 1))}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <span>
              Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
            </span>
            <button
              disabled={last}
              onClick={() => setPage((giaTri) => giaTri + 1)}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </section>

      {hienFormTaiQuay && (
        <TaoDonTaiQuayModal
          onDong={() => setHienFormTaiQuay(false)}
          onTaoThanhCong={taoThanhCong}
        />
      )}

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
