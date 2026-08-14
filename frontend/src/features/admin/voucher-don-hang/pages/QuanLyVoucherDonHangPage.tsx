import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { isAxiosError } from "axios";

import ThongBaoHeThong
  from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong }
  from "../../../../shared/hooks/useThongBaoHeThong";

import AdminLoading
  from "../../shared/components/loading/AdminLoading";
import TieuDeTrangQuanLy
  from "../../shared/components/quan-ly/TieuDeTrangQuanLy";
import AdminXacNhan
  from "../../shared/components/xac-nhan/AdminXacNhan";

import {
  capNhatVoucherDonHang,
  doiTrangThaiVoucherDonHang,
  layDanhSachVoucherDonHang,
  themVoucherDonHang,
} from "../api/voucherDonHangApi";

import type {
  KieuGiamGia,
  VoucherDonHang,
  VoucherDonHangRequest,
} from "../types/VoucherDonHang";

import "../../shared/styles/quan-ly/QuanLyCommon.css";
import "../styles/QuanLyVoucherDonHang.css";

type ApiErrorResponse = {
  message?: string;
};

const dinhDangTien = (
  giaTri: number | null | undefined,
) => {
  if (
    giaTri === null
    || giaTri === undefined
  ) {
    return "-";
  }

  return new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  ).format(giaTri);
};

const dinhDangNgayGio = (
  giaTri: string,
) => {
  const ngay = new Date(giaTri);

  if (
    Number.isNaN(
      ngay.getTime(),
    )
  ) {
    return giaTri;
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(ngay);
};

const chuyenSangDatetimeLocal = (
  giaTri: string,
) => {
  if (!giaTri) {
    return "";
  }

  return giaTri.substring(
    0,
    16,
  );
};

const chuyenSangLocalDateTimeRequest =
  (
    giaTri: string,
  ) => {
    if (
      giaTri.length === 16
    ) {
      return `${giaTri}:00`;
    }

    return giaTri;
  };

const layThongBaoLoi = (
  error: unknown,
  macDinh: string,
) => {
  if (
    isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return (
      error.response?.data?.message
      ?? macDinh
    );
  }

  return macDinh;
};

function QuanLyVoucherDonHangPage() {
  const thongBao =
    useThongBaoHeThong();

  const [
    danhSachVoucher,
    setDanhSachVoucher,
  ] = useState<VoucherDonHang[]>([]);

  const [
    dangTai,
    setDangTai,
  ] = useState(true);

  const [
    loiTaiDanhSach,
    setLoiTaiDanhSach,
  ] = useState("");

  const [
    hienForm,
    setHienForm,
  ] = useState(false);

  const [
    voucherCanSua,
    setVoucherCanSua,
  ] = useState<VoucherDonHang | null>(
    null,
  );

  const [
    maGiamGia,
    setMaGiamGia,
  ] = useState("");

  const [
    tenVoucher,
    setTenVoucher,
  ] = useState("");

  const [
    loaiGiamGia,
    setLoaiGiamGia,
  ] = useState<KieuGiamGia>(
    "PHAN_TRAM",
  );

  const [
    giaTriGiam,
    setGiaTriGiam,
  ] = useState("");

  const [
    soTienGiamToiDa,
    setSoTienGiamToiDa,
  ] = useState("");

  const [
    donGiaToiThieu,
    setDonGiaToiThieu,
  ] = useState("0");

  const [
    thoiGianBatDau,
    setThoiGianBatDau,
  ] = useState("");

  const [
    thoiGianKetThuc,
    setThoiGianKetThuc,
  ] = useState("");

  const [
    soLuongSuDung,
    setSoLuongSuDung,
  ] = useState("");

  const [
    dangLuu,
    setDangLuu,
  ] = useState(false);

  const [
    voucherChoDoiTrangThai,
    setVoucherChoDoiTrangThai,
  ] = useState<VoucherDonHang | null>(
    null,
  );

  const [
    dangDoiTrangThai,
    setDangDoiTrangThai,
  ] = useState(false);

  const taiDanhSach =
    useCallback(async () => {
      try {
        setDangTai(true);
        setLoiTaiDanhSach("");

        const duLieu =
          await layDanhSachVoucherDonHang();

        setDanhSachVoucher(
          duLieu,
        );
      } catch (error) {
        console.error(
          "Không thể tải danh sách voucher:",
          error,
        );

        setDanhSachVoucher([]);

        setLoiTaiDanhSach(
          "Không thể tải danh sách voucher đơn hàng.",
        );
      } finally {
        setDangTai(false);
      }
    }, []);

  useEffect(() => {
    void taiDanhSach();
  }, [taiDanhSach]);

  const moFormThem = () => {
    setVoucherCanSua(null);

    setMaGiamGia("");
    setTenVoucher("");
    setLoaiGiamGia(
      "PHAN_TRAM",
    );
    setGiaTriGiam("");
    setSoTienGiamToiDa("");
    setDonGiaToiThieu("0");
    setThoiGianBatDau("");
    setThoiGianKetThuc("");
    setSoLuongSuDung("");

    setHienForm(true);
  };

  const moFormSua = (
    voucher: VoucherDonHang,
  ) => {
    setVoucherCanSua(
      voucher,
    );

    setMaGiamGia(
      voucher.maGiamGia,
    );

    setTenVoucher(
      voucher.tenVoucher,
    );

    setLoaiGiamGia(
      voucher.loaiGiamGia,
    );

    setGiaTriGiam(
      String(
        voucher.giaTriGiam,
      ),
    );

    setSoTienGiamToiDa(
      voucher.soTienGiamToiDa
        === null
        ? ""
        : String(
            voucher.soTienGiamToiDa,
          ),
    );

    setDonGiaToiThieu(
      String(
        voucher.donGiaToiThieu,
      ),
    );

    setThoiGianBatDau(
      chuyenSangDatetimeLocal(
        voucher.thoiGianBatDau,
      ),
    );

    setThoiGianKetThuc(
      chuyenSangDatetimeLocal(
        voucher.thoiGianKetThuc,
      ),
    );

    setSoLuongSuDung(
      String(
        voucher.soLuongSuDung,
      ),
    );

    setHienForm(true);
  };

  const dongForm = () => {
    if (dangLuu) {
      return;
    }

    setHienForm(false);
    setVoucherCanSua(null);
  };

  const xuLyLuu =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const maDaChuanHoa =
        maGiamGia
          .trim()
          .toUpperCase();

      const tenDaChuanHoa =
        tenVoucher.trim();

      const giaTriGiamSo =
        Number(giaTriGiam);

      const soTienGiamToiDaSo =
        soTienGiamToiDa.trim()
          ? Number(
              soTienGiamToiDa,
            )
          : null;

      const donGiaToiThieuSo =
        Number(
          donGiaToiThieu,
        );

      const soLuongSuDungSo =
        Number(
          soLuongSuDung,
        );

      if (!maDaChuanHoa) {
        thongBao.hienThongBao(
          "Mã giảm giá không được để trống.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        maDaChuanHoa.length
        > 50
      ) {
        thongBao.hienThongBao(
          "Mã giảm giá không được vượt quá 50 ký tự.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (!tenDaChuanHoa) {
        thongBao.hienThongBao(
          "Tên voucher không được để trống.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        tenDaChuanHoa.length
        > 200
      ) {
        thongBao.hienThongBao(
          "Tên voucher không được vượt quá 200 ký tự.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !Number.isFinite(
          giaTriGiamSo,
        )
        || giaTriGiamSo <= 0
      ) {
        thongBao.hienThongBao(
          "Giá trị giảm phải lớn hơn 0.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        soTienGiamToiDaSo
          !== null
        && (
          !Number.isFinite(
            soTienGiamToiDaSo,
          )
          || soTienGiamToiDaSo
            < 0
        )
      ) {
        thongBao.hienThongBao(
          "Số tiền giảm tối đa không được nhỏ hơn 0.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !Number.isFinite(
          donGiaToiThieuSo,
        )
        || donGiaToiThieuSo
          < 0
      ) {
        thongBao.hienThongBao(
          "Đơn hàng tối thiểu không được nhỏ hơn 0.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !thoiGianBatDau
        || !thoiGianKetThuc
      ) {
        thongBao.hienThongBao(
          "Phải nhập đầy đủ thời gian bắt đầu và kết thúc.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      const ngayBatDau =
        new Date(
          thoiGianBatDau,
        );

      const ngayKetThuc =
        new Date(
          thoiGianKetThuc,
        );

      if (
        ngayKetThuc
          .getTime()
        <= ngayBatDau
          .getTime()
      ) {
        thongBao.hienThongBao(
          "Thời gian kết thúc phải sau thời gian bắt đầu.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !Number.isInteger(
          soLuongSuDungSo,
        )
        || soLuongSuDungSo
          < 1
      ) {
        thongBao.hienThongBao(
          "Số lượng sử dụng phải lớn hơn hoặc bằng 1.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      const request:
        VoucherDonHangRequest =
      {
        maGiamGia:
          maDaChuanHoa,

        tenVoucher:
          tenDaChuanHoa,

        loaiGiamGia,

        giaTriGiam:
          giaTriGiamSo,

        soTienGiamToiDa:
          soTienGiamToiDaSo,

        donGiaToiThieu:
          donGiaToiThieuSo,

        thoiGianBatDau:
          chuyenSangLocalDateTimeRequest(
            thoiGianBatDau,
          ),

        thoiGianKetThuc:
          chuyenSangLocalDateTimeRequest(
            thoiGianKetThuc,
          ),

        soLuongSuDung:
          soLuongSuDungSo,
      };

      try {
        setDangLuu(true);

        if (voucherCanSua) {
          await capNhatVoucherDonHang(
            voucherCanSua.maVoucher,
            request,
          );

          thongBao.hienThongBao(
            "Cập nhật voucher thành công.",
            "THANH_CONG",
            "Thành công",
          );
        } else {
          await themVoucherDonHang(
            request,
          );

          thongBao.hienThongBao(
            "Thêm voucher thành công.",
            "THANH_CONG",
            "Thành công",
          );
        }

        setHienForm(false);
        setVoucherCanSua(null);

        await taiDanhSach();
      } catch (error) {
        console.error(
          "Không thể lưu voucher:",
          error,
        );

        thongBao.hienThongBao(
          layThongBaoLoi(
            error,
            "Không thể lưu voucher.",
          ),
          "LOI",
          "Không thể lưu dữ liệu",
        );
      } finally {
        setDangLuu(false);
      }
    };

  const moXacNhanDoiTrangThai =
    (
      voucher:
        VoucherDonHang,
    ) => {
      setVoucherChoDoiTrangThai(
        voucher,
      );
    };

  const dongXacNhanDoiTrangThai =
    () => {
      if (
        dangDoiTrangThai
      ) {
        return;
      }

      setVoucherChoDoiTrangThai(
        null,
      );
    };

  const xacNhanDoiTrangThai =
    async () => {
      if (
        !voucherChoDoiTrangThai
      ) {
        return;
      }

      try {
        setDangDoiTrangThai(
          true,
        );

        await doiTrangThaiVoucherDonHang(
          voucherChoDoiTrangThai.maVoucher,
        );

        thongBao.hienThongBao(
          voucherChoDoiTrangThai.trangThai
            ? "Ngừng hoạt động voucher thành công."
            : "Kích hoạt voucher thành công.",
          "THANH_CONG",
          "Thành công",
        );

        setVoucherChoDoiTrangThai(
          null,
        );

        await taiDanhSach();
      } catch (error) {
        console.error(
          "Không thể đổi trạng thái voucher:",
          error,
        );

        thongBao.hienThongBao(
          layThongBaoLoi(
            error,
            "Không thể thay đổi trạng thái voucher.",
          ),
          "LOI",
          "Không thể thực hiện thao tác",
        );
      } finally {
        setDangDoiTrangThai(
          false,
        );
      }
    };

  return (
    <div className="ql-page voucher-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý voucher đơn hàng"
        moTa="Tạo và quản lý các mã giảm giá áp dụng ở cấp đơn hàng"
      />

      <section className="voucher-section">
        <div className="voucher-section-header">
          <div>
            <h2>
              Danh sách voucher
            </h2>

            <p>
              Tổng cộng{" "}
              <strong>
                {
                  danhSachVoucher.length
                }
              </strong>{" "}
              voucher.
            </p>
          </div>

          <button
            type="button"
            className="ql-button ql-button-primary"
            onClick={moFormThem}
          >
            <i className="bi bi-plus-lg" />
            Thêm voucher
          </button>
        </div>

        {loiTaiDanhSach && (
          <div className="voucher-error">
            <i className="bi bi-exclamation-circle-fill" />
            {loiTaiDanhSach}
          </div>
        )}

        <div className="voucher-table-wrapper">
          <table className="voucher-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Voucher</th>
                <th>Loại giảm</th>
                <th>Giá trị giảm</th>
                <th>Đơn tối thiểu</th>
                <th>Thời gian</th>
                <th>Sử dụng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {dangTai
                ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="voucher-table-message"
                    >
                      <AdminLoading
                        noiDung="Đang tải danh sách voucher..."
                      />
                    </td>
                  </tr>
                )
                : danhSachVoucher.length
                  === 0
                  ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="voucher-table-message"
                      >
                        Chưa có voucher đơn hàng.
                      </td>
                    </tr>
                  )
                  : danhSachVoucher.map(
                    (voucher) => (
                      <tr
                        key={
                          voucher.maVoucher
                        }
                      >
                        <td>
                          <strong className="voucher-code">
                            {
                              voucher.maGiamGia
                            }
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {
                              voucher.tenVoucher
                            }
                          </strong>
                        </td>

                        <td>
                          {voucher.loaiGiamGia
                            === "PHAN_TRAM"
                            ? "Phần trăm"
                            : "Số tiền"}
                        </td>

                        <td>
                          <div>
                            <strong>
                              {voucher.loaiGiamGia
                                === "PHAN_TRAM"
                                ? `${voucher.giaTriGiam}%`
                                : dinhDangTien(
                                    voucher.giaTriGiam,
                                  )}
                            </strong>

                            {voucher.soTienGiamToiDa
                              !== null
                              && (
                                <small className="voucher-subtext">
                                  Tối đa:{" "}
                                  {dinhDangTien(
                                    voucher.soTienGiamToiDa,
                                  )}
                                </small>
                              )}
                          </div>
                        </td>

                        <td>
                          {dinhDangTien(
                            voucher.donGiaToiThieu,
                          )}
                        </td>

                        <td>
                          <div className="voucher-time">
                            <span>
                              {dinhDangNgayGio(
                                voucher.thoiGianBatDau,
                              )}
                            </span>

                            <span>
                              →
                            </span>

                            <span>
                              {dinhDangNgayGio(
                                voucher.thoiGianKetThuc,
                              )}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="voucher-usage">
                            {
                              voucher.soLuongDaSuDung
                            }
                            /
                            {
                              voucher.soLuongSuDung
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              voucher.trangThai
                                ? "voucher-status voucher-status-active"
                                : "voucher-status voucher-status-inactive"
                            }
                          >
                            {voucher.trangThai
                              ? "Hoạt động"
                              : "Ngừng hoạt động"}
                          </span>
                        </td>

                        <td>
                          <div className="voucher-actions">
                            <button
                              type="button"
                              className="voucher-action-button"
                              onClick={() =>
                                moFormSua(
                                  voucher,
                                )
                              }
                              title="Chỉnh sửa"
                            >
                              <i className="bi bi-pencil-square" />
                            </button>

                            <button
                              type="button"
                              className={
                                voucher.trangThai
                                  ? "voucher-action-button voucher-action-danger"
                                  : "voucher-action-button voucher-action-success"
                              }
                              onClick={() =>
                                moXacNhanDoiTrangThai(
                                  voucher,
                                )
                              }
                              title={
                                voucher.trangThai
                                  ? "Ngừng hoạt động"
                                  : "Kích hoạt"
                              }
                            >
                              <i
                                className={
                                  voucher.trangThai
                                    ? "bi bi-eye-slash"
                                    : "bi bi-eye"
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
            </tbody>
          </table>
        </div>
      </section>

      {hienForm && (
        <div className="voucher-modal-overlay">
          <div className="voucher-modal">
            <div className="voucher-modal-header">
              <div>
                <h2>
                  {voucherCanSua
                    ? "Cập nhật voucher"
                    : "Thêm voucher"}
                </h2>

                <p>
                  Thiết lập điều kiện và giá trị giảm cho đơn hàng.
                </p>
              </div>

              <button
                type="button"
                className="voucher-modal-close"
                onClick={dongForm}
                disabled={dangLuu}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={xuLyLuu}
            >
              <div className="voucher-modal-body">
                <div className="voucher-form-grid">
                  <div className="voucher-form-group">
                    <label htmlFor="voucherMaGiamGia">
                      Mã giảm giá *
                    </label>

                    <input
                      id="voucherMaGiamGia"
                      type="text"
                      value={maGiamGia}
                      maxLength={50}
                      onChange={(event) =>
                        setMaGiamGia(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                      placeholder="VD: SALE100K"
                    />
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherTen">
                      Tên voucher *
                    </label>

                    <input
                      id="voucherTen"
                      type="text"
                      value={tenVoucher}
                      maxLength={200}
                      onChange={(event) =>
                        setTenVoucher(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherLoaiGiamGia">
                      Loại giảm giá *
                    </label>

                    <select
                      id="voucherLoaiGiamGia"
                      value={loaiGiamGia}
                      onChange={(event) =>
                        setLoaiGiamGia(
                          event.target.value as KieuGiamGia,
                        )
                      }
                      disabled={dangLuu}
                    >
                      <option value="PHAN_TRAM">
                        Phần trăm
                      </option>

                      <option value="SO_TIEN">
                        Số tiền
                      </option>
                    </select>
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherGiaTriGiam">
                      Giá trị giảm *
                    </label>

                    <input
                      id="voucherGiaTriGiam"
                      type="number"
                      value={giaTriGiam}
                      min={0}
                      step="0.01"
                      onChange={(event) =>
                        setGiaTriGiam(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />

                    <small>
                      {loaiGiamGia
                        === "PHAN_TRAM"
                        ? "Nhập tỷ lệ %, ví dụ 10."
                        : "Nhập số tiền giảm."}
                    </small>
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherGiamToiDa">
                      Số tiền giảm tối đa
                    </label>

                    <input
                      id="voucherGiamToiDa"
                      type="number"
                      value={soTienGiamToiDa}
                      min={0}
                      step="0.01"
                      onChange={(event) =>
                        setSoTienGiamToiDa(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />

                    <small>
                      Có thể để trống.
                    </small>
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherDonToiThieu">
                      Đơn hàng tối thiểu *
                    </label>

                    <input
                      id="voucherDonToiThieu"
                      type="number"
                      value={donGiaToiThieu}
                      min={0}
                      step="0.01"
                      onChange={(event) =>
                        setDonGiaToiThieu(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherBatDau">
                      Thời gian bắt đầu *
                    </label>

                    <input
                      id="voucherBatDau"
                      type="datetime-local"
                      value={thoiGianBatDau}
                      onChange={(event) =>
                        setThoiGianBatDau(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherKetThuc">
                      Thời gian kết thúc *
                    </label>

                    <input
                      id="voucherKetThuc"
                      type="datetime-local"
                      value={thoiGianKetThuc}
                      onChange={(event) =>
                        setThoiGianKetThuc(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />
                  </div>

                  <div className="voucher-form-group">
                    <label htmlFor="voucherSoLuong">
                      Số lượng sử dụng *
                    </label>

                    <input
                      id="voucherSoLuong"
                      type="number"
                      value={soLuongSuDung}
                      min={1}
                      step={1}
                      onChange={(event) =>
                        setSoLuongSuDung(
                          event.target.value,
                        )
                      }
                      disabled={dangLuu}
                    />

                    {voucherCanSua && (
                      <small>
                        Đã sử dụng:{" "}
                        {
                          voucherCanSua.soLuongDaSuDung
                        }
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="voucher-modal-footer">
                <button
                  type="button"
                  className="ql-button ql-button-ghost"
                  onClick={dongForm}
                  disabled={dangLuu}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="ql-button ql-button-primary"
                  disabled={dangLuu}
                >
                  {dangLuu
                    ? "Đang lưu..."
                    : voucherCanSua
                      ? "Cập nhật"
                      : "Thêm voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminXacNhan
        dangHien={
          voucherChoDoiTrangThai
          !== null
        }
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={
          voucherChoDoiTrangThai
            ? voucherChoDoiTrangThai.trangThai
              ? `Bạn có chắc muốn ngừng hoạt động voucher "${voucherChoDoiTrangThai.maGiamGia}"?`
              : `Bạn có chắc muốn kích hoạt lại voucher "${voucherChoDoiTrangThai.maGiamGia}"?`
            : ""
        }
        nhanXacNhan="Xác nhận"
        nhanHuy="Hủy"
        dangXuLy={
          dangDoiTrangThai
        }
        onXacNhan={
          xacNhanDoiTrangThai
        }
        onHuy={
          dongXacNhanDoiTrangThai
        }
      />

      <ThongBaoHeThong
        dangHien={
          thongBao.dangHien
        }
        tieuDe={
          thongBao.tieuDe
        }
        noiDung={
          thongBao.noiDung
        }
        loai={
          thongBao.loai
        }
        dongThongBao={
          thongBao.dongThongBao
        }
      />
    </div>
  );
}

export default QuanLyVoucherDonHangPage;