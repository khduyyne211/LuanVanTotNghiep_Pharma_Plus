import { useCallback, useEffect, useState } from "react";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import type { DonHangDuocSiChiTiet } from "../../don-hang/types/DonHangDuocSi";
import LenDonChoKhachModal from "../../len-don/components/LenDonChoKhachModal";
import DuocSiLoading from "../../shared/components/loading/DuocSiLoading";
import DuocSiXacNhan from "../../shared/components/xac-nhan/DuocSiXacNhan";

import {
  duyetDonThuoc,
  layChiTietDonThuoc,
  layDanhSachDonThuoc,
  tuChoiDonThuoc,
} from "../api/donThuocApi";

import type { DonThuoc, TrangThaiDonThuoc } from "../types/DonThuoc";

import "../styles/QuanLyDonThuocPage.css";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  thongBao?: string;
};

type ThaoTacKiemDuyet = "DUYET" | "TU_CHOI" | null;

function layThongBaoLoi(error: unknown, macDinh: string) {
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

function QuanLyDonThuocPage() {
  const navigate = useNavigate();
  const thongBao = useThongBaoHeThong();

  const [danhSachDonThuoc, setDanhSachDonThuoc] = useState<DonThuoc[]>([]);

  const [dangTaiDanhSach, setDangTaiDanhSach] = useState(true);

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [first, setFirst] = useState(true);

  const [last, setLast] = useState(true);

  const [keywordInput, setKeywordInput] = useState("");

  const [keyword, setKeyword] = useState("");

  const [trangThai, setTrangThai] = useState<TrangThaiDonThuoc>("");

  const [donThuocChiTiet, setDonThuocChiTiet] = useState<DonThuoc | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [ghiChu, setGhiChu] = useState("");

  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  const [dangKiemDuyet, setDangKiemDuyet] = useState(false);

  const [dangMoLenDon, setDangMoLenDon] = useState(false);

  const [thaoTacChoXacNhan, setThaoTacChoXacNhan] =
    useState<ThaoTacKiemDuyet>(null);

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

      setDanhSachDonThuoc([]);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải danh sách đơn thuốc."),
        "LOI",
        "Không thể tải dữ liệu",
      );
    } finally {
      setDangTaiDanhSach(false);
    }
  }, [page, size, keyword, trangThai, thongBao.hienThongBao]);

  useEffect(() => {
    void taiDanhSachDonThuoc();
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

      setGhiChu(data.ghiChu ?? "");

      setLyDoTuChoi(data.lyDoTuChoi ?? "");
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn thuốc:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải chi tiết đơn thuốc."),
        "LOI",
        "Không thể tải dữ liệu",
      );
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTiet = () => {
    if (dangKiemDuyet) {
      return;
    }

    setDangMoLenDon(false);
    setDonThuocChiTiet(null);

    setGhiChu("");
    setLyDoTuChoi("");

    setThaoTacChoXacNhan(null);
  };

  const moXacNhanDuyet = () => {
    if (!donThuocChiTiet) {
      return;
    }

    setThaoTacChoXacNhan("DUYET");
  };

  const moXacNhanTuChoi = () => {
    if (!donThuocChiTiet) {
      return;
    }

    if (!lyDoTuChoi.trim()) {
      thongBao.hienThongBao(
        "Vui lòng nhập lý do từ chối đơn thuốc.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    setThaoTacChoXacNhan("TU_CHOI");
  };

  const dongXacNhan = () => {
    if (dangKiemDuyet) {
      return;
    }

    setThaoTacChoXacNhan(null);
  };

  const xuLyDuyet = async () => {
    if (!donThuocChiTiet) {
      return;
    }

    try {
      setDangKiemDuyet(true);

      const data = await duyetDonThuoc(donThuocChiTiet.maDonThuoc, {
        ghiChu: ghiChu.trim() || null,
      });

      setDonThuocChiTiet(data);

      setGhiChu(data.ghiChu ?? "");

      setLyDoTuChoi("");

      setThaoTacChoXacNhan(null);

      await taiDanhSachDonThuoc();

      thongBao.hienThongBao(
        `Đơn thuốc #${data.maDonThuoc} đã được duyệt thành công.`,
        "THANH_CONG",
        "Duyệt đơn thuốc thành công",
      );
    } catch (error) {
      console.error("Lỗi khi duyệt đơn thuốc:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể duyệt đơn thuốc."),
        "LOI",
        "Duyệt đơn thuốc thất bại",
      );
    } finally {
      setDangKiemDuyet(false);
    }
  };

  const xuLyTuChoi = async () => {
    if (!donThuocChiTiet) {
      return;
    }

    const lyDo = lyDoTuChoi.trim();

    if (!lyDo) {
      setThaoTacChoXacNhan(null);

      thongBao.hienThongBao(
        "Vui lòng nhập lý do từ chối đơn thuốc.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    try {
      setDangKiemDuyet(true);

      const data = await tuChoiDonThuoc(donThuocChiTiet.maDonThuoc, {
        ghiChu: ghiChu.trim() || null,

        lyDoTuChoi: lyDo,
      });

      setDonThuocChiTiet(data);

      setGhiChu(data.ghiChu ?? "");

      setLyDoTuChoi(data.lyDoTuChoi ?? "");

      setThaoTacChoXacNhan(null);

      await taiDanhSachDonThuoc();

      thongBao.hienThongBao(
        `Đơn thuốc #${data.maDonThuoc} đã được từ chối.`,
        "THANH_CONG",
        "Đã cập nhật đơn thuốc",
      );
    } catch (error) {
      console.error("Lỗi khi từ chối đơn thuốc:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể từ chối đơn thuốc."),
        "LOI",
        "Từ chối đơn thuốc thất bại",
      );
    } finally {
      setDangKiemDuyet(false);
    }
  };

  const xacNhanKiemDuyet = () => {
    if (thaoTacChoXacNhan === "DUYET") {
      void xuLyDuyet();

      return;
    }

    if (thaoTacChoXacNhan === "TU_CHOI") {
      void xuLyTuChoi();
    }
  };

  const xuLyLenDonThanhCong = (donHang: DonHangDuocSiChiTiet) => {
    setDangMoLenDon(false);
    setDonThuocChiTiet(null);

    thongBao.hienThongBao(
      donHang.phuongThucThanhToan === "ZALOPAY"
        ? `Đã tạo đơn #${donHang.maDonHang}. Khách hàng cần thanh toán ZaloPay trong tài khoản.`
        : `Đã tạo đơn #${donHang.maDonHang} và chuyển sang trạng thái đang xử lý.`,
      "THANH_CONG",
      "Tạo đơn hàng thành công",
    );

    void taiDanhSachDonThuoc();
  };

  const dinhDangNgayGio = (giaTri: string) => {
    const ngay = new Date(giaTri);

    if (Number.isNaN(ngay.getTime())) {
      return giaTri;
    }

    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",

      timeStyle: "short",
    }).format(ngay);
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

  const tieuDeXacNhan =
    thaoTacChoXacNhan === "TU_CHOI"
      ? "Xác nhận từ chối đơn thuốc"
      : "Xác nhận duyệt đơn thuốc";

  const noiDungXacNhan = donThuocChiTiet
    ? thaoTacChoXacNhan === "TU_CHOI"
      ? `Bạn có chắc muốn từ chối đơn thuốc #${donThuocChiTiet.maDonThuoc} không?`
      : `Bạn có chắc muốn duyệt đơn thuốc #${donThuocChiTiet.maDonThuoc} không?`
    : "";

  return (
    <div className="ds-dt-page">
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
        nhanXacNhan={thaoTacChoXacNhan === "TU_CHOI" ? "Từ chối" : "Duyệt"}
        loai={thaoTacChoXacNhan === "TU_CHOI" ? "NGUY_HIEM" : "BINH_THUONG"}
        dangXuLy={dangKiemDuyet}
        onXacNhan={xacNhanKiemDuyet}
        onHuy={dongXacNhan}
      />

      <div className="ds-dt-page-header">
        <h1>Quản lý đơn thuốc</h1>

        <p>
          Dược sĩ xem ảnh đơn thuốc, kiểm tra thông tin và cập nhật kết quả kiểm
          duyệt.
        </p>
      </div>

      <div className="ds-dt-filter-panel">
        <div className="ds-dt-form-group">
          <label htmlFor="timDonThuoc">Tìm đơn thuốc</label>

          <input
            id="timDonThuoc"
            type="text"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                timKiem();
              }
            }}
            placeholder="Mã đơn, tên hoặc số điện thoại"
          />
        </div>

        <div className="ds-dt-form-group">
          <label htmlFor="trangThaiDonThuoc">Trạng thái</label>

          <select
            id="trangThaiDonThuoc"
            value={trangThai}
            onChange={(event) => {
              setTrangThai(event.target.value as TrangThaiDonThuoc);

              setPage(0);
            }}
          >
            <option value="">Tất cả trạng thái</option>

            <option value="CHO_DUYET">Chờ duyệt</option>

            <option value="DA_DUYET">Đã duyệt</option>

            <option value="TU_CHOI">Từ chối</option>
          </select>
        </div>

        <div className="ds-dt-form-group">
          <label htmlFor="soDongDonThuoc">Số dòng</label>

          <select
            id="soDongDonThuoc"
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

        <div className="ds-dt-filter-actions">
          <button
            type="button"
            className="ds-dt-button ds-dt-button--primary"
            onClick={timKiem}
          >
            Tìm kiếm
          </button>

          <button
            type="button"
            className="ds-dt-button ds-dt-button--secondary"
            onClick={xoaBoLoc}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <p className="ds-dt-summary">
        Tổng số đơn thuốc:&nbsp;
        <strong>{totalElements}</strong>
      </p>

      <div className="ds-dt-table-wrap">
        <table className="ds-dt-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Ngày tải lên</th>
              <th>Trạng thái</th>
              <th>Dược sĩ duyệt</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTaiDanhSach ? (
              <tr>
                <td colSpan={7} className="ds-dt-empty">
                  <DuocSiLoading
                    gon
                    noiDung="Đang tải danh sách đơn thuốc..."
                  />
                </td>
              </tr>
            ) : (
              danhSachDonThuoc.map((donThuoc) => (
                <tr key={donThuoc.maDonThuoc}>
                  <td>#{donThuoc.maDonThuoc}</td>

                  <td>
                    <strong>{donThuoc.tenKhachHang}</strong>
                  </td>

                  <td>{donThuoc.soDienThoaiKhachHang}</td>

                  <td>{dinhDangNgayGio(donThuoc.ngayUpload)}</td>

                  <td>
                    <span
                      className={
                        `ds-dt-status ` +
                        `ds-dt-status--${donThuoc.trangThaiDonThuoc}`
                      }
                    >
                      {hienThiTrangThai(donThuoc.trangThaiDonThuoc)}
                    </span>
                  </td>

                  <td>{donThuoc.tenNhanVienDuyet || "Chưa có người duyệt"}</td>

                  <td>
                    <button
                      type="button"
                      className="ds-dt-button ds-dt-button--secondary"
                      onClick={() => void xemChiTiet(donThuoc.maDonThuoc)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}

            {!dangTaiDanhSach && danhSachDonThuoc.length === 0 && (
              <tr>
                <td colSpan={7} className="ds-dt-empty">
                  Không có đơn thuốc phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="ds-dt-pagination">
        <button
          type="button"
          className="ds-dt-button ds-dt-button--secondary"
          disabled={first || dangTaiDanhSach}
          onClick={() => setPage(Math.max(page - 1, 0))}
        >
          Trang trước
        </button>

        <span>
          Trang <strong>{totalPages === 0 ? 0 : page + 1}</strong>
          {" / "}
          <strong>{totalPages}</strong>
        </span>

        <button
          type="button"
          className="ds-dt-button ds-dt-button--secondary"
          disabled={last || dangTaiDanhSach}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>

      {dangTaiChiTiet && (
        <div className="ds-dt-modal-overlay">
          <div className="ds-dt-modal ds-dt-modal--loading">
            <DuocSiLoading noiDung="Đang tải chi tiết đơn thuốc..." />
          </div>
        </div>
      )}

      {donThuocChiTiet && !dangTaiChiTiet && (
        <div className="ds-dt-modal-overlay">
          <div className="ds-dt-modal">
            <div className="ds-dt-modal-header">
              <div>
                <h2>Chi tiết đơn thuốc #{donThuocChiTiet.maDonThuoc}</h2>

                <p>{donThuocChiTiet.tenKhachHang}</p>
              </div>

              <button
                type="button"
                className="ds-dt-modal-close"
                onClick={dongChiTiet}
                disabled={dangKiemDuyet}
              >
                ×
              </button>
            </div>

            <div className="ds-dt-modal-body">
              <div className="ds-dt-detail-grid">
                <div className="ds-dt-detail-item">
                  <span>Mã khách hàng</span>

                  <strong>#{donThuocChiTiet.maKhachHang}</strong>
                </div>

                <div className="ds-dt-detail-item">
                  <span>Số điện thoại</span>

                  <strong>{donThuocChiTiet.soDienThoaiKhachHang}</strong>
                </div>

                <div className="ds-dt-detail-item">
                  <span>Ngày tải lên</span>

                  <strong>{dinhDangNgayGio(donThuocChiTiet.ngayUpload)}</strong>
                </div>

                <div className="ds-dt-detail-item">
                  <span>Trạng thái</span>

                  <strong>
                    {hienThiTrangThai(donThuocChiTiet.trangThaiDonThuoc)}
                  </strong>
                </div>

                <div className="ds-dt-detail-item">
                  <span>Dược sĩ duyệt</span>

                  <strong>
                    {donThuocChiTiet.tenNhanVienDuyet || "Chưa có"}
                  </strong>
                </div>
              </div>

              <div className="ds-dt-section">
                <h3>Ảnh đơn thuốc</h3>

                <div className="ds-dt-prescription-image-wrap">
                  <img
                    className="ds-dt-prescription-image"
                    src={donThuocChiTiet.anhDonThuoc}
                    alt={`Đơn thuốc ${donThuocChiTiet.maDonThuoc}`}
                  />
                </div>
              </div>

              {donThuocChiTiet.trangThaiDonThuoc === "CHO_DUYET" && (
                <div className="ds-dt-section">
                  <div className="ds-dt-review-form">
                    <div className="ds-dt-form-group">
                      <label htmlFor="ghiChuDonThuoc">
                        Ghi chú của dược sĩ
                      </label>

                      <textarea
                        id="ghiChuDonThuoc"
                        value={ghiChu}
                        onChange={(event) => setGhiChu(event.target.value)}
                        placeholder="Ghi chú thêm khi kiểm duyệt"
                        disabled={dangKiemDuyet}
                      />
                    </div>

                    <div className="ds-dt-form-group">
                      <label htmlFor="lyDoTuChoiDonThuoc">Lý do từ chối</label>

                      <textarea
                        id="lyDoTuChoiDonThuoc"
                        value={lyDoTuChoi}
                        onChange={(event) => setLyDoTuChoi(event.target.value)}
                        placeholder="Bắt buộc khi từ chối đơn thuốc"
                        disabled={dangKiemDuyet}
                      />
                    </div>

                    <div className="ds-dt-review-actions">
                      <button
                        type="button"
                        className="ds-dt-button ds-dt-button--primary"
                        disabled={dangKiemDuyet}
                        onClick={moXacNhanDuyet}
                      >
                        Duyệt đơn thuốc
                      </button>

                      <button
                        type="button"
                        className="ds-dt-button ds-dt-button--danger"
                        disabled={dangKiemDuyet}
                        onClick={moXacNhanTuChoi}
                      >
                        Từ chối đơn thuốc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {donThuocChiTiet.trangThaiDonThuoc !== "CHO_DUYET" && (
                <div className="ds-dt-section ds-dt-result">
                  <h3>Kết quả xử lý</h3>

                  <p>
                    <strong>Ghi chú:</strong>{" "}
                    {donThuocChiTiet.ghiChu || "Không có"}
                  </p>

                  {donThuocChiTiet.trangThaiDonThuoc === "TU_CHOI" && (
                    <p>
                      <strong>Lý do từ chối:</strong>{" "}
                      {donThuocChiTiet.lyDoTuChoi || "Không có"}
                    </p>
                  )}
                </div>
              )}

              {donThuocChiTiet.trangThaiDonThuoc === "DA_DUYET" &&
                (donThuocChiTiet.maDonHang !== null ? (
                  <div className="ds-dt-section ds-dt-result">
                    <h3>Đơn hàng đã được tạo</h3>

                    <p>
                      Đơn thuốc này đã được dùng để tạo đơn #{donThuocChiTiet.maDonHang}.
                    </p>

                    <div className="ds-dt-review-actions">
                      <button
                        type="button"
                        className="ds-dt-button ds-dt-button--secondary"
                        onClick={() => navigate("/duoc-si/don-hang")}
                      >
                        Đến quản lý đơn hàng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ds-dt-review-actions">
                    <button
                      type="button"
                      className="ds-dt-button ds-dt-button--primary"
                      onClick={() => setDangMoLenDon(true)}
                    >
                      Lên đơn cho khách
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <LenDonChoKhachModal
        dangHien={dangMoLenDon && donThuocChiTiet !== null}
        nguon={
          donThuocChiTiet
            ? {
                loaiNguon: "DON_THUOC",
                maNguon: donThuocChiTiet.maDonThuoc,
                maKhachHang: donThuocChiTiet.maKhachHang,
                tenKhachHang: donThuocChiTiet.tenKhachHang,
                soDienThoaiKhachHang: donThuocChiTiet.soDienThoaiKhachHang,
              }
            : null
        }
        onDong={() => setDangMoLenDon(false)}
        onThanhCong={xuLyLenDonThanhCong}
      />
    </div>
  );
}

export default QuanLyDonThuocPage;
