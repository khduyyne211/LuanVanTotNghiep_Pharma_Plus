import axios from "axios";
import {
  type FormEvent,
  useState,
} from "react";

import {
  layDanhSachSanPhamApi,
} from "../../san-pham/api/SanPhamApi";

import type {
  SanPham,
} from "../../san-pham/types/SanPham";

import type {
  SanPhamTuVan,
} from "../types/YeuCauTuVan";

interface ChonSanPhamTuVanModalProps {
  sanPhamDangChon: SanPhamTuVan | null;

  onChonSanPham: (
    sanPham: SanPhamTuVan
  ) => void;

  onDong: () => void;
}

interface PhanHoiLoiApi {
  message?: string;
}

const SO_SAN_PHAM_HIEN_THI = 8;

function layThongBaoLoi(
  error: unknown
) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(
      error
    )
  ) {
    return (
      error.response?.data?.message ||
      "Không thể tìm kiếm sản phẩm."
    );
  }

  return "Không thể tìm kiếm sản phẩm.";
}

export default function ChonSanPhamTuVanModal({
  sanPhamDangChon,
  onChonSanPham,
  onDong,
}: ChonSanPhamTuVanModalProps) {
  const [
    tuKhoa,
    setTuKhoa,
  ] = useState("");

  const [
    danhSachSanPham,
    setDanhSachSanPham,
  ] = useState<SanPham[]>([]);

  const [
    daTimKiem,
    setDaTimKiem,
  ] = useState(false);

  const [
    dangTai,
    setDangTai,
  ] = useState(false);

  const [
    loi,
    setLoi,
  ] = useState("");

  const timKiemSanPham =
    async () => {
      const tuKhoaDaChuanHoa =
        tuKhoa
          .trim()
          .replace(/\s+/g, " ");

      if (!tuKhoaDaChuanHoa) {
        setDanhSachSanPham([]);
        setDaTimKiem(false);
        setLoi(
          "Vui lòng nhập tên sản phẩm cần tìm."
        );
        return;
      }

      setDangTai(true);
      setDaTimKiem(true);
      setLoi("");

      try {
        const response =
          await layDanhSachSanPhamApi({
            tuKhoa:
              tuKhoaDaChuanHoa,

            page: 0,

            size:
              SO_SAN_PHAM_HIEN_THI,
          });

        setDanhSachSanPham(
          response.data
            .danhSachNoiDung || []
        );
      } catch (error) {
        setDanhSachSanPham([]);

        setLoi(
          layThongBaoLoi(error)
        );
      } finally {
        setDangTai(false);
      }
    };

  const xuLyTimKiem = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    void timKiemSanPham();
  };

  const xuLyThayDoiTuKhoa = (
    giaTri: string
  ) => {
    setTuKhoa(giaTri);

    if (loi) {
      setLoi("");
    }

    if (
      giaTri.trim() === ""
    ) {
      setDanhSachSanPham([]);
      setDaTimKiem(false);
    }
  };

  const xuLyChonSanPham = (
    sanPham: SanPham
  ) => {
    onChonSanPham({
      maSanPham:
        sanPham.maSanPham,

      tenSanPham:
        sanPham.tenSanPham,

      hinhAnh:
        sanPham.hinhAnh,

      laThuocKeDon:
        sanPham.laThuocKeDon,
    });

    onDong();
  };

  return (
    <div
      className="chon-san-pham-tu-van-lop-phu"
      role="presentation"
      onMouseDown={onDong}
    >
      <div
        className="chon-san-pham-tu-van-hop-thoai"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chon-san-pham-tu-van-tieu-de"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="chon-san-pham-tu-van-header">
          <div>
            <h2
              id="chon-san-pham-tu-van-tieu-de"
            >
              Chọn sản phẩm cần tư vấn
            </h2>

            <p>
              Tìm kiếm và chọn một sản phẩm
              mà bạn cần được tư vấn.
            </p>
          </div>

          <button
            type="button"
            className="chon-san-pham-tu-van-dong"
            aria-label="Đóng"
            onClick={onDong}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form
          className="chon-san-pham-tu-van-tim-kiem"
          onSubmit={xuLyTimKiem}
        >
          <div className="chon-san-pham-tu-van-o-tim">
            <i className="bi bi-search" />

            <input
              type="text"
              value={tuKhoa}
              maxLength={150}
              autoFocus
              placeholder="Nhập tên sản phẩm cần tìm..."
              onChange={(event) =>
                xuLyThayDoiTuKhoa(
                  event.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={dangTai}
          >
            {dangTai
              ? "Đang tìm..."
              : "Tìm kiếm"}
          </button>
        </form>

        <div className="chon-san-pham-tu-van-noi-dung">
          {dangTai ? (
            <div className="chon-san-pham-tu-van-thong-bao">
              <div className="chon-san-pham-tu-van-vong-xoay" />

              <span>
                Đang tìm sản phẩm...
              </span>
            </div>
          ) : loi ? (
            <div className="chon-san-pham-tu-van-thong-bao chon-san-pham-tu-van-thong-bao--loi">
              {loi}
            </div>
          ) : !daTimKiem ? (
            <div className="chon-san-pham-tu-van-thong-bao">
              Nhập tên sản phẩm cần
              tư vấn.
            </div>
          ) : danhSachSanPham.length ===
            0 ? (
            <div className="chon-san-pham-tu-van-thong-bao">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="chon-san-pham-tu-van-danh-sach">
              {danhSachSanPham.map(
                (sanPham) => {
                  const dangDuocChon =
                    sanPhamDangChon
                      ?.maSanPham ===
                    sanPham.maSanPham;

                  return (
                    <div
                      key={
                        sanPham.maSanPham
                      }
                      className={
                        dangDuocChon
                          ? "chon-san-pham-tu-van-muc chon-san-pham-tu-van-muc--dang-chon"
                          : "chon-san-pham-tu-van-muc"
                      }
                    >
                      <div className="chon-san-pham-tu-van-anh">
                        {sanPham.hinhAnh ? (
                          <img
                            src={
                              sanPham.hinhAnh
                            }
                            alt={
                              sanPham.tenSanPham
                            }
                          />
                        ) : (
                          <i className="bi bi-capsule" />
                        )}
                      </div>

                      <div className="chon-san-pham-tu-van-thong-tin">
                        <strong>
                          {
                            sanPham.tenSanPham
                          }
                        </strong>

                        <span>
                          {sanPham
                            .tenNhaSanXuat ||
                            "Chưa cập nhật nhà sản xuất"}
                        </span>

                        <div className="chon-san-pham-tu-van-nhan">
                          {sanPham
                            .laThuocKeDon && (
                            <span>
                              Thuốc kê đơn
                            </span>
                          )}

                          {sanPham
                            .hetHang && (
                            <span className="chon-san-pham-tu-van-nhan-het-hang">
                              Hết hàng
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={
                          dangDuocChon
                            ? "chon-san-pham-tu-van-chon dang-chon"
                            : "chon-san-pham-tu-van-chon"
                        }
                        disabled={
                          dangDuocChon
                        }
                        onClick={() =>
                          xuLyChonSanPham(
                            sanPham
                          )
                        }
                      >
                        {dangDuocChon
                          ? "Đang chọn"
                          : "Chọn"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}