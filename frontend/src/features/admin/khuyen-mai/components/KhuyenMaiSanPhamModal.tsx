import { useEffect, useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatDanhSachSanPhamKhuyenMai,
  layDanhSachSanPhamCoTheGan,
  layDanhSachSanPhamDangGan,
} from "../api/khuyenMaiApi";

import type { KhuyenMai, KhuyenMaiSanPham } from "../types/KhuyenMai";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type ApiErrorResponse = {
  message?: string;
};

type KhuyenMaiSanPhamModalProps = {
  isOpen: boolean;
  khuyenMai: KhuyenMai | null;
  onClose: () => void;
  onSuccess: () => void;
  onThongBao: HienThongBao;
};

const KICH_THUOC_TRANG = 10;

function KhuyenMaiSanPhamModal({
  isOpen,
  khuyenMai,
  onClose,
  onSuccess,
  onThongBao,
}: KhuyenMaiSanPhamModalProps) {
  const [danhSachSanPham, setDanhSachSanPham] = useState<KhuyenMaiSanPham[]>(
    [],
  );

  const [danhSachMaDaChon, setDanhSachMaDaChon] = useState<number[]>([]);

  const [tuKhoa, setTuKhoa] = useState("");

  const [trang, setTrang] = useState(0);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoSanPham, setTongSoSanPham] = useState(0);

  const [dangTai, setDangTai] = useState(false);

  const [dangTaiSanPhamDaGan, setDangTaiSanPhamDaGan] = useState(false);

  const [dangLuu, setDangLuu] = useState(false);

  const [loiTai, setLoiTai] = useState("");

  /*
   * Tải riêng toàn bộ sản phẩm đã được gắn.
   *
   * Mục đích:
   * giữ nguyên lựa chọn ở các trang mà Admin
   * chưa mở khi danh sách sản phẩm được phân trang.
   */
  useEffect(() => {
    if (!isOpen || !khuyenMai) {
      return;
    }

    let daHuy = false;

    const taiSanPhamDaGan = async () => {
      try {
        setDangTaiSanPhamDaGan(true);

        const response = await layDanhSachSanPhamDangGan(khuyenMai.maKhuyenMai);

        if (daHuy) {
          return;
        }

        setDanhSachMaDaChon(response.data.map((sanPham) => sanPham.maSanPham));
      } catch (error) {
        console.error("Không thể tải sản phẩm đã gắn:", error);

        if (daHuy) {
          return;
        }

        setDanhSachMaDaChon([]);

        onThongBao(
          "Không thể tải danh sách sản phẩm đang áp dụng khuyến mãi.",
          "LOI",
          "Không thể tải dữ liệu",
        );
      } finally {
        if (!daHuy) {
          setDangTaiSanPhamDaGan(false);
        }
      }
    };

    setTuKhoa("");
    setTrang(0);

    void taiSanPhamDaGan();

    return () => {
      daHuy = true;
    };
  }, [isOpen, khuyenMai, onThongBao]);

  /*
   * Tải sản phẩm theo từng trang.
   *
   * Có debounce 300ms để tránh gửi request
   * liên tục khi Admin đang nhập tìm kiếm.
   */
  useEffect(() => {
    if (!isOpen || !khuyenMai) {
      return;
    }

    let daHuy = false;

    const timer = window.setTimeout(() => {
      const taiDanhSach = async () => {
        try {
          setDangTai(true);
          setLoiTai("");

          const response = await layDanhSachSanPhamCoTheGan(
            khuyenMai.maKhuyenMai,
            tuKhoa.trim(),
            trang,
            KICH_THUOC_TRANG,
          );

          if (daHuy) {
            return;
          }

          setDanhSachSanPham(response.data.content);

          setTongSoTrang(response.data.totalPages);

          setTongSoSanPham(response.data.totalElements);

          /*
           * Khi tìm kiếm làm giảm số trang,
           * tránh giữ page vượt phạm vi.
           */
          if (
            response.data.totalPages > 0 &&
            trang >= response.data.totalPages
          ) {
            setTrang(response.data.totalPages - 1);
          }
        } catch (error) {
          console.error("Không thể tải danh sách sản phẩm khuyến mãi:", error);

          if (daHuy) {
            return;
          }

          setDanhSachSanPham([]);
          setTongSoTrang(0);
          setTongSoSanPham(0);

          setLoiTai(
            "Không thể tải danh sách sản phẩm có thể áp dụng khuyến mãi.",
          );
        } finally {
          if (!daHuy) {
            setDangTai(false);
          }
        }
      };

      void taiDanhSach();
    }, 300);

    return () => {
      daHuy = true;

      window.clearTimeout(timer);
    };
  }, [isOpen, khuyenMai, tuKhoa, trang]);

  if (!isOpen || !khuyenMai) {
    return null;
  }

  const thayDoiLuaChon = (maSanPham: number) => {
    setDanhSachMaDaChon((danhSachCu) => {
      if (danhSachCu.includes(maSanPham)) {
        return danhSachCu.filter((ma) => ma !== maSanPham);
      }

      return [...danhSachCu, maSanPham];
    });
  };

  const xuLyThayDoiTuKhoa = (giaTri: string) => {
    setTuKhoa(giaTri);

    /*
     * Khi đổi từ khóa luôn quay về trang đầu.
     */
    setTrang(0);
  };

  const sangTrangTruoc = () => {
    setTrang((trangHienTai) => Math.max(trangHienTai - 1, 0));
  };

  const sangTrangSau = () => {
    setTrang((trangHienTai) =>
      Math.min(trangHienTai + 1, Math.max(tongSoTrang - 1, 0)),
    );
  };

  const xuLyLuu = async () => {
    try {
      setDangLuu(true);

      await capNhatDanhSachSanPhamKhuyenMai(khuyenMai.maKhuyenMai, {
        danhSachMaSanPham: danhSachMaDaChon,
      });

      onThongBao(
        "Cập nhật sản phẩm áp dụng khuyến mãi thành công.",
        "THANH_CONG",
        "Thành công",
      );

      onSuccess();
    } catch (error) {
      console.error("Không thể cập nhật sản phẩm khuyến mãi:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      onThongBao(
        message ?? "Không thể cập nhật sản phẩm áp dụng khuyến mãi.",
        "LOI",
        "Không thể lưu dữ liệu",
      );
    } finally {
      setDangLuu(false);
    }
  };

  const dangTaiDuLieu = dangTai || dangTaiSanPhamDaGan;

  return (
    <div className="modal-overlay">
      <div
        className="modal-card"
        style={{
          width: "min(900px, calc(100vw - 40px))",

          maxHeight: "calc(100vh - 40px)",

          overflowY: "auto",
        }}
      >
        <div className="modal-header">
          <div>
            <h2>Sản phẩm áp dụng</h2>

            <p>
              Chương trình: <strong>{khuyenMai.tenChuongTrinh}</strong>
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={dangLuu}
            aria-label="Đóng"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="timSanPhamKhuyenMai">Tìm sản phẩm</label>

            <input
              id="timSanPhamKhuyenMai"
              type="text"
              value={tuKhoa}
              onChange={(event) => xuLyThayDoiTuKhoa(event.target.value)}
              placeholder="Nhập mã hoặc tên sản phẩm"
              disabled={dangLuu}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "16px",
              marginBottom: "12px",
            }}
          >
            <span>
              Có <strong>{tongSoSanPham}</strong> sản phẩm có thể áp dụng
            </span>

            <span>
              Đã chọn <strong>{danhSachMaDaChon.length}</strong> sản phẩm
            </span>
          </div>

          {loiTai && <div className="ql-alert ql-alert-error">{loiTai}</div>}

          {dangTaiDuLieu ? (
            <div className="ql-table-message">
              Đang tải danh sách sản phẩm...
            </div>
          ) : (
            <>
              <div className="ql-table-wrapper">
                <table className="ql-table">
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "80px",
                        }}
                      >
                        Chọn
                      </th>

                      <th>Mã</th>

                      <th>Tên sản phẩm</th>

                      <th>Loại sản phẩm</th>
                    </tr>
                  </thead>

                  <tbody>
                    {danhSachSanPham.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="ql-table-message">
                          Không có sản phẩm phù hợp.
                        </td>
                      </tr>
                    ) : (
                      danhSachSanPham.map((sanPham) => (
                        <tr key={sanPham.maSanPham}>
                          <td>
                            <input
                              type="checkbox"
                              checked={danhSachMaDaChon.includes(
                                sanPham.maSanPham,
                              )}
                              onChange={() => thayDoiLuaChon(sanPham.maSanPham)}
                              disabled={dangLuu}
                            />
                          </td>

                          <td>
                            <strong>#{sanPham.maSanPham}</strong>
                          </td>

                          <td>{sanPham.tenSanPham}</td>

                          <td>Không kê đơn</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  className="secondary-button"
                  onClick={sangTrangTruoc}
                  disabled={trang <= 0 || dangTai || dangLuu}
                >
                  <i className="bi bi-chevron-left" />
                  Trước
                </button>

                <span>
                  Trang <strong>{tongSoTrang === 0 ? 0 : trang + 1}</strong>
                  {" / "}
                  <strong>{tongSoTrang}</strong>
                </span>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={sangTrangSau}
                  disabled={
                    tongSoTrang === 0 ||
                    trang >= tongSoTrang - 1 ||
                    dangTai ||
                    dangLuu
                  }
                >
                  Sau
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={dangLuu}
          >
            Hủy
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => void xuLyLuu()}
            disabled={dangTaiDuLieu || dangLuu || Boolean(loiTai)}
          >
            {dangLuu ? "Đang lưu..." : "Lưu sản phẩm áp dụng"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default KhuyenMaiSanPhamModal;
