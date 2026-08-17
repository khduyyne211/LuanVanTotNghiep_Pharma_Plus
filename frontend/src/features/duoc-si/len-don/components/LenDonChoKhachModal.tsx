import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { isAxiosError } from "axios";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import type { DonHangDuocSiChiTiet } from "../../don-hang/types/DonHangDuocSi";
import DuocSiLoading from "../../shared/components/loading/DuocSiLoading";
import DuocSiXacNhan from "../../shared/components/xac-nhan/DuocSiXacNhan";

import {
  layDanhSachSanPhamDuocSi,
  taoDonHangTuDonThuocDuocSi,
  taoDonHangTuYeuCauTuVanDuocSi,
} from "../api/lenDonDuocSiApi";

import type {
  DonViBanDuocSi,
  NguonLenDonDuocSi,
  SanPhamDaChonLenDon,
  SanPhamDuocSi,
  TaoDonHangDuocSiRequest,
} from "../types/LenDonDuocSi";

import "../styles/LenDonChoKhachModal.css";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  thongBao?: string;
};

type LenDonChoKhachModalProps = {
  dangHien: boolean;
  nguon: NguonLenDonDuocSi | null;
  onDong: () => void;
  onThanhCong: (donHang: DonHangDuocSiChiTiet) => void;
};

const KICH_THUOC_TRANG_SAN_PHAM = 8;
const PHI_GIAO_HANG = 30000;
const THANH_PHO_GIAO_HANG = "TP. Hồ Chí Minh";

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

function dinhDangTien(giaTri: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(giaTri);
}

function LenDonChoKhachModal({
  dangHien,
  nguon,
  onDong,
  onThanhCong,
}: LenDonChoKhachModalProps) {
  const thongBao = useThongBaoHeThong();

  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPhamDuocSi[]>([]);
  const [dangTaiSanPham, setDangTaiSanPham] = useState(false);
  const [loiTaiSanPham, setLoiTaiSanPham] = useState("");

  const [tuKhoaInput, setTuKhoaInput] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangSanPham, setTrangSanPham] = useState(0);
  const [tongTrangSanPham, setTongTrangSanPham] = useState(0);

  const [maDonViDangChon, setMaDonViDangChon] = useState<Record<number, number>>({});
  const [soLuongDangChon, setSoLuongDangChon] = useState<Record<number, number>>({});
  const [danhSachDaChon, setDanhSachDaChon] = useState<SanPhamDaChonLenDon[]>([]);

  const [tenNguoiNhan, setTenNguoiNhan] = useState("");
  const [soDienThoaiNhan, setSoDienThoaiNhan] = useState("");
  const thanhPho = THANH_PHO_GIAO_HANG;
  const [phuongKhuVuc, setPhuongKhuVuc] = useState("");
  const [diaChiChiTiet, setDiaChiChiTiet] = useState("");
  const [laMacDinh, setLaMacDinh] = useState(false);

  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState<"COD" | "ZALOPAY">("COD");
  const [ghiChu, setGhiChu] = useState("");

  const [dangXacNhan, setDangXacNhan] = useState(false);
  const [dangTaoDon, setDangTaoDon] = useState(false);

  const taiDanhSachSanPham = useCallback(async () => {
    if (!dangHien) {
      return;
    }

    try {
      setDangTaiSanPham(true);
      setLoiTaiSanPham("");

      const data = await layDanhSachSanPhamDuocSi(
        trangSanPham,
        KICH_THUOC_TRANG_SAN_PHAM,
        tuKhoa || undefined,
      );

      setDanhSachSanPham(data.content);
      setTongTrangSanPham(data.totalPages);

      setMaDonViDangChon((hienTai) => {
        const ketQua = { ...hienTai };

        for (const sanPham of data.content) {
          if (ketQua[sanPham.maSanPham]) {
            continue;
          }

          const donViConHang = sanPham.danhSachDonViBan.find((donVi) => donVi.soLuongToiDa > 0);
          const donViMacDinh = donViConHang || sanPham.danhSachDonViBan[0];

          if (donViMacDinh) {
            ketQua[sanPham.maSanPham] = donViMacDinh.maDonViSanPham;
          }
        }

        return ketQua;
      });

      setSoLuongDangChon((hienTai) => {
        const ketQua = { ...hienTai };

        for (const sanPham of data.content) {
          if (ketQua[sanPham.maSanPham] === undefined) {
            ketQua[sanPham.maSanPham] = 1;
          }
        }

        return ketQua;
      });
    } catch (error) {
      console.error("Không thể tải sản phẩm cho Dược sĩ:", error);

      setDanhSachSanPham([]);
      setTongTrangSanPham(0);
      setLoiTaiSanPham(layThongBaoLoi(error, "Không thể tải danh sách sản phẩm."));
    } finally {
      setDangTaiSanPham(false);
    }
  }, [dangHien, trangSanPham, tuKhoa]);

  useEffect(() => {
    if (!dangHien || !nguon) {
      return;
    }

    setTuKhoaInput("");
    setTuKhoa("");
    setTrangSanPham(0);
    setTongTrangSanPham(0);
    setDanhSachDaChon([]);
    setMaDonViDangChon({});
    setSoLuongDangChon({});

    setTenNguoiNhan(nguon.tenKhachHang || "");
    setSoDienThoaiNhan(nguon.soDienThoaiKhachHang || "");
    setPhuongKhuVuc("");
    setDiaChiChiTiet("");
    setLaMacDinh(false);

    setPhuongThucThanhToan("COD");
    setGhiChu("");
    setDangXacNhan(false);
    setDangTaoDon(false);
  }, [dangHien, nguon?.loaiNguon, nguon?.maNguon]);

  useEffect(() => {
    void taiDanhSachSanPham();
  }, [taiDanhSachSanPham]);

  const tongTienSanPham = useMemo(
    () =>
      danhSachDaChon.reduce(
        (tong, chiTiet) => tong + chiTiet.giaSauKhuyenMai * chiTiet.soLuong,
        0,
      ),
    [danhSachDaChon],
  );

  const tongThanhToanDuKien = tongTienSanPham + PHI_GIAO_HANG;

  if (!dangHien || !nguon) {
    return null;
  }

  const timKiemSanPham = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setTrangSanPham(0);
    setTuKhoa(tuKhoaInput.trim());
  };

  const layDonViDangChon = (sanPham: SanPhamDuocSi): DonViBanDuocSi | null => {
    const maDonVi = maDonViDangChon[sanPham.maSanPham];

    return (
      sanPham.danhSachDonViBan.find((donVi) => donVi.maDonViSanPham === maDonVi) ||
      sanPham.danhSachDonViBan[0] ||
      null
    );
  };

  const themSanPhamVaoDon = (sanPham: SanPhamDuocSi) => {
    const donVi = layDonViDangChon(sanPham);

    if (!donVi) {
      thongBao.hienThongBao(
        "Sản phẩm chưa có đơn vị được phép bán.",
        "CANH_BAO",
        "Không thể thêm sản phẩm",
      );
      return;
    }

    if (donVi.soLuongToiDa <= 0) {
      thongBao.hienThongBao(
        "Đơn vị sản phẩm này hiện đã hết hàng.",
        "CANH_BAO",
        "Không đủ tồn kho",
      );
      return;
    }

    const soLuong = Math.trunc(soLuongDangChon[sanPham.maSanPham] || 1);

    if (soLuong <= 0 || soLuong > donVi.soLuongToiDa) {
      thongBao.hienThongBao(
        `Số lượng phải từ 1 đến ${donVi.soLuongToiDa}.`,
        "CANH_BAO",
        "Số lượng chưa hợp lệ",
      );
      return;
    }

    const chiTietDaCo = danhSachDaChon.find(
      (chiTiet) => chiTiet.maDonViSanPham === donVi.maDonViSanPham,
    );

    if (chiTietDaCo && chiTietDaCo.soLuong + soLuong > donVi.soLuongToiDa) {
      thongBao.hienThongBao(
        `Tổng số lượng của đơn vị này không được vượt quá ${donVi.soLuongToiDa}.`,
        "CANH_BAO",
        "Không đủ tồn kho",
      );
      return;
    }

    if (!chiTietDaCo) {
      setDanhSachDaChon((hienTai) => [
        ...hienTai,
        {
          maSanPham: sanPham.maSanPham,
          tenSanPham: sanPham.tenSanPham,
          laThuocKeDon: sanPham.laThuocKeDon,
          maDonViSanPham: donVi.maDonViSanPham,
          tenDonViTinh: donVi.tenDonViTinh,
          kyHieu: donVi.kyHieu,
          giaGoc: donVi.giaGoc,
          giaSauKhuyenMai: donVi.giaSauKhuyenMai,
          soLuongToiDa: donVi.soLuongToiDa,
          soLuong,
        },
      ]);
      return;
    }

    setDanhSachDaChon((hienTai) =>
      hienTai.map((chiTiet) =>
        chiTiet.maDonViSanPham === donVi.maDonViSanPham
          ? { ...chiTiet, soLuong: chiTiet.soLuong + soLuong }
          : chiTiet,
      ),
    );
  };

  const chuanHoaSoLuongDaChon = (maDonViSanPham: number) => {
    const chiTiet = danhSachDaChon.find((item) => item.maDonViSanPham === maDonViSanPham);

    if (!chiTiet) {
      return;
    }

    if (chiTiet.soLuong < 1) {
      setDanhSachDaChon((hienTai) =>
        hienTai.map((item) =>
          item.maDonViSanPham === maDonViSanPham ? { ...item, soLuong: 1 } : item,
        ),
      );

      thongBao.hienThongBao(
        "Số lượng phải lớn hơn 0. Hệ thống đã đưa về 1.",
        "CANH_BAO",
        "Số lượng chưa hợp lệ",
      );
      return;
    }

    if (chiTiet.soLuong > chiTiet.soLuongToiDa) {
      setDanhSachDaChon((hienTai) =>
        hienTai.map((item) =>
          item.maDonViSanPham === maDonViSanPham
            ? { ...item, soLuong: item.soLuongToiDa }
            : item,
        ),
      );

      thongBao.hienThongBao(
        `Số lượng vượt tồn kho. Hệ thống đã đưa về ${chiTiet.soLuongToiDa}.`,
        "CANH_BAO",
        "Không đủ tồn kho",
      );
    }
  };

  const xoaSanPhamDaChon = (maDonViSanPham: number) => {
    setDanhSachDaChon((hienTai) =>
      hienTai.filter((chiTiet) => chiTiet.maDonViSanPham !== maDonViSanPham),
    );
  };

  const kiemTraDuLieuTaoDon = () => {
    if (!tenNguoiNhan.trim()) {
      return "Vui lòng nhập họ tên người nhận.";
    }

    if (tenNguoiNhan.trim().length > 100) {
      return "Họ tên người nhận không được vượt quá 100 ký tự.";
    }

    if (!/^0\d{9}$/.test(soDienThoaiNhan.trim())) {
      return "Số điện thoại người nhận phải gồm 10 chữ số và bắt đầu bằng 0.";
    }

    if (!thanhPho.trim()) {
      return "Vui lòng nhập tỉnh/thành phố.";
    }

    if (thanhPho.trim().length > 100) {
      return "Tỉnh/thành phố không được vượt quá 100 ký tự.";
    }

    if (!phuongKhuVuc.trim()) {
      return "Vui lòng nhập phường hoặc khu vực.";
    }

    if (phuongKhuVuc.trim().length > 150) {
      return "Phường hoặc khu vực không được vượt quá 150 ký tự.";
    }

    if (!diaChiChiTiet.trim()) {
      return "Vui lòng nhập địa chỉ chi tiết.";
    }

    if (diaChiChiTiet.trim().length > 255) {
      return "Địa chỉ chi tiết không được vượt quá 255 ký tự.";
    }

    if (danhSachDaChon.length === 0) {
      return "Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.";
    }

    if (danhSachDaChon.some((chiTiet) => chiTiet.soLuong < 1)) {
      return "Đơn hàng có sản phẩm với số lượng không hợp lệ.";
    }

    if (danhSachDaChon.some((chiTiet) => chiTiet.soLuong > chiTiet.soLuongToiDa)) {
      return "Đơn hàng có sản phẩm vượt quá tồn kho hiện có.";
    }

    if (ghiChu.trim().length > 255) {
      return "Ghi chú không được vượt quá 255 ký tự.";
    }

    return null;
  };

  const moXacNhanTaoDon = () => {
    const loi = kiemTraDuLieuTaoDon();

    if (loi) {
      thongBao.hienThongBao(loi, "CANH_BAO", "Dữ liệu chưa hợp lệ");
      return;
    }

    setDangXacNhan(true);
  };

  const taoRequest = (): TaoDonHangDuocSiRequest => ({
    diaChiGiaoHang: {
      tenNguoiNhan: tenNguoiNhan.trim(),
      soDienThoaiNhan: soDienThoaiNhan.trim(),
      thanhPho: thanhPho.trim(),
      phuongKhuVuc: phuongKhuVuc.trim(),
      diaChiChiTiet: diaChiChiTiet.trim(),
      laMacDinh,
    },
    danhSachChiTiet: danhSachDaChon.map((chiTiet) => ({
      maDonViSanPham: chiTiet.maDonViSanPham,
      soLuong: chiTiet.soLuong,
    })),
    phuongThucThanhToan,
    ghiChu: ghiChu.trim() || null,
  });

  const xacNhanTaoDon = async () => {
    try {
      setDangTaoDon(true);

      const request = taoRequest();
      const donHang =
        nguon.loaiNguon === "YEU_CAU_TU_VAN"
          ? await taoDonHangTuYeuCauTuVanDuocSi(nguon.maNguon, request)
          : await taoDonHangTuDonThuocDuocSi(nguon.maNguon, request);

      setDangXacNhan(false);
      onThanhCong(donHang);
    } catch (error) {
      console.error("Không thể tạo đơn hàng cho khách:", error);

      setDangXacNhan(false);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tạo đơn hàng cho khách."),
        "LOI",
        "Tạo đơn hàng thất bại",
      );
    } finally {
      setDangTaoDon(false);
    }
  };

  return (
    <>
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <DuocSiXacNhan
        dangHien={dangXacNhan}
        tieuDe="Xác nhận tạo đơn hàng"
        noiDung={`Tạo đơn cho ${nguon.tenKhachHang} với tổng thanh toán dự kiến ${dinhDangTien(tongThanhToanDuKien)}?`}
        nhanXacNhan="Tạo đơn"
        loai="BINH_THUONG"
        dangXuLy={dangTaoDon}
        onXacNhan={() => void xacNhanTaoDon()}
        onHuy={() => {
          if (!dangTaoDon) {
            setDangXacNhan(false);
          }
        }}
      />

      <div className="ds-ld-overlay">
        <div className="ds-ld-modal">
          <div className="ds-ld-header">
            <div>
              <h2>Lên đơn cho khách</h2>
              <p>
                {nguon.loaiNguon === "YEU_CAU_TU_VAN"
                  ? `Từ yêu cầu tư vấn #${nguon.maNguon}`
                  : `Từ đơn thuốc #${nguon.maNguon}`}
              </p>
            </div>

            <button
              type="button"
              className="ds-ld-close"
              onClick={onDong}
              disabled={dangTaoDon}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <div className="ds-ld-body">
            <section className="ds-ld-section">
              <div className="ds-ld-section-title">
                <h3>Khách hàng</h3>
              </div>

              <div className="ds-ld-customer-grid">
                <div>
                  <span>Mã khách hàng</span>
                  <strong>#{nguon.maKhachHang}</strong>
                </div>
                <div>
                  <span>Họ tên</span>
                  <strong>{nguon.tenKhachHang}</strong>
                </div>
                <div>
                  <span>Số điện thoại</span>
                  <strong>{nguon.soDienThoaiKhachHang}</strong>
                </div>
              </div>
            </section>

            <section className="ds-ld-section">
              <div className="ds-ld-section-title">
                <h3>Sản phẩm</h3>
                <span>Cho phép chọn cả OTC và thuốc kê đơn</span>
              </div>

              <form className="ds-ld-search" onSubmit={timKiemSanPham}>
                <input
                  type="text"
                  value={tuKhoaInput}
                  onChange={(event) => setTuKhoaInput(event.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  disabled={dangTaoDon}
                />
                <button type="submit" className="ds-ld-button ds-ld-button--secondary">
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  className="ds-ld-button ds-ld-button--secondary"
                  onClick={() => {
                    setTuKhoaInput("");
                    setTuKhoa("");
                    setTrangSanPham(0);
                  }}
                >
                  Xóa tìm kiếm
                </button>
              </form>

              {dangTaiSanPham ? (
                <div className="ds-ld-loading">
                  <DuocSiLoading noiDung="Đang tải danh sách sản phẩm..." />
                </div>
              ) : loiTaiSanPham ? (
                <div className="ds-ld-inline-error">{loiTaiSanPham}</div>
              ) : danhSachSanPham.length === 0 ? (
                <div className="ds-ld-empty">Không có sản phẩm phù hợp.</div>
              ) : (
                <div className="ds-ld-product-list">
                  {danhSachSanPham.map((sanPham) => {
                    const donVi = layDonViDangChon(sanPham);
                    const hetHang = !donVi || donVi.soLuongToiDa <= 0;

                    return (
                      <div className="ds-ld-product-card" key={sanPham.maSanPham}>
                        <div className="ds-ld-product-main">
                          <div className="ds-ld-product-image-wrap">
                            {sanPham.hinhAnh ? (
                              <img src={sanPham.hinhAnh} alt={sanPham.tenSanPham} />
                            ) : (
                              <span>Không có ảnh</span>
                            )}
                          </div>

                          <div className="ds-ld-product-info">
                            <strong>{sanPham.tenSanPham}</strong>
                            <span>Mã sản phẩm: #{sanPham.maSanPham}</span>
                            {sanPham.laThuocKeDon && (
                              <span className="ds-ld-rx">Thuốc kê đơn</span>
                            )}
                          </div>
                        </div>

                        <div className="ds-ld-product-controls">
                          <select
                            value={maDonViDangChon[sanPham.maSanPham] || ""}
                            onChange={(event) =>
                              setMaDonViDangChon((hienTai) => ({
                                ...hienTai,
                                [sanPham.maSanPham]: Number(event.target.value),
                              }))
                            }
                            disabled={dangTaoDon || sanPham.danhSachDonViBan.length === 0}
                          >
                            {sanPham.danhSachDonViBan.map((item) => (
                              <option key={item.maDonViSanPham} value={item.maDonViSanPham}>
                                {item.tenDonViTinh} - còn tối đa {item.soLuongToiDa}
                              </option>
                            ))}
                          </select>

                          <div className="ds-ld-product-price">
                            {donVi ? (
                              <>
                                {donVi.giaSauKhuyenMai < donVi.giaGoc && (
                                  <del>{dinhDangTien(donVi.giaGoc)}</del>
                                )}
                                <strong>{dinhDangTien(donVi.giaSauKhuyenMai)}</strong>
                              </>
                            ) : (
                              <span>Chưa có giá bán</span>
                            )}
                          </div>

                          <input
                            type="number"
                            min={1}
                            max={donVi?.soLuongToiDa || 1}
                            value={soLuongDangChon[sanPham.maSanPham] || 1}
                            onChange={(event) =>
                              setSoLuongDangChon((hienTai) => ({
                                ...hienTai,
                                [sanPham.maSanPham]: Number(event.target.value),
                              }))
                            }
                            disabled={dangTaoDon || hetHang}
                          />

                          <button
                            type="button"
                            className="ds-ld-button ds-ld-button--primary"
                            disabled={dangTaoDon || hetHang}
                            onClick={() => themSanPhamVaoDon(sanPham)}
                          >
                            {hetHang ? "Hết hàng" : "Thêm"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="ds-ld-pagination">
                <button
                  type="button"
                  className="ds-ld-button ds-ld-button--secondary"
                  disabled={trangSanPham <= 0 || dangTaiSanPham}
                  onClick={() => setTrangSanPham((trang) => Math.max(trang - 1, 0))}
                >
                  Trước
                </button>
                <span>
                  Trang <strong>{tongTrangSanPham === 0 ? 0 : trangSanPham + 1}</strong>
                  {" / "}
                  <strong>{tongTrangSanPham}</strong>
                </span>
                <button
                  type="button"
                  className="ds-ld-button ds-ld-button--secondary"
                  disabled={
                    tongTrangSanPham === 0 ||
                    trangSanPham >= tongTrangSanPham - 1 ||
                    dangTaiSanPham
                  }
                  onClick={() =>
                    setTrangSanPham((trang) =>
                      Math.min(trang + 1, Math.max(tongTrangSanPham - 1, 0)),
                    )
                  }
                >
                  Sau
                </button>
              </div>
            </section>

            <section className="ds-ld-section">
              <div className="ds-ld-section-title">
                <h3>Sản phẩm đã chọn</h3>
                <span>{danhSachDaChon.length} dòng sản phẩm</span>
              </div>

              {danhSachDaChon.length === 0 ? (
                <div className="ds-ld-empty">Chưa có sản phẩm nào trong đơn.</div>
              ) : (
                <div className="ds-ld-selected-wrap">
                  <table className="ds-ld-selected-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn vị</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {danhSachDaChon.map((chiTiet) => (
                        <tr key={chiTiet.maDonViSanPham}>
                          <td>
                            <strong>{chiTiet.tenSanPham}</strong>
                            {chiTiet.laThuocKeDon && <span className="ds-ld-rx">Rx</span>}
                          </td>
                          <td>{chiTiet.tenDonViTinh}</td>
                          <td>{dinhDangTien(chiTiet.giaSauKhuyenMai)}</td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              max={chiTiet.soLuongToiDa}
                              value={chiTiet.soLuong}
                              onChange={(event) =>
                                setDanhSachDaChon((hienTai) =>
                                  hienTai.map((item) =>
                                    item.maDonViSanPham === chiTiet.maDonViSanPham
                                      ? { ...item, soLuong: Number(event.target.value) }
                                      : item,
                                  ),
                                )
                              }
                              onBlur={() => chuanHoaSoLuongDaChon(chiTiet.maDonViSanPham)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.currentTarget.blur();
                                }
                              }}
                              disabled={dangTaoDon}
                            />
                          </td>
                          <td>
                            {dinhDangTien(chiTiet.giaSauKhuyenMai * chiTiet.soLuong)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="ds-ld-link-danger"
                              onClick={() => xoaSanPhamDaChon(chiTiet.maDonViSanPham)}
                              disabled={dangTaoDon}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="ds-ld-section">
              <div className="ds-ld-section-title">
                <h3>Địa chỉ giao hàng</h3>
                <span>Dược sĩ nhập theo thông tin đã xác nhận với khách</span>
              </div>

              <div className="ds-ld-form-grid">
                <div className="ds-ld-form-group">
                  <label htmlFor="dsLdTenNguoiNhan">Họ tên người nhận</label>
                  <input
                    id="dsLdTenNguoiNhan"
                    type="text"
                    value={tenNguoiNhan}
                    onChange={(event) => setTenNguoiNhan(event.target.value)}
                    maxLength={100}
                    disabled={dangTaoDon}
                  />
                </div>

                <div className="ds-ld-form-group">
                  <label htmlFor="dsLdSoDienThoai">Số điện thoại nhận hàng</label>
                  <input
                    id="dsLdSoDienThoai"
                    type="text"
                    value={soDienThoaiNhan}
                    onChange={(event) => setSoDienThoaiNhan(event.target.value)}
                    maxLength={10}
                    disabled={dangTaoDon}
                  />
                </div>

                <div className="ds-ld-form-group">
                  <label htmlFor="dsLdThanhPho">Tỉnh / Thành phố</label>
                  <input
                    id="dsLdThanhPho"
                    type="text"
                    value={thanhPho}
                    readOnly
                    aria-readonly="true"
                    title="Pharma+ hiện chỉ hỗ trợ giao hàng tại Thành phố Hồ Chí Minh"
                  />
                </div>

                <div className="ds-ld-form-group">
                  <label htmlFor="dsLdPhuong">Phường / Khu vực</label>
                  <input
                    id="dsLdPhuong"
                    type="text"
                    value={phuongKhuVuc}
                    onChange={(event) => setPhuongKhuVuc(event.target.value)}
                    maxLength={150}
                    disabled={dangTaoDon}
                  />
                </div>

                <div className="ds-ld-form-group ds-ld-form-group--full">
                  <label htmlFor="dsLdDiaChiChiTiet">Địa chỉ chi tiết</label>
                  <input
                    id="dsLdDiaChiChiTiet"
                    type="text"
                    value={diaChiChiTiet}
                    onChange={(event) => setDiaChiChiTiet(event.target.value)}
                    maxLength={255}
                    disabled={dangTaoDon}
                  />
                </div>
              </div>

              <label className="ds-ld-checkbox">
                <input
                  type="checkbox"
                  checked={laMacDinh}
                  onChange={(event) => setLaMacDinh(event.target.checked)}
                  disabled={dangTaoDon}
                />
                Đặt địa chỉ này làm mặc định của khách hàng
              </label>
            </section>

            <section className="ds-ld-section">
              <div className="ds-ld-section-title">
                <h3>Thanh toán và ghi chú</h3>
              </div>

              <div className="ds-ld-form-grid">
                <div className="ds-ld-form-group">
                  <label htmlFor="dsLdThanhToan">Phương thức thanh toán</label>
                  <select
                    id="dsLdThanhToan"
                    value={phuongThucThanhToan}
                    onChange={(event) =>
                      setPhuongThucThanhToan(event.target.value as "COD" | "ZALOPAY")
                    }
                    disabled={dangTaoDon}
                  >
                    <option value="COD">COD - Thanh toán khi nhận hàng</option>
                    <option value="ZALOPAY">ZaloPay</option>
                  </select>
                </div>

                <div className="ds-ld-form-group ds-ld-form-group--full">
                  <label htmlFor="dsLdGhiChu">Ghi chú</label>
                  <textarea
                    id="dsLdGhiChu"
                    value={ghiChu}
                    onChange={(event) => setGhiChu(event.target.value)}
                    maxLength={255}
                    placeholder="Ghi chú giao hàng nếu có"
                    disabled={dangTaoDon}
                  />
                </div>
              </div>
            </section>

            <section className="ds-ld-summary">
              <div>
                <span>Tiền sản phẩm</span>
                <strong>{dinhDangTien(tongTienSanPham)}</strong>
              </div>
              <div>
                <span>Phí giao hàng</span>
                <strong>{dinhDangTien(PHI_GIAO_HANG)}</strong>
              </div>
              <div className="ds-ld-summary-total">
                <span>Tổng thanh toán dự kiến</span>
                <strong>{dinhDangTien(tongThanhToanDuKien)}</strong>
              </div>
            </section>
          </div>

          <div className="ds-ld-footer">
            <button
              type="button"
              className="ds-ld-button ds-ld-button--secondary"
              onClick={onDong}
              disabled={dangTaoDon}
            >
              Hủy
            </button>
            <button
              type="button"
              className="ds-ld-button ds-ld-button--primary"
              onClick={moXacNhanTaoDon}
              disabled={dangTaoDon}
            >
              {dangTaoDon ? "Đang tạo đơn..." : "Tạo đơn hàng"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LenDonChoKhachModal;
