import { type FormEvent, useCallback, useEffect, useState } from "react";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import type { DonHangDuocSiChiTiet } from "../../don-hang/types/DonHangDuocSi";
import LenDonChoKhachModal from "../../len-don/components/LenDonChoKhachModal";
import DuocSiLoading from "../../shared/components/loading/DuocSiLoading";

import {
  hoanTatYeuCauTuVanDuocSi,
  layChiTietYeuCauTuVanDuocSi,
  layDanhSachYeuCauTuVanDuocSi,
  tiepNhanYeuCauTuVanDuocSi,
} from "../api/YeuCauTuVanDuocSiApi";

import type {
  TrangThaiTuVan,
  YeuCauTuVanDuocSiChiTiet,
  YeuCauTuVanDuocSiDanhSach,
} from "../types/YeuCauTuVanDuocSi";

import "../styles/QuanLyYeuCauTuVanDuocSi.css";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  thongBao?: string;
};

const KICH_THUOC_TRANG = 10;

const TEN_TRANG_THAI: Record<TrangThaiTuVan, string> = {
  CHO_TIEP_NHAN: "Chờ tiếp nhận",

  DANG_TU_VAN: "Đang tư vấn",

  DA_TU_VAN: "Đã tư vấn",

  KHONG_THE_LIEN_HE: "Không thể liên hệ",
};

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

function dinhDangNgayGio(giaTri: string) {
  const ngay = new Date(giaTri);

  if (Number.isNaN(ngay.getTime())) {
    return giaTri;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(ngay);
}

function QuanLyYeuCauTuVanDuocSiPage() {
  const navigate = useNavigate();
  const thongBao = useThongBaoHeThong();

  const [danhSach, setDanhSach] = useState<YeuCauTuVanDuocSiDanhSach[]>([]);

  const [trangHienTai, setTrangHienTai] = useState(0);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoPhanTu, setTongSoPhanTu] = useState(0);

  const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiTuVan | "">("");

  const [dangTai, setDangTai] = useState(true);

  const [chiTiet, setChiTiet] = useState<YeuCauTuVanDuocSiChiTiet | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [dangXuLy, setDangXuLy] = useState(false);

  const [dangMoLenDon, setDangMoLenDon] = useState(false);

  const [ketQuaTuVan, setKetQuaTuVan] = useState("");

  const [trangThaiHoanTat, setTrangThaiHoanTat] = useState<
    "DA_TU_VAN" | "KHONG_THE_LIEN_HE"
  >("DA_TU_VAN");

  const taiDanhSach = useCallback(async () => {
    try {
      setDangTai(true);

      const duLieu = await layDanhSachYeuCauTuVanDuocSi(
        trangHienTai,
        KICH_THUOC_TRANG,
        trangThaiLoc || undefined,
      );

      setDanhSach(duLieu.danhSachNoiDung);

      setTongSoTrang(duLieu.tongSoTrang);

      setTongSoPhanTu(duLieu.tongSoPhanTu);
    } catch (error) {
      console.error("Không thể tải yêu cầu tư vấn:", error);

      setDanhSach([]);
      setTongSoTrang(0);
      setTongSoPhanTu(0);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải danh sách yêu cầu tư vấn."),
        "LOI",
        "Không thể tải dữ liệu",
      );
    } finally {
      setDangTai(false);
    }
  }, [trangHienTai, trangThaiLoc, thongBao.hienThongBao]);

  useEffect(() => {
    void taiDanhSach();
  }, [taiDanhSach]);

  const moChiTiet = async (maYeuCauTuVan: number) => {
    try {
      setChiTiet(null);

      setDangTaiChiTiet(true);

      const duLieu = await layChiTietYeuCauTuVanDuocSi(maYeuCauTuVan);

      setChiTiet(duLieu);

      setKetQuaTuVan(duLieu.ketQuaTuVan || "");

      setTrangThaiHoanTat(
        duLieu.trangThaiTuVan === "KHONG_THE_LIEN_HE"
          ? "KHONG_THE_LIEN_HE"
          : "DA_TU_VAN",
      );
    } catch (error) {
      console.error("Không thể tải chi tiết yêu cầu:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tải chi tiết yêu cầu tư vấn."),
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

    setDangMoLenDon(false);
    setChiTiet(null);

    setKetQuaTuVan("");
  };

  const xuLyTiepNhan = async () => {
    if (!chiTiet) {
      return;
    }

    try {
      setDangXuLy(true);

      const duLieu = await tiepNhanYeuCauTuVanDuocSi(chiTiet.maYeuCauTuVan);

      setChiTiet(duLieu);

      thongBao.hienThongBao(
        "Tiếp nhận yêu cầu tư vấn thành công.",
        "THANH_CONG",
        "Thành công",
      );

      await taiDanhSach();
    } catch (error) {
      console.error("Không thể tiếp nhận yêu cầu:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tiếp nhận yêu cầu tư vấn."),
        "LOI",
        "Không thể thực hiện",
      );
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyHoanTat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!chiTiet) {
      return;
    }

    const ketQua = ketQuaTuVan.trim();

    if (!ketQua) {
      thongBao.hienThongBao(
        "Kết quả tư vấn không được để trống.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    try {
      setDangXuLy(true);

      const duLieu = await hoanTatYeuCauTuVanDuocSi(chiTiet.maYeuCauTuVan, {
        trangThaiTuVan: trangThaiHoanTat,

        ketQuaTuVan: ketQua,
      });

      setChiTiet(duLieu);

      thongBao.hienThongBao(
        trangThaiHoanTat === "DA_TU_VAN"
          ? "Đã hoàn tất tư vấn."
          : "Đã ghi nhận không thể liên hệ khách hàng.",
        "THANH_CONG",
        "Thành công",
      );

      await taiDanhSach();
    } catch (error) {
      console.error("Không thể hoàn tất yêu cầu:", error);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể hoàn tất yêu cầu tư vấn."),
        "LOI",
        "Không thể thực hiện",
      );
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyLenDonThanhCong = (donHang: DonHangDuocSiChiTiet) => {
    setDangMoLenDon(false);
    setChiTiet(null);

    thongBao.hienThongBao(
      donHang.phuongThucThanhToan === "ZALOPAY"
        ? `Đã tạo đơn #${donHang.maDonHang}. Khách hàng cần thanh toán ZaloPay trong tài khoản.`
        : `Đã tạo đơn #${donHang.maDonHang} và chuyển sang trạng thái đang xử lý.`,
      "THANH_CONG",
      "Tạo đơn hàng thành công",
    );

    void taiDanhSach();
  };

  const doiBoLoc = (giaTri: string) => {
    setTrangThaiLoc(giaTri as TrangThaiTuVan | "");

    setTrangHienTai(0);
  };

  return (
    <div className="ds-tv-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <div className="ds-tv-header">
        <div>
          <h1>Quản lý yêu cầu tư vấn</h1>

          <p>Tiếp nhận và xử lý yêu cầu tư vấn của khách hàng</p>
        </div>
      </div>

      <div className="ds-tv-toolbar">
        <select
          value={trangThaiLoc}
          onChange={(event) => doiBoLoc(event.target.value)}
        >
          <option value="">Tất cả trạng thái</option>

          <option value="CHO_TIEP_NHAN">Chờ tiếp nhận</option>

          <option value="DANG_TU_VAN">Đang tư vấn</option>

          <option value="DA_TU_VAN">Đã tư vấn</option>

          <option value="KHONG_THE_LIEN_HE">Không thể liên hệ</option>
        </select>

        <span>
          Tổng cộng <strong>{tongSoPhanTu}</strong> yêu cầu
        </span>
      </div>

      <div className="ds-tv-table-wrap">
        <table className="ds-tv-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Liên hệ</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Dược sĩ</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan={8} className="ds-tv-message">
                  <DuocSiLoading
                    gon
                    noiDung="Đang tải danh sách yêu cầu tư vấn..."
                  />
                </td>
              </tr>
            ) : danhSach.length === 0 ? (
              <tr>
                <td colSpan={8} className="ds-tv-message">
                  Không có yêu cầu tư vấn.
                </td>
              </tr>
            ) : (
              danhSach.map((yeuCau) => (
                <tr key={yeuCau.maYeuCauTuVan}>
                  <td>#{yeuCau.maYeuCauTuVan}</td>

                  <td>
                    <strong>{yeuCau.tenKhachHang}</strong>
                  </td>

                  <td>{yeuCau.soDienThoai}</td>

                  <td>
                    {yeuCau.hinhThucLienHe === "GOI_DIEN" ? "Gọi điện" : "Zalo"}
                  </td>

                  <td>{dinhDangNgayGio(yeuCau.ngayTao)}</td>

                  <td>
                    <span
                      className={
                        `ds-tv-status ` +
                        `ds-tv-status--${yeuCau.trangThaiTuVan}`
                      }
                    >
                      {TEN_TRANG_THAI[yeuCau.trangThaiTuVan]}
                    </span>
                  </td>

                  <td>{yeuCau.tenNhanVienTiepNhan || "-"}</td>

                  <td>
                    <button
                      type="button"
                      className="ds-tv-button ds-tv-button--secondary"
                      onClick={() => void moChiTiet(yeuCau.maYeuCauTuVan)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ds-tv-pagination">
        <button
          type="button"
          className="ds-tv-button ds-tv-button--secondary"
          disabled={trangHienTai <= 0 || dangTai}
          onClick={() => setTrangHienTai((trang) => Math.max(trang - 1, 0))}
        >
          Trước
        </button>

        <span>
          Trang <strong>{tongSoTrang === 0 ? 0 : trangHienTai + 1}</strong>
          {" / "}
          <strong>{tongSoTrang}</strong>
        </span>

        <button
          type="button"
          className="ds-tv-button ds-tv-button--secondary"
          disabled={
            tongSoTrang === 0 || trangHienTai >= tongSoTrang - 1 || dangTai
          }
          onClick={() =>
            setTrangHienTai((trang) =>
              Math.min(trang + 1, Math.max(tongSoTrang - 1, 0)),
            )
          }
        >
          Sau
        </button>
      </div>

      {(chiTiet || dangTaiChiTiet) && (
        <div className="ds-tv-modal-overlay">
          <div className="ds-tv-modal">
            {dangTaiChiTiet && !chiTiet ? (
              <div className="ds-tv-modal-body">
                <DuocSiLoading noiDung="Đang tải chi tiết yêu cầu tư vấn..." />
              </div>
            ) : (
              chiTiet && (
                <>
                  <div className="ds-tv-modal-header">
                    <div>
                      <h2>Yêu cầu tư vấn #{chiTiet.maYeuCauTuVan}</h2>

                      <span
                        className={
                          `ds-tv-status ` +
                          `ds-tv-status--${chiTiet.trangThaiTuVan}`
                        }
                      >
                        {TEN_TRANG_THAI[chiTiet.trangThaiTuVan]}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="ds-tv-close"
                      onClick={dongChiTiet}
                      disabled={dangXuLy}
                    >
                      ×
                    </button>
                  </div>

                  <div className="ds-tv-modal-body">
                    <div className="ds-tv-detail-grid">
                      <div>
                        <span>Khách hàng</span>

                        <strong>{chiTiet.tenKhachHang}</strong>
                      </div>

                      <div>
                        <span>Số điện thoại</span>

                        <strong>{chiTiet.soDienThoai}</strong>
                      </div>

                      <div>
                        <span>Hình thức</span>

                        <strong>
                          {chiTiet.hinhThucLienHe === "GOI_DIEN"
                            ? "Gọi điện"
                            : "Zalo"}
                        </strong>
                      </div>

                      <div>
                        <span>Dược sĩ tiếp nhận</span>

                        <strong>
                          {chiTiet.tenNhanVienTiepNhan || "Chưa tiếp nhận"}
                        </strong>
                      </div>
                    </div>

                    {chiTiet.maSanPham !== null && (
                      <div className="ds-tv-product-box">
                        <strong className="ds-tv-product-title">
                          Sản phẩm cần tư vấn
                        </strong>

                        <div className="ds-tv-product">
                          <div className="ds-tv-product-image-wrap">
                            {chiTiet.hinhAnh ? (
                              <img
                                className="ds-tv-product-image"
                                src={chiTiet.hinhAnh}
                                alt={
                                  chiTiet.tenSanPham || "Sản phẩm cần tư vấn"
                                }
                              />
                            ) : (
                              <span className="ds-tv-product-no-image">
                                Không có ảnh
                              </span>
                            )}
                          </div>

                          <div className="ds-tv-product-info">
                            <strong>
                              {chiTiet.tenSanPham ||
                                `Sản phẩm #${chiTiet.maSanPham}`}
                            </strong>

                            <span>Mã sản phẩm: #{chiTiet.maSanPham}</span>

                            {chiTiet.laThuocKeDon && (
                              <span className="ds-tv-product-rx">
                                Thuốc kê đơn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="ds-tv-content-box">
                      <strong>Nội dung cần tư vấn</strong>

                      <p>{chiTiet.noiDungCanTuVan}</p>
                    </div>

                    {chiTiet.trangThaiTuVan === "CHO_TIEP_NHAN" && (
                      <div className="ds-tv-modal-actions">
                        <button
                          type="button"
                          className="ds-tv-button ds-tv-button--primary"
                          disabled={dangXuLy}
                          onClick={() => void xuLyTiepNhan()}
                        >
                          {dangXuLy ? "Đang tiếp nhận..." : "Tiếp nhận yêu cầu"}
                        </button>
                      </div>
                    )}

                    {chiTiet.trangThaiTuVan === "DANG_TU_VAN" && (
                      <form noValidate onSubmit={xuLyHoanTat}>
                        <div className="ds-tv-form-group">
                          <label htmlFor="trangThaiHoanTat">
                            Kết quả xử lý
                          </label>

                          <select
                            id="trangThaiHoanTat"
                            value={trangThaiHoanTat}
                            onChange={(event) =>
                              setTrangThaiHoanTat(
                                event.target.value as
                                  | "DA_TU_VAN"
                                  | "KHONG_THE_LIEN_HE",
                              )
                            }
                            disabled={dangXuLy}
                          >
                            <option value="DA_TU_VAN">Đã tư vấn</option>

                            <option value="KHONG_THE_LIEN_HE">
                              Không thể liên hệ
                            </option>
                          </select>
                        </div>

                        <div className="ds-tv-form-group">
                          <label htmlFor="ketQuaTuVan">Nội dung kết quả</label>

                          <textarea
                            id="ketQuaTuVan"
                            value={ketQuaTuVan}
                            onChange={(event) =>
                              setKetQuaTuVan(event.target.value)
                            }
                            disabled={dangXuLy}
                            placeholder="Nhập kết quả tư vấn hoặc lý do không thể liên hệ..."
                          />
                        </div>

                        <div className="ds-tv-modal-actions">
                          <button
                            type="submit"
                            className="ds-tv-button ds-tv-button--primary"
                            disabled={dangXuLy}
                          >
                            {dangXuLy ? "Đang lưu..." : "Hoàn tất xử lý"}
                          </button>
                        </div>
                      </form>
                    )}

                    {(chiTiet.trangThaiTuVan === "DA_TU_VAN" ||
                      chiTiet.trangThaiTuVan === "KHONG_THE_LIEN_HE") && (
                      <div className="ds-tv-content-box">
                        <strong>Kết quả tư vấn</strong>

                        <p>{chiTiet.ketQuaTuVan || "Chưa có nội dung."}</p>
                      </div>
                    )}

                    {chiTiet.trangThaiTuVan === "DA_TU_VAN" &&
                      (chiTiet.maDonHang !== null ? (
                        <>
                          <div className="ds-tv-content-box">
                            <strong>Đơn hàng đã được tạo</strong>
                            <p>
                              Yêu cầu tư vấn này đã được dùng để tạo đơn #{chiTiet.maDonHang}.
                            </p>
                          </div>

                          <div className="ds-tv-modal-actions">
                            <button
                              type="button"
                              className="ds-tv-button ds-tv-button--secondary"
                              onClick={() => navigate("/duoc-si/don-hang")}
                            >
                              Đến quản lý đơn hàng
                            </button>
                          </div>
                        </>
                      ) : chiTiet.maKhachHang !== null ? (
                        <div className="ds-tv-modal-actions">
                          <button
                            type="button"
                            className="ds-tv-button ds-tv-button--primary"
                            disabled={dangXuLy}
                            onClick={() => setDangMoLenDon(true)}
                          >
                            Lên đơn cho khách
                          </button>
                        </div>
                      ) : (
                        <div className="ds-tv-content-box">
                          <strong>Không thể lên đơn</strong>
                          <p>
                            Yêu cầu tư vấn chưa liên kết với tài khoản khách hàng.
                          </p>
                        </div>
                      ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}

      <LenDonChoKhachModal
        dangHien={dangMoLenDon && chiTiet !== null}
        nguon={
          chiTiet && chiTiet.maKhachHang !== null
            ? {
                loaiNguon: "YEU_CAU_TU_VAN",
                maNguon: chiTiet.maYeuCauTuVan,
                maKhachHang: chiTiet.maKhachHang,
                tenKhachHang: chiTiet.tenKhachHang,
                soDienThoaiKhachHang: chiTiet.soDienThoai,
              }
            : null
        }
        onDong={() => setDangMoLenDon(false)}
        onThanhCong={xuLyLenDonThanhCong}
      />
    </div>
  );
}

export default QuanLyYeuCauTuVanDuocSiPage;
