import { useEffect, useRef, useState } from "react";
import type { ChiTietGioHangHienThi } from "../types/GioHangHienThi";

interface DongChiTietGioHangProps {
  chiTiet: ChiTietGioHangHienThi;
  dangXuLy: boolean;
  capNhatSoLuong: (
    maDonViSanPham: number,
    soLuongMoi: number,
    laNhapTay: boolean
  ) => number;
  chonDonViBan: (
    maDonViSanPhamCu: number,
    maDonViSanPhamMoi: number
  ) => Promise<void>;
  xoaSanPhamKhoiGioHang: (maDonViSanPham: number) => void;
}

function DongChiTietGioHang({
  chiTiet,
  dangXuLy,
  capNhatSoLuong,
  chonDonViBan,
  xoaSanPhamKhoiGioHang,
}: DongChiTietGioHangProps) {
  const [soLuongDangNhap, setSoLuongDangNhap] = useState(
    String(chiTiet.soLuong)
  );

  const [dangMoDropdownDonVi, setDangMoDropdownDonVi] = useState(false);
  const dropdownDonViRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSoLuongDangNhap(String(chiTiet.soLuong));
  }, [chiTiet.soLuong]);

  useEffect(() => {
    const dongDropdownKhiClickBenNgoai = (event: MouseEvent) => {
      if (
        dropdownDonViRef.current &&
        !dropdownDonViRef.current.contains(event.target as Node)
      ) {
        setDangMoDropdownDonVi(false);
      }
    };

    document.addEventListener("mousedown", dongDropdownKhiClickBenNgoai);

    return () => {
      document.removeEventListener("mousedown", dongDropdownKhiClickBenNgoai);
    };
  }, []);

  const dinhDangTien = (giaTri: number) => {
    return giaTri.toLocaleString("vi-VN") + "đ";
  };

  const giamSoLuong = () => {
    if (chiTiet.soLuong <= 1 || dangXuLy) return;

    const soLuongDaApDung = capNhatSoLuong(
      chiTiet.maDonViSanPham,
      chiTiet.soLuong - 1,
      false
    );

    setSoLuongDangNhap(String(soLuongDaApDung));
  };

  const tangSoLuong = () => {
    if (dangXuLy) return;

    const soLuongDaApDung = capNhatSoLuong(
      chiTiet.maDonViSanPham,
      chiTiet.soLuong + 1,
      false
    );

    setSoLuongDangNhap(String(soLuongDaApDung));
  };

  const capNhatSoLuongNhapTay = () => {
    const soLuongMoi = Number(soLuongDangNhap);

    if (!Number.isInteger(soLuongMoi) || soLuongMoi <= 0) {
      setSoLuongDangNhap(String(chiTiet.soLuong));
      return;
    }

    const soLuongDaApDung = capNhatSoLuong(
      chiTiet.maDonViSanPham,
      soLuongMoi,
      true
    );

    setSoLuongDangNhap(String(soLuongDaApDung));
  };

  const xuLyChonDonViBan = async (maDonViSanPhamMoi: number) => {
    setDangMoDropdownDonVi(false);

    if (
      dangXuLy ||
      maDonViSanPhamMoi === chiTiet.maDonViSanPham
    ) {
      return;
    }

    await chonDonViBan(
      chiTiet.maDonViSanPham,
      maDonViSanPhamMoi
    );
  };

  return (
    <div className="gio-hang-dong">
      <div className="gio-hang-cot gio-hang-cot-san-pham">
        <div className="gio-hang-anh-san-pham">
          {chiTiet.hinhAnh ? (
            <img src={chiTiet.hinhAnh} alt={chiTiet.tenSanPham} />
          ) : (
            <div className="gio-hang-khong-co-anh">Chưa có ảnh</div>
          )}
        </div>

        <div className="gio-hang-thong-tin-san-pham">
          <h3>{chiTiet.tenSanPham}</h3>
        </div>
      </div>

      <div className="gio-hang-cot gio-hang-cot-gia">
        <strong>
          {dinhDangTien(chiTiet.thanhTien)}
        </strong>

        {chiTiet.coKhuyenMai && (
          <span className="gio-hang-gia-goc">
            {dinhDangTien(
              chiTiet.giaBanTheoDonVi
            )}
          </span>
        )}

        <span className="gio-hang-gia-sau-khuyen-mai">
          {dinhDangTien(
            chiTiet.giaSauKhuyenMai
          )}

          {chiTiet.tenDonViTinh
            ? ` / ${chiTiet.tenDonViTinh}`
            : ""}
        </span>
      </div>

      <div className="gio-hang-cot gio-hang-cot-so-luong">
        <div className="gio-hang-bo-dem-so-luong">
          <button
            type="button"
            onClick={giamSoLuong}
            disabled={dangXuLy || chiTiet.soLuong <= 1}
          >
            −
          </button>

          <input
            type="number"
            min={1}
            value={soLuongDangNhap}
            onChange={(event) =>
              setSoLuongDangNhap(event.target.value)
            }
            onBlur={capNhatSoLuongNhapTay}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            disabled={dangXuLy}
          />

          <button
            type="button"
            onClick={tangSoLuong}
            disabled={dangXuLy}
          >
            +
          </button>
        </div>
      </div>

      <div className="gio-hang-cot gio-hang-cot-don-vi">
        {chiTiet.danhSachDonViBan.length > 0 ? (
          <div
            className="gio-hang-don-vi-dropdown"
            ref={dropdownDonViRef}
          >
            <button
              type="button"
              className={
                dangMoDropdownDonVi
                  ? "gio-hang-don-vi-nut-chon dang-mo"
                  : "gio-hang-don-vi-nut-chon"
              }
              onClick={() =>
                setDangMoDropdownDonVi((dangMo) => !dangMo)
              }
              disabled={dangXuLy}
            >
              <span>{chiTiet.tenDonViTinh || "Đơn vị"}</span>
              <i className="bi bi-chevron-down"></i>
            </button>

            {dangMoDropdownDonVi && (
              <div className="gio-hang-don-vi-menu">
                {chiTiet.danhSachDonViBan.map((donVi) => {
                  const dangChon =
                    donVi.maDonViSanPham ===
                    chiTiet.maDonViSanPham;

                  const giaGoc =
                    donVi.giaBanTheoDonVi ?? 0;

                  const giaSauKhuyenMai =
                    donVi.giaSauKhuyenMai ??
                    giaGoc;

                  const coKhuyenMai =
                    Boolean(donVi.coKhuyenMai) &&
                    giaGoc > giaSauKhuyenMai;

                  return (
                    <button
                      key={donVi.maDonViSanPham}
                      type="button"
                      className={
                        dangChon
                          ? "gio-hang-don-vi-lua-chon dang-chon"
                          : "gio-hang-don-vi-lua-chon"
                      }
                      onClick={() =>
                        void xuLyChonDonViBan(
                          donVi.maDonViSanPham
                        )
                      }
                    >
                      <span className="gio-hang-don-vi-radio">
                        {dangChon && (
                          <span className="gio-hang-don-vi-radio-cham"></span>
                        )}
                      </span>

                      <span className="gio-hang-don-vi-ten">
                        {donVi.tenDonViTinh}
                      </span>

                      <span className="gio-hang-don-vi-gia">
                        {coKhuyenMai && (
                          <span className="gio-hang-don-vi-gia-goc">
                            {dinhDangTien(giaGoc)}
                          </span>
                        )}

                        <span className="gio-hang-don-vi-gia-hien-tai">
                          {dinhDangTien(
                            giaSauKhuyenMai
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <span className="gio-hang-don-vi-dang-cap-nhat">
            {chiTiet.tenDonViTinh || "Đang cập nhật"}
          </span>
        )}
      </div>

      <div className="gio-hang-cot gio-hang-cot-xoa">
        <button
          type="button"
          className="gio-hang-nut-xoa-icon"
          onClick={() =>
            xoaSanPhamKhoiGioHang(
              chiTiet.maDonViSanPham
            )
          }
          disabled={dangXuLy}
          title="Xóa sản phẩm"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default DongChiTietGioHang;