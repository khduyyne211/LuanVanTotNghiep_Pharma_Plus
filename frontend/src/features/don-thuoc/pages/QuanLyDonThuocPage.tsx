import { useCallback, useEffect, useState } from "react";

import {
  duyetDonThuoc,
  layChiTietDonThuoc,
  layDanhSachDonThuoc,
  tuChoiDonThuoc,
} from "../api/donThuocApi";
import type {
  DonThuoc,
  TrangThaiDonThuoc,
} from "../types/DonThuoc";

const MA_NHAN_VIEN_DUYET_TAM_THOI = 2;

function QuanLyDonThuocPage() {
  const [danhSachDonThuoc, setDanhSachDonThuoc] = useState<
    DonThuoc[]
  >([]);
  const [dangTaiDanhSach, setDangTaiDanhSach] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] =
    useState<TrangThaiDonThuoc>("");

  const [donThuocChiTiet, setDonThuocChiTiet] =
    useState<DonThuoc | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [ghiChuDuocSi, setGhiChuDuocSi] = useState("");
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [dangKiemDuyet, setDangKiemDuyet] = useState(false);

  const taiDanhSachDonThuoc = useCallback(async () => {
    try {
      setDangTaiDanhSach(true);

      const data = await layDanhSachDonThuoc({
        page,
        size,
        keyword,
        trangThai,
      });

      setDanhSachDonThuoc(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setFirst(data.first);
      setLast(data.last);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn thuốc:", error);
      alert("Không thể tải danh sách đơn thuốc");
    } finally {
      setDangTaiDanhSach(false);
    }
  }, [page, size, keyword, trangThai]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void taiDanhSachDonThuoc();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [taiDanhSachDonThuoc]);

  const timKiem = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  const xoaBoLoc = () => {
    setKeywordInput("");
    setKeyword("");
    setTrangThai("");
    setPage(0);
  };

  const xemChiTiet = async (maDonThuoc: number) => {
    try {
      setDangTaiChiTiet(true);
      setDonThuocChiTiet(null);

      const data = await layChiTietDonThuoc(maDonThuoc);

      setDonThuocChiTiet(data);
      setGhiChuDuocSi(data.ghiChuDuocSi ?? "");
      setLyDoTuChoi(data.lyDoTuChoi ?? "");
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn thuốc:", error);
      alert("Không thể tải chi tiết đơn thuốc");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTiet = () => {
    setDonThuocChiTiet(null);
    setGhiChuDuocSi("");
    setLyDoTuChoi("");
  };

  const xuLyDuyet = async () => {
    if (!donThuocChiTiet) {
      return;
    }

    const dongY = confirm("Xác nhận duyệt đơn thuốc này?");
    if (!dongY) {
      return;
    }

    try {
      setDangKiemDuyet(true);

      const data = await duyetDonThuoc(
        donThuocChiTiet.maDonThuoc,
        {
          maNhanVienDuyet: MA_NHAN_VIEN_DUYET_TAM_THOI,
          ghiChuDuocSi: ghiChuDuocSi.trim() || null,
        }
      );

      setDonThuocChiTiet(data);
      await taiDanhSachDonThuoc();
      alert("Duyệt đơn thuốc thành công");
    } catch (error) {
      console.error("Lỗi khi duyệt đơn thuốc:", error);
      alert("Duyệt đơn thuốc thất bại");
    } finally {
      setDangKiemDuyet(false);
    }
  };

  const xuLyTuChoi = async () => {
    if (!donThuocChiTiet) {
      return;
    }

    if (!lyDoTuChoi.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    const dongY = confirm("Xác nhận từ chối đơn thuốc này?");
    if (!dongY) {
      return;
    }

    try {
      setDangKiemDuyet(true);

      const data = await tuChoiDonThuoc(
        donThuocChiTiet.maDonThuoc,
        {
          maNhanVienDuyet: MA_NHAN_VIEN_DUYET_TAM_THOI,
          ghiChuDuocSi: ghiChuDuocSi.trim() || null,
          lyDoTuChoi: lyDoTuChoi.trim(),
        }
      );

      setDonThuocChiTiet(data);
      await taiDanhSachDonThuoc();
      alert("Từ chối đơn thuốc thành công");
    } catch (error) {
      console.error("Lỗi khi từ chối đơn thuốc:", error);
      alert("Từ chối đơn thuốc thất bại");
    } finally {
      setDangKiemDuyet(false);
    }
  };

  const dinhDangNgayGio = (giaTri: string) => {
    return new Date(giaTri).toLocaleString("vi-VN");
  };

  const hienThiTrangThai = (giaTri: string) => {
    if (giaTri === "CHO_DUYET") {
      return "Chờ duyệt";
    }

    if (giaTri === "DA_DUYET") {
      return "Đã duyệt";
    }

    if (giaTri === "TU_CHOI") {
      return "Từ chối";
    }

    return giaTri;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý đơn thuốc</h1>
          <p>
            Dược sĩ xem ảnh đơn thuốc, kiểm tra thông tin và
            cập nhật kết quả kiểm duyệt.
          </p>
        </div>
      </div>

      <div className="filter-panel">
        <div className="form-group">
          <label>Tìm khách hàng</label>
          <input
            type="text"
            value={keywordInput}
            onChange={(event) =>
              setKeywordInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                timKiem();
              }
            }}
            placeholder="Tên, email hoặc số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <select
            value={trangThai}
            onChange={(event) => {
              setTrangThai(
                event.target.value as TrangThaiDonThuoc
              );
              setPage(0);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DA_DUYET">Đã duyệt</option>
            <option value="TU_CHOI">Từ chối</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số dòng</label>
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
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="primary-button"
            onClick={timKiem}
          >
            Tìm kiếm
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={xoaBoLoc}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <p>Tổng số đơn thuốc: {totalElements}</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Liên hệ</th>
            <th>Ngày tải lên</th>
            <th>Trạng thái</th>
            <th>Nhân viên duyệt</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {dangTaiDanhSach ? (
            <tr>
              <td colSpan={7} className="empty-cell">
                Đang tải danh sách đơn thuốc...
              </td>
            </tr>
          ) : (
            danhSachDonThuoc.map((donThuoc) => (
              <tr key={donThuoc.maDonThuoc}>
                <td>{donThuoc.maDonThuoc}</td>

                <td>
                  <strong>{donThuoc.tenKhachHang}</strong>
                </td>

                <td>
                  <div>{donThuoc.emailKhachHang}</div>
                  <div>{donThuoc.soDienThoaiKhachHang}</div>
                </td>

                <td>
                  {dinhDangNgayGio(donThuoc.ngayUpload)}
                </td>

                <td>
                  {hienThiTrangThai(
                    donThuoc.trangThaiDonThuoc
                  )}
                </td>

                <td>
                  {donThuoc.tenNhanVienDuyet ||
                    "Chưa có người duyệt"}
                </td>

                <td>
                  <button
                    type="button"
                    className="small-button"
                    onClick={() =>
                      void xemChiTiet(donThuoc.maDonThuoc)
                    }
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}

          {!dangTaiDanhSach &&
            danhSachDonThuoc.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-cell">
                  Không có đơn thuốc phù hợp.
                </td>
              </tr>
            )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          type="button"
          className="secondary-button"
          disabled={first}
          onClick={() => setPage(page - 1)}
        >
          Trang trước
        </button>

        <span>
          Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
        </span>

        <button
          type="button"
          className="secondary-button"
          disabled={last}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>

      {dangTaiChiTiet && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p>Đang tải chi tiết đơn thuốc...</p>
          </div>
        </div>
      )}

      {donThuocChiTiet && !dangTaiChiTiet && (
        <div className="modal-overlay">
          <div className="modal-card product-detail-modal">
            <div className="modal-header">
              <div>
                <h2>
                  Chi tiết đơn thuốc #
                  {donThuocChiTiet.maDonThuoc}
                </h2>
                <p>{donThuocChiTiet.tenKhachHang}</p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={dongChiTiet}
              >
                ×
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <span>Email</span>
                <strong>
                  {donThuocChiTiet.emailKhachHang}
                </strong>
              </div>

              <div>
                <span>Số điện thoại</span>
                <strong>
                  {donThuocChiTiet.soDienThoaiKhachHang}
                </strong>
              </div>

              <div>
                <span>Ngày tải lên</span>
                <strong>
                  {dinhDangNgayGio(
                    donThuocChiTiet.ngayUpload
                  )}
                </strong>
              </div>

              <div>
                <span>Trạng thái</span>
                <strong>
                  {hienThiTrangThai(
                    donThuocChiTiet.trangThaiDonThuoc
                  )}
                </strong>
              </div>

              <div>
                <span>Nhân viên duyệt</span>
                <strong>
                  {donThuocChiTiet.tenNhanVienDuyet ||
                    "Chưa có"}
                </strong>
              </div>

              <div>
                <span>Kết quả kiểm duyệt</span>
                <strong>
                  {donThuocChiTiet.ketQuaKiemDuyet ||
                    "Chưa có"}
                </strong>
              </div>
            </div>

            <div className="detail-section">
              <h3>Ảnh đơn thuốc</h3>

              <img
                src={donThuocChiTiet.anhDonThuoc}
                alt={`Đơn thuốc ${donThuocChiTiet.maDonThuoc}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "520px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            {donThuocChiTiet.trangThaiDonThuoc ===
              "CHO_DUYET" && (
              <div className="detail-section">
                <div className="form-group">
                  <label>Ghi chú của dược sĩ</label>
                  <textarea
                    value={ghiChuDuocSi}
                    onChange={(event) =>
                      setGhiChuDuocSi(event.target.value)
                    }
                    rows={3}
                    placeholder="Ghi chú thêm khi kiểm duyệt"
                  />
                </div>

                <div className="form-group">
                  <label>Lý do từ chối</label>
                  <textarea
                    value={lyDoTuChoi}
                    onChange={(event) =>
                      setLyDoTuChoi(event.target.value)
                    }
                    rows={3}
                    placeholder="Bắt buộc khi từ chối đơn thuốc"
                  />
                </div>

                <p>
                  Nhân viên duyệt tạm thời: mã{" "}
                  {MA_NHAN_VIEN_DUYET_TAM_THOI}. Sau khi tích
                  hợp đăng nhập, mã này sẽ lấy từ tài khoản
                  đang đăng nhập.
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    className="primary-button"
                    disabled={dangKiemDuyet}
                    onClick={() => void xuLyDuyet()}
                  >
                    {dangKiemDuyet
                      ? "Đang xử lý..."
                      : "Duyệt đơn thuốc"}
                  </button>

                  <button
                    type="button"
                    className="warning-button"
                    disabled={dangKiemDuyet}
                    onClick={() => void xuLyTuChoi()}
                  >
                    Từ chối đơn thuốc
                  </button>
                </div>
              </div>
            )}

            {donThuocChiTiet.trangThaiDonThuoc !==
              "CHO_DUYET" && (
              <div className="detail-section">
                <h3>Kết quả xử lý</h3>

                <p>
                  <strong>Ghi chú:</strong>{" "}
                  {donThuocChiTiet.ghiChuDuocSi ||
                    "Không có"}
                </p>

                {donThuocChiTiet.trangThaiDonThuoc ===
                  "TU_CHOI" && (
                  <p>
                    <strong>Lý do từ chối:</strong>{" "}
                    {donThuocChiTiet.lyDoTuChoi ||
                      "Không có"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyDonThuocPage;
