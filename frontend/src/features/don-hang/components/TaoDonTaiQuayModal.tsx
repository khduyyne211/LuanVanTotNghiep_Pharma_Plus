import { useEffect, useMemo, useState } from "react";
import { laySanPhamBanTaiQuay, taoDonTaiQuay } from "../api/donHangApi";
import type {
  DonHangChiTiet,
  SanPhamBanTaiQuay,
} from "../types/DonHang";

type Props = {
  onDong: () => void;
  onTaoThanhCong: (donHang: DonHangChiTiet) => void;
};

type DongDonHang = {
  sanPham: SanPhamBanTaiQuay;
  soLuong: number;
};

const MA_DUOC_SI_TAM_THOI = 2;

const dinhDangTien = (giaTri: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri);

const layThongBaoLoi = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: { message?: string; error?: string } | string;
        };
      }
    ).response;

    if (typeof response?.data === "string") return response.data;
    return response?.data?.message || response?.data?.error || "Không thể tạo đơn hàng";
  }

  return "Không thể tạo đơn hàng";
};

export default function TaoDonTaiQuayModal({
  onDong,
  onTaoThanhCong,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPhamBanTaiQuay[]>([]);
  const [gioHang, setGioHang] = useState<DongDonHang[]>([]);
  const [dangTaiSanPham, setDangTaiSanPham] = useState(false);
  const [dangTaoDon, setDangTaoDon] = useState(false);
  const [phuongThucThanhToan, setPhuongThucThanhToan] =
    useState<"TIEN_MAT" | "QR">("TIEN_MAT");
  const [ghiChu, setGhiChu] = useState("");
  const [xacNhanDonThuoc, setXacNhanDonThuoc] = useState(false);
  const [ghiChuKiemDuyet, setGhiChuKiemDuyet] = useState("");
  const [loi, setLoi] = useState("");

  const coThuocKeDon = gioHang.some((dong) => dong.sanPham.laThuocKeDon);

  const tongTien = useMemo(
    () =>
      gioHang.reduce(
        (tong, dong) =>
          tong + dong.sanPham.giaBanTheoDonVi * dong.soLuong,
        0
      ),
    [gioHang]
  );

  useEffect(() => {
    const timerId = window.setTimeout(async () => {
      try {
        setDangTaiSanPham(true);
        const data = await laySanPhamBanTaiQuay(keyword.trim());
        setDanhSachSanPham(data);
      } catch (error) {
        console.error(error);
        setLoi("Không thể tải sản phẩm bán tại quầy");
      } finally {
        setDangTaiSanPham(false);
      }
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [keyword]);

  const themSanPham = (sanPham: SanPhamBanTaiQuay) => {
    setGioHang((danhSachCu) => {
      const daCo = danhSachCu.find(
        (dong) =>
          dong.sanPham.maDonViSanPham === sanPham.maDonViSanPham
      );

      if (daCo) {
        return danhSachCu.map((dong) =>
          dong.sanPham.maDonViSanPham === sanPham.maDonViSanPham
            ? { ...dong, soLuong: dong.soLuong + 1 }
            : dong
        );
      }

      return [...danhSachCu, { sanPham, soLuong: 1 }];
    });
  };

  const thayDoiSoLuong = (maDonViSanPham: number, soLuong: number) => {
    if (soLuong <= 0) {
      setGioHang((danhSachCu) =>
        danhSachCu.filter(
          (dong) =>
            dong.sanPham.maDonViSanPham !== maDonViSanPham
        )
      );
      return;
    }

    setGioHang((danhSachCu) =>
      danhSachCu.map((dong) =>
        dong.sanPham.maDonViSanPham === maDonViSanPham
          ? { ...dong, soLuong }
          : dong
      )
    );
  };

  const taoDon = async () => {
    setLoi("");

    if (gioHang.length === 0) {
      setLoi("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    if (coThuocKeDon && !xacNhanDonThuoc) {
      setLoi("Đơn có thuốc kê đơn, dược sĩ phải xác nhận đã kiểm tra đơn thuốc");
      return;
    }

    if (coThuocKeDon && !ghiChuKiemDuyet.trim()) {
      setLoi("Vui lòng nhập ghi chú kiểm duyệt đối với thuốc kê đơn");
      return;
    }

    try {
      setDangTaoDon(true);

      const donHang = await taoDonTaiQuay({
        maDuocSiXuLy: MA_DUOC_SI_TAM_THOI,
        phuongThucThanhToan,
        ghiChu: ghiChu.trim() || null,
        xacNhanDaKiemTraDonThuoc: coThuocKeDon
          ? xacNhanDonThuoc
          : false,
        ghiChuKiemDuyet: coThuocKeDon
          ? ghiChuKiemDuyet.trim()
          : null,
        danhSachChiTiet: gioHang.map((dong) => ({
          maDonViSanPham: dong.sanPham.maDonViSanPham,
          soLuong: dong.soLuong,
        })),
      });

      onTaoThanhCong(donHang);
    } catch (error) {
      console.error(error);
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangTaoDon(false);
    }
  };

  return (
    <div className="dh-modal-overlay">
      <div className="dh-modal dh-create-modal">
        <div className="dh-modal-header">
          <div>
            <p className="dh-eyebrow">Bán hàng tại quầy</p>
            <h2>Tạo đơn cho khách vãng lai</h2>
          </div>
          <button className="dh-icon-button" onClick={onDong} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="dh-create-layout">
          <section className="dh-product-picker">
            <div className="dh-search-box">
              <i className="bi bi-search" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm tên sản phẩm..."
                autoFocus
              />
            </div>

            <div className="dh-picker-header">
              <span>Sản phẩm có thể bán</span>
              <small>{danhSachSanPham.length} kết quả</small>
            </div>

            <div className="dh-product-list">
              {dangTaiSanPham ? (
                <div className="dh-empty-state">Đang tìm sản phẩm...</div>
              ) : danhSachSanPham.length === 0 ? (
                <div className="dh-empty-state">Không tìm thấy sản phẩm</div>
              ) : (
                danhSachSanPham.map((sanPham) => (
                  <button
                    type="button"
                    className="dh-product-option"
                    key={sanPham.maDonViSanPham}
                    onClick={() => themSanPham(sanPham)}
                  >
                    <img
                      src={(sanPham.hinhAnh || "").trim() || "https://placehold.co/58x58?text=SP"}
                      alt={sanPham.tenSanPham}
                    />
                    <span className="dh-product-option-main">
                      <strong>{sanPham.tenSanPham}</strong>
                      <small>
                        {sanPham.tenDonViTinh}
                        {sanPham.laThuocKeDon ? " • Thuốc kê đơn" : ""}
                      </small>
                    </span>
                    <span className="dh-product-option-price">
                      {dinhDangTien(sanPham.giaBanTheoDonVi)}
                    </span>
                    <i className="bi bi-plus-circle-fill" />
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="dh-cart-panel">
            <div className="dh-cart-heading">
              <div>
                <h3>Đơn hàng</h3>
                <span>{gioHang.length} mặt hàng</span>
              </div>
              <span className="dh-customer-chip">
                <i className="bi bi-person" />
                Khách vãng lai
              </span>
            </div>

            <div className="dh-cart-items">
              {gioHang.length === 0 ? (
                <div className="dh-empty-cart">
                  <i className="bi bi-bag-plus" />
                  <strong>Chưa có sản phẩm</strong>
                  <span>Chọn sản phẩm ở danh sách bên trái</span>
                </div>
              ) : (
                gioHang.map((dong) => (
                  <div
                    className="dh-cart-item"
                    key={dong.sanPham.maDonViSanPham}
                  >
                    <div className="dh-cart-item-info">
                      <strong>{dong.sanPham.tenSanPham}</strong>
                      <span>
                        {dong.sanPham.tenDonViTinh} •{" "}
                        {dinhDangTien(dong.sanPham.giaBanTheoDonVi)}
                      </span>
                      {dong.sanPham.laThuocKeDon && (
                        <small className="dh-prescription-text">
                          <i className="bi bi-prescription2" /> Thuốc kê đơn
                        </small>
                      )}
                    </div>

                    <div className="dh-quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          thayDoiSoLuong(
                            dong.sanPham.maDonViSanPham,
                            dong.soLuong - 1
                          )
                        }
                      >
                        <i className="bi bi-dash" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={dong.soLuong}
                        onChange={(event) =>
                          thayDoiSoLuong(
                            dong.sanPham.maDonViSanPham,
                            Number(event.target.value)
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          thayDoiSoLuong(
                            dong.sanPham.maDonViSanPham,
                            dong.soLuong + 1
                          )
                        }
                      >
                        <i className="bi bi-plus" />
                      </button>
                    </div>

                    <strong className="dh-cart-line-total">
                      {dinhDangTien(
                        dong.sanPham.giaBanTheoDonVi * dong.soLuong
                      )}
                    </strong>

                    <button
                      type="button"
                      className="dh-remove-button"
                      onClick={() =>
                        thayDoiSoLuong(
                          dong.sanPham.maDonViSanPham,
                          0
                        )
                      }
                      title="Xóa sản phẩm"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="dh-form-row">
              <label>
                Phương thức thanh toán
                <select
                  value={phuongThucThanhToan}
                  onChange={(event) =>
                    setPhuongThucThanhToan(
                      event.target.value as "TIEN_MAT" | "QR"
                    )
                  }
                >
                  <option value="TIEN_MAT">Tiền mặt</option>
                  <option value="QR">Chuyển khoản QR</option>
                </select>
              </label>
            </div>

            <label className="dh-full-field">
              Ghi chú đơn hàng
              <textarea
                value={ghiChu}
                onChange={(event) => setGhiChu(event.target.value)}
                placeholder="Ví dụ: Khách mua trực tiếp tại quầy"
                maxLength={255}
              />
            </label>

            {coThuocKeDon && (
              <div className="dh-prescription-box">
                <div className="dh-prescription-box-title">
                  <i className="bi bi-shield-check" />
                  <div>
                    <strong>Đơn có thuốc kê đơn</strong>
                    <span>Cần xác nhận chuyên môn trước khi tạo đơn</span>
                  </div>
                </div>

                <label className="dh-checkbox-row">
                  <input
                    type="checkbox"
                    checked={xacNhanDonThuoc}
                    onChange={(event) =>
                      setXacNhanDonThuoc(event.target.checked)
                    }
                  />
                  Tôi đã kiểm tra đơn thuốc và tư vấn trực tiếp cho khách
                </label>

                <label className="dh-full-field">
                  Ghi chú kiểm duyệt
                  <textarea
                    value={ghiChuKiemDuyet}
                    onChange={(event) =>
                      setGhiChuKiemDuyet(event.target.value)
                    }
                    placeholder="Nhập nội dung đã kiểm tra và tư vấn..."
                    maxLength={255}
                  />
                </label>
              </div>
            )}

            {loi && <div className="dh-error-message">{loi}</div>}

            <div className="dh-total-box">
              <span>Tổng thanh toán</span>
              <strong>{dinhDangTien(tongTien)}</strong>
            </div>
          </section>
        </div>

        <div className="dh-modal-footer">
          <button className="dh-button dh-button-secondary" onClick={onDong}>
            Hủy
          </button>
          <button
            className="dh-button dh-button-primary"
            onClick={taoDon}
            disabled={dangTaoDon || gioHang.length === 0}
          >
            {dangTaoDon ? (
              <>
                <span className="dh-spinner" /> Đang tạo đơn...
              </>
            ) : (
              <>
                <i className="bi bi-receipt" /> Tạo đơn thanh toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
