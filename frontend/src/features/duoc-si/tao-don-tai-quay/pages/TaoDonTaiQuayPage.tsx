import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import DuocSiLoading from "../../shared/components/loading/DuocSiLoading";
import DuocSiXacNhan from "../../shared/components/xac-nhan/DuocSiXacNhan";

import {
  layDanhSachKhachHangDuocSi,
  layDanhSachSanPhamTaiQuay,
  taoDonTaiQuayDuocSi,
} from "../api/taoDonTaiQuayApi";

import type {
  KhachHangDuocSi,
  LoaiKhachTaiQuay,
  SanPhamDaChonLenDon,
  SanPhamDuocSi,
  TaoDonTaiQuayRequest,
} from "../types/TaoDonTaiQuay";

import "../styles/TaoDonTaiQuayPage.css";

const SO_KHACH_HANG_MOI_TRANG = 8;
const SO_SAN_PHAM_MOI_TRANG = 8;

function dinhDangTien(giaTri: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(giaTri);
}

function layThongBaoLoi(error: unknown, macDinh: string) {
  if (
    isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === "object"
  ) {
    const duLieu = error.response.data as {
      message?: string;
      detail?: string;
      error?: string;
    };

    return duLieu.message || duLieu.detail || duLieu.error || macDinh;
  }

  return macDinh;
}

function TaoDonTaiQuayPage() {
  const navigate = useNavigate();
  const thongBao = useThongBaoHeThong();

  const [loaiKhach, setLoaiKhach] =
    useState<LoaiKhachTaiQuay>("VANG_LAI");

  const [tuKhoaKhachInput, setTuKhoaKhachInput] = useState("");
  const [tuKhoaKhach, setTuKhoaKhach] = useState("");
  const [daTimKhachHang, setDaTimKhachHang] = useState(false);
  const [trangKhachHang, setTrangKhachHang] = useState(0);
  const [tongTrangKhachHang, setTongTrangKhachHang] = useState(0);
  const [danhSachKhachHang, setDanhSachKhachHang] = useState<KhachHangDuocSi[]>([]);
  const [khachHangDaChon, setKhachHangDaChon] =
    useState<KhachHangDuocSi | null>(null);
  const [dangTaiKhachHang, setDangTaiKhachHang] = useState(false);
  const [loiTaiKhachHang, setLoiTaiKhachHang] = useState<string | null>(null);

  const [tuKhoaSanPhamInput, setTuKhoaSanPhamInput] = useState("");
  const [tuKhoaSanPham, setTuKhoaSanPham] = useState("");
  const [trangSanPham, setTrangSanPham] = useState(0);
  const [tongTrangSanPham, setTongTrangSanPham] = useState(0);
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPhamDuocSi[]>([]);
  const [dangTaiSanPham, setDangTaiSanPham] = useState(false);
  const [loiTaiSanPham, setLoiTaiSanPham] = useState<string | null>(null);

  const [maDonViDangChon, setMaDonViDangChon] =
    useState<Record<number, number>>({});

  const [danhSachDaChon, setDanhSachDaChon] =
    useState<SanPhamDaChonLenDon[]>([]);

  const [ghiChu, setGhiChu] = useState("");
  const [dangXacNhan, setDangXacNhan] = useState(false);
  const [dangTaoDon, setDangTaoDon] = useState(false);

  const taiKhachHang = useCallback(async () => {
    if (
      loaiKhach !== "CO_TAI_KHOAN" ||
      !daTimKhachHang ||
      !tuKhoaKhach.trim()
    ) {
      setDanhSachKhachHang([]);
      setTongTrangKhachHang(0);
      setLoiTaiKhachHang(null);
      return;
    }

    try {
      setDangTaiKhachHang(true);
      setLoiTaiKhachHang(null);

      const duLieu = await layDanhSachKhachHangDuocSi(
        trangKhachHang,
        SO_KHACH_HANG_MOI_TRANG,
        tuKhoaKhach,
      );

      setDanhSachKhachHang(duLieu.content);
      setTongTrangKhachHang(duLieu.totalPages);
    } catch (error) {
      console.error("Không thể tải danh sách khách hàng:", error);
      setDanhSachKhachHang([]);
      setTongTrangKhachHang(0);
      setLoiTaiKhachHang(
        layThongBaoLoi(error, "Không thể tải danh sách khách hàng."),
      );
    } finally {
      setDangTaiKhachHang(false);
    }
  }, [loaiKhach, daTimKhachHang, trangKhachHang, tuKhoaKhach]);

  const taiSanPham = useCallback(async () => {
    try {
      setDangTaiSanPham(true);
      setLoiTaiSanPham(null);

      const duLieu = await layDanhSachSanPhamTaiQuay(
        trangSanPham,
        SO_SAN_PHAM_MOI_TRANG,
        tuKhoaSanPham,
      );

      setDanhSachSanPham(duLieu.content);
      setTongTrangSanPham(duLieu.totalPages);

      setMaDonViDangChon((hienTai) => {
        const ketQua = { ...hienTai };

        duLieu.content.forEach((sanPham) => {
          if (ketQua[sanPham.maSanPham]) {
            return;
          }

          const donViMacDinh =
            sanPham.danhSachDonViBan.find(
              (donVi) => donVi.laDonViBanMacDinh,
            ) || sanPham.danhSachDonViBan[0];

          if (donViMacDinh) {
            ketQua[sanPham.maSanPham] = donViMacDinh.maDonViSanPham;
          }
        });

        return ketQua;
      });
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm:", error);
      setDanhSachSanPham([]);
      setTongTrangSanPham(0);
      setLoiTaiSanPham(
        layThongBaoLoi(error, "Không thể tải danh sách sản phẩm."),
      );
    } finally {
      setDangTaiSanPham(false);
    }
  }, [trangSanPham, tuKhoaSanPham]);

  useEffect(() => {
    void taiKhachHang();
  }, [taiKhachHang]);

  useEffect(() => {
    void taiSanPham();
  }, [taiSanPham]);

  const tongThanhToanDuKien = useMemo(
    () =>
      danhSachDaChon.reduce(
        (tong, chiTiet) =>
          tong + chiTiet.giaSauKhuyenMai * chiTiet.soLuong,
        0,
      ),
    [danhSachDaChon],
  );

  const doiLoaiKhach = (giaTri: LoaiKhachTaiQuay) => {
    setLoaiKhach(giaTri);
    setKhachHangDaChon(null);
    setTuKhoaKhachInput("");
    setTuKhoaKhach("");
    setDaTimKhachHang(false);
    setTrangKhachHang(0);
    setDanhSachKhachHang([]);
    setTongTrangKhachHang(0);
    setLoiTaiKhachHang(null);
  };

  const timKiemKhachHang = (event: FormEvent) => {
    event.preventDefault();

    const tuKhoa = tuKhoaKhachInput.trim();

    if (!tuKhoa) {
      setDaTimKhachHang(false);
      setTuKhoaKhach("");
      setTrangKhachHang(0);
      setDanhSachKhachHang([]);
      setTongTrangKhachHang(0);
      setKhachHangDaChon(null);

      thongBao.hienThongBao(
        "Vui lòng nhập tên hoặc số điện thoại khách hàng cần tìm.",
        "CANH_BAO",
        "Chưa nhập từ khóa",
      );
      return;
    }

    setKhachHangDaChon(null);
    setTrangKhachHang(0);
    setDaTimKhachHang(true);
    setTuKhoaKhach(tuKhoa);
  };

  const xoaTimKiemKhachHang = () => {
    setTuKhoaKhachInput("");
    setTuKhoaKhach("");
    setDaTimKhachHang(false);
    setTrangKhachHang(0);
    setTongTrangKhachHang(0);
    setDanhSachKhachHang([]);
    setKhachHangDaChon(null);
    setLoiTaiKhachHang(null);
  };

  const timKiemSanPham = (event: FormEvent) => {
    event.preventDefault();
    setTrangSanPham(0);
    setTuKhoaSanPham(tuKhoaSanPhamInput.trim());
  };

  const layDonViDangChon = (sanPham: SanPhamDuocSi) => {
    const maDonVi = maDonViDangChon[sanPham.maSanPham];

    return (
      sanPham.danhSachDonViBan.find(
        (donVi) => donVi.maDonViSanPham === maDonVi,
      ) || sanPham.danhSachDonViBan[0]
    );
  };

  const themSanPham = (sanPham: SanPhamDuocSi) => {
    const donVi = layDonViDangChon(sanPham);

    if (!donVi) {
      thongBao.hienThongBao(
        "Sản phẩm chưa có đơn vị bán hợp lệ.",
        "CANH_BAO",
        "Không thể thêm sản phẩm",
      );
      return;
    }

    if (donVi.soLuongToiDa <= 0) {
      thongBao.hienThongBao(
        "Đơn vị sản phẩm này đã hết hàng.",
        "CANH_BAO",
        "Hết hàng",
      );
      return;
    }

    const daCo = danhSachDaChon.some(
      (chiTiet) => chiTiet.maDonViSanPham === donVi.maDonViSanPham,
    );

    if (daCo) {
      thongBao.hienThongBao(
        "Đơn vị sản phẩm này đã có trong đơn.",
        "CANH_BAO",
        "Sản phẩm đã được chọn",
      );
      return;
    }

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
        soLuong: 1,
      },
    ]);
  };

  const capNhatSoLuong = (
    maDonViSanPham: number,
    giaTriMoi: string,
  ) => {
    const soLuongMoi = Number(giaTriMoi);

    if (!Number.isInteger(soLuongMoi)) {
      return;
    }

    setDanhSachDaChon((hienTai) =>
      hienTai.map((chiTiet) =>
        chiTiet.maDonViSanPham === maDonViSanPham
          ? {
              ...chiTiet,
              soLuong: soLuongMoi,
            }
          : chiTiet,
      ),
    );
  };

  const kiemTraSoLuongSauNhap = (maDonViSanPham: number) => {
    const chiTiet = danhSachDaChon.find(
      (item) => item.maDonViSanPham === maDonViSanPham,
    );

    if (!chiTiet) {
      return;
    }

    if (chiTiet.soLuong < 1) {
      setDanhSachDaChon((hienTai) =>
        hienTai.map((item) =>
          item.maDonViSanPham === maDonViSanPham
            ? { ...item, soLuong: 1 }
            : item,
        ),
      );

      thongBao.hienThongBao(
        "Số lượng tối thiểu là 1. Hệ thống đã đưa về 1.",
        "CANH_BAO",
        "Số lượng không hợp lệ",
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
      hienTai.filter(
        (chiTiet) => chiTiet.maDonViSanPham !== maDonViSanPham,
      ),
    );
  };

  const kiemTraDuLieuTaoDon = () => {
    if (loaiKhach === "CO_TAI_KHOAN" && !khachHangDaChon) {
      return "Vui lòng tìm kiếm và chọn khách hàng có tài khoản.";
    }

    if (danhSachDaChon.length === 0) {
      return "Vui lòng thêm ít nhất một sản phẩm vào đơn.";
    }

    if (
      danhSachDaChon.some(
        (chiTiet) =>
          chiTiet.soLuong < 1 ||
          chiTiet.soLuong > chiTiet.soLuongToiDa,
      )
    ) {
      return "Đơn hàng có số lượng sản phẩm không hợp lệ.";
    }

    if (ghiChu.trim().length > 255) {
      return "Ghi chú không được vượt quá 255 ký tự.";
    }

    return null;
  };

  const moXacNhanTaoDon = () => {
    const loi = kiemTraDuLieuTaoDon();

    if (loi) {
      thongBao.hienThongBao(
        loi,
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );
      return;
    }

    setDangXacNhan(true);
  };

  const taoRequest = (): TaoDonTaiQuayRequest => ({
    loaiKhach,
    maKhachHang:
      loaiKhach === "CO_TAI_KHOAN"
        ? khachHangDaChon?.maKhachHang || null
        : null,
    danhSachChiTiet: danhSachDaChon.map((chiTiet) => ({
      maDonViSanPham: chiTiet.maDonViSanPham,
      soLuong: chiTiet.soLuong,
    })),
    ghiChu: ghiChu.trim() || null,
  });

  const xacNhanTaoDon = async () => {
    try {
      setDangTaoDon(true);

      const donHang = await taoDonTaiQuayDuocSi(taoRequest());

      setDangXacNhan(false);

      thongBao.hienThongBao(
        `Đã tạo đơn tại quầy #${donHang.maDonHang}. Đơn đã thanh toán và hoàn tất.`,
        "THANH_CONG",
        "Tạo đơn thành công",
      );

      setDanhSachDaChon([]);
      setGhiChu("");
      setKhachHangDaChon(null);

      if (loaiKhach === "CO_TAI_KHOAN") {
        xoaTimKiemKhachHang();
      }

      await taiSanPham();
    } catch (error) {
      console.error("Không thể tạo đơn tại quầy:", error);

      setDangXacNhan(false);

      thongBao.hienThongBao(
        layThongBaoLoi(error, "Không thể tạo đơn tại quầy."),
        "LOI",
        "Tạo đơn thất bại",
      );
    } finally {
      setDangTaoDon(false);
    }
  };

  return (
    <div className="ds-pos-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <DuocSiXacNhan
        dangHien={dangXacNhan}
        tieuDe="Xác nhận thanh toán tại quầy"
        noiDung={`Xác nhận đã thu ${dinhDangTien(
          tongThanhToanDuKien,
        )} tiền mặt và tạo đơn tại quầy?`}
        nhanXacNhan="Xác nhận bán"
        loai="BINH_THUONG"
        dangXuLy={dangTaoDon}
        onXacNhan={() => void xacNhanTaoDon()}
        onHuy={() => {
          if (!dangTaoDon) {
            setDangXacNhan(false);
          }
        }}
      />

      <div className="ds-pos-header">
        <div>
          <h1>Tạo đơn tại quầy</h1>
          <p>
            Bán trực tiếp tại nhà thuốc. Thanh toán tiền mặt và xuất kho ngay.
          </p>
        </div>

        <button
          type="button"
          className="ds-pos-button ds-pos-button--secondary"
          onClick={() => navigate("/duoc-si/don-hang")}
        >
          Quản lý đơn hàng
        </button>
      </div>

      <div className="ds-pos-grid">
        <div className="ds-pos-main">
          <section className="ds-pos-card">
            <div className="ds-pos-card-title">
              <div>
                <h2>1. Khách hàng</h2>
                <p>Chọn khách có tài khoản hoặc khách vãng lai.</p>
              </div>
            </div>

            <div className="ds-pos-customer-type">
              <label>
                <input
                  type="radio"
                  name="loaiKhach"
                  checked={loaiKhach === "VANG_LAI"}
                  onChange={() => doiLoaiKhach("VANG_LAI")}
                  disabled={dangTaoDon}
                />
                Khách vãng lai
              </label>

              <label>
                <input
                  type="radio"
                  name="loaiKhach"
                  checked={loaiKhach === "CO_TAI_KHOAN"}
                  onChange={() => doiLoaiKhach("CO_TAI_KHOAN")}
                  disabled={dangTaoDon}
                />
                Khách có tài khoản
              </label>
            </div>

            {loaiKhach === "VANG_LAI" ? (
              <div className="ds-pos-note">
                Đơn sẽ được lưu là <strong>Khách vãng lai</strong> và không liên
                kết tài khoản khách hàng.
              </div>
            ) : (
              <>
                <form
                  className="ds-pos-search"
                  onSubmit={timKiemKhachHang}
                >
                  <input
                    type="text"
                    value={tuKhoaKhachInput}
                    onChange={(event) =>
                      setTuKhoaKhachInput(event.target.value)
                    }
                    placeholder="Nhập tên hoặc số điện thoại khách hàng..."
                    disabled={dangTaoDon}
                  />

                  <button
                    type="submit"
                    className="ds-pos-button ds-pos-button--secondary"
                    disabled={dangTaoDon}
                  >
                    Tìm khách
                  </button>

                  <button
                    type="button"
                    className="ds-pos-button ds-pos-button--secondary"
                    onClick={xoaTimKiemKhachHang}
                    disabled={dangTaoDon}
                  >
                    Xóa tìm kiếm
                  </button>
                </form>

                {khachHangDaChon ? (
                  <div className="ds-pos-selected-customer">
                    <span>Khách đã chọn</span>
                    <strong>{khachHangDaChon.hoTen}</strong>
                    <span>{khachHangDaChon.soDienThoai}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setKhachHangDaChon(null);
                        setDaTimKhachHang(false);
                        setDanhSachKhachHang([]);
                        setTongTrangKhachHang(0);
                      }}
                      disabled={dangTaoDon}
                    >
                      Chọn lại
                    </button>
                  </div>
                ) : !daTimKhachHang ? (
                  <div className="ds-pos-note">
                    Nhập <strong>tên</strong> hoặc <strong>số điện thoại</strong>,
                    sau đó bấm <strong>Tìm khách</strong> để chọn khách hàng.
                  </div>
                ) : dangTaiKhachHang ? (
                  <DuocSiLoading noiDung="Đang tìm khách hàng..." />
                ) : loiTaiKhachHang ? (
                  <div className="ds-pos-error">{loiTaiKhachHang}</div>
                ) : danhSachKhachHang.length === 0 ? (
                  <div className="ds-pos-empty">
                    Không tìm thấy khách hàng phù hợp.
                  </div>
                ) : (
                  <>
                    <div className="ds-pos-customer-list">
                      {danhSachKhachHang.map((khachHang) => (
                        <button
                          type="button"
                          key={khachHang.maKhachHang}
                          className="ds-pos-customer-item"
                          onClick={() => {
                            setKhachHangDaChon(khachHang);
                            setDanhSachKhachHang([]);
                            setTongTrangKhachHang(0);
                            setDaTimKhachHang(false);
                          }}
                          disabled={dangTaoDon}
                        >
                          <span>
                            <strong>{khachHang.hoTen}</strong>
                            <small>Mã khách #{khachHang.maKhachHang}</small>
                          </span>
                          <span>{khachHang.soDienThoai}</span>
                        </button>
                      ))}
                    </div>

                    {tongTrangKhachHang > 1 && (
                      <div className="ds-pos-pagination">
                        <button
                          type="button"
                          onClick={() =>
                            setTrangKhachHang((hienTai) =>
                              Math.max(hienTai - 1, 0),
                            )
                          }
                          disabled={
                            trangKhachHang <= 0 || dangTaiKhachHang
                          }
                        >
                          Trước
                        </button>

                        <span>
                          Trang {trangKhachHang + 1}/{tongTrangKhachHang}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setTrangKhachHang((hienTai) =>
                              Math.min(
                                hienTai + 1,
                                tongTrangKhachHang - 1,
                              ),
                            )
                          }
                          disabled={
                            trangKhachHang >= tongTrangKhachHang - 1 ||
                            dangTaiKhachHang
                          }
                        >
                          Sau
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>

          <section className="ds-pos-card">
            <div className="ds-pos-card-title">
              <div>
                <h2>2. Sản phẩm</h2>
                <p>Cho phép bán cả OTC và thuốc kê đơn do Dược sĩ thực hiện.</p>
              </div>
            </div>

            <form className="ds-pos-search" onSubmit={timKiemSanPham}>
              <input
                type="text"
                value={tuKhoaSanPhamInput}
                onChange={(event) =>
                  setTuKhoaSanPhamInput(event.target.value)
                }
                placeholder="Tìm theo tên sản phẩm..."
                disabled={dangTaoDon}
              />

              <button
                type="submit"
                className="ds-pos-button ds-pos-button--secondary"
                disabled={dangTaoDon}
              >
                Tìm sản phẩm
              </button>

              <button
                type="button"
                className="ds-pos-button ds-pos-button--secondary"
                onClick={() => {
                  setTuKhoaSanPhamInput("");
                  setTuKhoaSanPham("");
                  setTrangSanPham(0);
                }}
                disabled={dangTaoDon}
              >
                Xóa tìm kiếm
              </button>
            </form>

            {dangTaiSanPham ? (
              <DuocSiLoading noiDung="Đang tải sản phẩm..." />
            ) : loiTaiSanPham ? (
              <div className="ds-pos-error">{loiTaiSanPham}</div>
            ) : danhSachSanPham.length === 0 ? (
              <div className="ds-pos-empty">Không có sản phẩm phù hợp.</div>
            ) : (
              <>
                <div className="ds-pos-product-list">
                  {danhSachSanPham.map((sanPham) => {
                    const donVi = layDonViDangChon(sanPham);
                    const hetHang = !donVi || donVi.soLuongToiDa <= 0;

                    return (
                      <article
                        className="ds-pos-product"
                        key={sanPham.maSanPham}
                      >
                        <div className="ds-pos-product-info">
                          <div className="ds-pos-product-image">
                            {sanPham.hinhAnh ? (
                              <img
                                src={sanPham.hinhAnh}
                                alt={sanPham.tenSanPham}
                              />
                            ) : (
                              <span>Không ảnh</span>
                            )}
                          </div>

                          <div>
                            <strong>{sanPham.tenSanPham}</strong>
                            <span>Mã #{sanPham.maSanPham}</span>
                            {sanPham.laThuocKeDon && (
                              <span className="ds-pos-rx">
                                Thuốc kê đơn
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ds-pos-product-action">
                          <select
                            value={
                              maDonViDangChon[sanPham.maSanPham] || ""
                            }
                            onChange={(event) =>
                              setMaDonViDangChon((hienTai) => ({
                                ...hienTai,
                                [sanPham.maSanPham]: Number(
                                  event.target.value,
                                ),
                              }))
                            }
                            disabled={dangTaoDon}
                          >
                            {sanPham.danhSachDonViBan.map((donViBan) => (
                              <option
                                key={donViBan.maDonViSanPham}
                                value={donViBan.maDonViSanPham}
                              >
                                {donViBan.tenDonViTinh}
                                {donViBan.kyHieu
                                  ? ` (${donViBan.kyHieu})`
                                  : ""}
                              </option>
                            ))}
                          </select>

                          <div>
                            <strong>
                              {donVi
                                ? dinhDangTien(donVi.giaSauKhuyenMai)
                                : "—"}
                            </strong>
                            {donVi &&
                              donVi.giaGoc !== donVi.giaSauKhuyenMai && (
                                <small>
                                  Giá gốc {dinhDangTien(donVi.giaGoc)}
                                </small>
                              )}
                            <small>
                              Tối đa: {donVi?.soLuongToiDa ?? 0}
                            </small>
                          </div>

                          <button
                            type="button"
                            className="ds-pos-button ds-pos-button--primary"
                            onClick={() => themSanPham(sanPham)}
                            disabled={dangTaoDon || hetHang}
                          >
                            {hetHang ? "Hết hàng" : "Thêm"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {tongTrangSanPham > 1 && (
                  <div className="ds-pos-pagination">
                    <button
                      type="button"
                      onClick={() =>
                        setTrangSanPham((hienTai) =>
                          Math.max(hienTai - 1, 0),
                        )
                      }
                      disabled={trangSanPham <= 0 || dangTaiSanPham}
                    >
                      Trước
                    </button>

                    <span>
                      Trang {trangSanPham + 1}/{tongTrangSanPham}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setTrangSanPham((hienTai) =>
                          Math.min(
                            hienTai + 1,
                            tongTrangSanPham - 1,
                          ),
                        )
                      }
                      disabled={
                        trangSanPham >= tongTrangSanPham - 1 ||
                        dangTaiSanPham
                      }
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="ds-pos-side">
          <section className="ds-pos-card ds-pos-order-card">
            <div className="ds-pos-card-title">
              <div>
                <h2>3. Đơn bán</h2>
                <p>Kiểm tra lại trước khi xác nhận thanh toán.</p>
              </div>
            </div>

            {danhSachDaChon.length === 0 ? (
              <div className="ds-pos-empty">
                Chưa có sản phẩm trong đơn.
              </div>
            ) : (
              <div className="ds-pos-order-lines">
                {danhSachDaChon.map((chiTiet) => (
                  <div
                    className="ds-pos-order-line"
                    key={chiTiet.maDonViSanPham}
                  >
                    <div className="ds-pos-order-line-main">
                      <strong>{chiTiet.tenSanPham}</strong>
                      <span>
                        {chiTiet.tenDonViTinh}
                        {chiTiet.kyHieu
                          ? ` (${chiTiet.kyHieu})`
                          : ""}
                        {chiTiet.laThuocKeDon ? " • Rx" : ""}
                      </span>
                    </div>

                    <div className="ds-pos-order-line-controls">
                      <input
                        type="number"
                        min={1}
                        max={chiTiet.soLuongToiDa}
                        value={chiTiet.soLuong}
                        onChange={(event) =>
                          capNhatSoLuong(
                            chiTiet.maDonViSanPham,
                            event.target.value,
                          )
                        }
                        onBlur={() =>
                          kiemTraSoLuongSauNhap(
                            chiTiet.maDonViSanPham,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                        disabled={dangTaoDon}
                      />

                      <strong>
                        {dinhDangTien(
                          chiTiet.giaSauKhuyenMai *
                            chiTiet.soLuong,
                        )}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          xoaSanPhamDaChon(
                            chiTiet.maDonViSanPham,
                          )
                        }
                        disabled={dangTaoDon}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="ds-pos-summary">
              <div>
                <span>Loại khách</span>
                <strong>
                  {loaiKhach === "VANG_LAI"
                    ? "Khách vãng lai"
                    : khachHangDaChon?.hoTen ||
                      "Chưa chọn khách"}
                </strong>
              </div>

              <div>
                <span>Phương thức</span>
                <strong>Tiền mặt</strong>
              </div>

              <div>
                <span>Phí giao hàng</span>
                <strong>{dinhDangTien(0)}</strong>
              </div>

              <div className="ds-pos-summary-total">
                <span>Tổng thanh toán dự kiến</span>
                <strong>
                  {dinhDangTien(tongThanhToanDuKien)}
                </strong>
              </div>
            </div>

            <div className="ds-pos-form-group">
              <label htmlFor="dsPosGhiChu">Ghi chú</label>
              <textarea
                id="dsPosGhiChu"
                value={ghiChu}
                onChange={(event) => setGhiChu(event.target.value)}
                maxLength={255}
                rows={3}
                placeholder="Ghi chú nếu cần..."
                disabled={dangTaoDon}
              />
              <small>{ghiChu.length}/255</small>
            </div>

            <button
              type="button"
              className="ds-pos-button ds-pos-button--checkout"
              onClick={moXacNhanTaoDon}
              disabled={dangTaoDon}
            >
              {dangTaoDon
                ? "Đang tạo đơn..."
                : "Xác nhận thanh toán tiền mặt"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default TaoDonTaiQuayPage;
