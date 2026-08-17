import { useEffect, useState } from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import { layDanhSachDanhMucSanPham } from "../../danh-muc-san-pham/api/danhMucSanPhamApi";
import type { DanhMucSanPham } from "../../danh-muc-san-pham/types/DanhMucSanPham";

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

const KICH_THUOC_TRANG_CHON_TAT_CA = 50;

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

  const [danhSachDanhMuc, setDanhSachDanhMuc] =
    useState<DanhMucSanPham[]>([]);

  const [maDanhMucCha, setMaDanhMucCha] = useState("");

  const [maDanhMucCon, setMaDanhMucCon] = useState("");

  const [dangTaiDanhMuc, setDangTaiDanhMuc] = useState(false);

  const [trang, setTrang] = useState(0);

  const [tongSoTrang, setTongSoTrang] = useState(0);

  const [tongSoSanPham, setTongSoSanPham] = useState(0);

  const [dangTai, setDangTai] = useState(false);

  const [dangTaiSanPhamDaGan, setDangTaiSanPhamDaGan] = useState(false);

  const [dangChonTatCa, setDangChonTatCa] = useState(false);

  const [dangLuu, setDangLuu] = useState(false);

  const [loiTai, setLoiTai] = useState("");

  const danhSachDanhMucCha =
    danhSachDanhMuc.filter(
      (danhMuc) => danhMuc.maDanhMucCha === null,
    );

  const danhSachDanhMucCon =
    maDanhMucCha
      ? danhSachDanhMuc.filter(
          (danhMuc) =>
            danhMuc.maDanhMucCha === Number(maDanhMucCha),
        )
      : [];

  const maDanhMucHieuLuc =
    maDanhMucCon
      ? Number(maDanhMucCon)
      : maDanhMucCha
        ? Number(maDanhMucCha)
        : null;

  const baoGomDanhMucCon =
    Boolean(maDanhMucCha)
    && !maDanhMucCon;

  /*
   * Tải danh mục sản phẩm để Admin lọc theo
   * danh mục cha -> danh mục con.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let daHuy = false;

    const taiDanhMuc = async () => {
      try {
        setDangTaiDanhMuc(true);

        const response = await layDanhSachDanhMucSanPham();

        if (daHuy) {
          return;
        }

        setDanhSachDanhMuc(response.data);
      } catch (error) {
        console.error("Không thể tải danh mục sản phẩm:", error);

        if (daHuy) {
          return;
        }

        setDanhSachDanhMuc([]);

        onThongBao(
          "Không thể tải danh mục sản phẩm. Bạn vẫn có thể tìm sản phẩm theo mã hoặc tên.",
          "CANH_BAO",
          "Không thể tải danh mục",
        );
      } finally {
        if (!daHuy) {
          setDangTaiDanhMuc(false);
        }
      }
    };

    setMaDanhMucCha("");
    setMaDanhMucCon("");

    void taiDanhMuc();

    return () => {
      daHuy = true;
    };
  }, [isOpen, onThongBao]);

  /*
   * Tải toàn bộ sản phẩm đang được gắn để giữ
   * lựa chọn khi Admin chuyển trang hoặc đổi bộ lọc.
   */
  useEffect(() => {
    if (!isOpen || !khuyenMai) {
      return;
    }

    let daHuy = false;

    const taiSanPhamDaGan = async () => {
      try {
        setDangTaiSanPhamDaGan(true);

        const response = await layDanhSachSanPhamDangGan(
          khuyenMai.maKhuyenMai,
        );

        if (daHuy) {
          return;
        }

        setDanhSachMaDaChon(
          response.data.map(
            (sanPham) => sanPham.maSanPham,
          ),
        );
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
    setMaDanhMucCha("");
    setMaDanhMucCon("");
    setTrang(0);

    void taiSanPhamDaGan();

    return () => {
      daHuy = true;
    };
  }, [isOpen, khuyenMai, onThongBao]);

  /*
   * Tải sản phẩm theo từng trang.
   *
   * Chỉ chọn danh mục cha:
   * lấy sản phẩm thuộc chính danh mục cha
   * và các danh mục con trực tiếp.
   *
   * Chọn thêm danh mục con:
   * thu hẹp phạm vi về đúng danh mục con đó.
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
            maDanhMucHieuLuc,
            baoGomDanhMucCon,
            trang,
            KICH_THUOC_TRANG,
          );

          if (daHuy) {
            return;
          }

          setDanhSachSanPham(response.data.content);
          setTongSoTrang(response.data.totalPages);
          setTongSoSanPham(response.data.totalElements);

          if (
            response.data.totalPages > 0
            && trang >= response.data.totalPages
          ) {
            setTrang(response.data.totalPages - 1);
          }
        } catch (error) {
          console.error(
            "Không thể tải danh sách sản phẩm khuyến mãi:",
            error,
          );

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
  }, [
    isOpen,
    khuyenMai,
    tuKhoa,
    maDanhMucHieuLuc,
    baoGomDanhMucCon,
    trang,
  ]);

  if (!isOpen || !khuyenMai) {
    return null;
  }

  const thayDoiLuaChon = (maSanPham: number) => {
    setDanhSachMaDaChon((danhSachCu) => {
      if (danhSachCu.includes(maSanPham)) {
        return danhSachCu.filter(
          (ma) => ma !== maSanPham,
        );
      }

      return [
        ...danhSachCu,
        maSanPham,
      ];
    });
  };

  const xuLyThayDoiTuKhoa = (giaTri: string) => {
    setTuKhoa(giaTri);
    setTrang(0);
  };

  const xuLyThayDoiDanhMucCha = (giaTri: string) => {
    setMaDanhMucCha(giaTri);
    setMaDanhMucCon("");
    setTrang(0);
  };

  const xuLyThayDoiDanhMucCon = (giaTri: string) => {
    setMaDanhMucCon(giaTri);
    setTrang(0);
  };

  const chonTatCaTrongDanhMuc = async () => {
    if (maDanhMucHieuLuc === null) {
      onThongBao(
        "Hãy chọn danh mục sản phẩm trước khi chọn tất cả.",
        "CANH_BAO",
        "Chưa chọn danh mục",
      );

      return;
    }

    try {
      setDangChonTatCa(true);

      const responseDauTien =
        await layDanhSachSanPhamCoTheGan(
          khuyenMai.maKhuyenMai,
          "",
          maDanhMucHieuLuc,
          baoGomDanhMucCon,
          0,
          KICH_THUOC_TRANG_CHON_TAT_CA,
        );

      const danhSachMaTrongDanhMuc =
        responseDauTien.data.content.map(
          (sanPham) => sanPham.maSanPham,
        );

      for (
        let trangCanTai = 1;
        trangCanTai < responseDauTien.data.totalPages;
        trangCanTai += 1
      ) {
        const responseTrang =
          await layDanhSachSanPhamCoTheGan(
            khuyenMai.maKhuyenMai,
            "",
            maDanhMucHieuLuc,
            baoGomDanhMucCon,
            trangCanTai,
            KICH_THUOC_TRANG_CHON_TAT_CA,
          );

        danhSachMaTrongDanhMuc.push(
          ...responseTrang.data.content.map(
            (sanPham) => sanPham.maSanPham,
          ),
        );
      }

      setDanhSachMaDaChon((danhSachCu) => (
        Array.from(
          new Set([
            ...danhSachCu,
            ...danhSachMaTrongDanhMuc,
          ]),
        )
      ));

      onThongBao(
        `Đã chọn ${danhSachMaTrongDanhMuc.length} sản phẩm trong danh mục.`,
        "THANH_CONG",
        "Đã chọn sản phẩm",
      );
    } catch (error) {
      console.error(
        "Không thể chọn tất cả sản phẩm trong danh mục:",
        error,
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      onThongBao(
        message
          ?? "Không thể chọn tất cả sản phẩm trong danh mục.",
        "LOI",
        "Không thể thực hiện",
      );
    } finally {
      setDangChonTatCa(false);
    }
  };

  const boChonTatCa = () => {
    setDanhSachMaDaChon([]);
  };

  const sangTrangTruoc = () => {
    setTrang(
      (trangHienTai) =>
        Math.max(trangHienTai - 1, 0),
    );
  };

  const sangTrangSau = () => {
    setTrang(
      (trangHienTai) =>
        Math.min(
          trangHienTai + 1,
          Math.max(tongSoTrang - 1, 0),
        ),
    );
  };

  const xuLyLuu = async () => {
    try {
      setDangLuu(true);

      await capNhatDanhSachSanPhamKhuyenMai(
        khuyenMai.maKhuyenMai,
        {
          danhSachMaSanPham: danhSachMaDaChon,
        },
      );

      onThongBao(
        "Cập nhật sản phẩm áp dụng khuyến mãi thành công.",
        "THANH_CONG",
        "Thành công",
      );

      onSuccess();
    } catch (error) {
      console.error(
        "Không thể cập nhật sản phẩm khuyến mãi:",
        error,
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      onThongBao(
        message
          ?? "Không thể cập nhật sản phẩm áp dụng khuyến mãi.",
        "LOI",
        "Không thể lưu dữ liệu",
      );
    } finally {
      setDangLuu(false);
    }
  };

  const dangTaiDuLieu =
    dangTai
    || dangTaiSanPhamDaGan
    || dangTaiDanhMuc;

  const dangXuLy =
    dangTaiDuLieu
    || dangChonTatCa
    || dangLuu;

  return (
    <div className="modal-overlay">
      <div
        className="modal-card"
        style={{
          width: "min(1000px, calc(100vw - 40px))",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
        <div className="modal-header">
          <div>
            <h2>Sản phẩm áp dụng</h2>

            <p>
              Chương trình:{" "}
              <strong>
                {khuyenMai.tenChuongTrinh}
              </strong>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="form-group">
              <label htmlFor="timSanPhamKhuyenMai">
                Tìm sản phẩm
              </label>

              <input
                id="timSanPhamKhuyenMai"
                type="text"
                value={tuKhoa}
                onChange={(event) =>
                  xuLyThayDoiTuKhoa(
                    event.target.value,
                  )
                }
                placeholder="Nhập mã hoặc tên sản phẩm"
                disabled={dangLuu}
              />
            </div>

            <div className="form-group">
              <label htmlFor="danhMucChaKhuyenMai">
                Danh mục cha
              </label>

              <select
                id="danhMucChaKhuyenMai"
                value={maDanhMucCha}
                onChange={(event) =>
                  xuLyThayDoiDanhMucCha(
                    event.target.value,
                  )
                }
                disabled={dangLuu || dangTaiDanhMuc}
              >
                <option value="">
                  {dangTaiDanhMuc
                    ? "Đang tải danh mục..."
                    : "Tất cả danh mục"}
                </option>

                {danhSachDanhMucCha.map(
                  (danhMuc) => (
                    <option
                      key={danhMuc.maDanhMuc}
                      value={danhMuc.maDanhMuc}
                    >
                      {danhMuc.tenDanhMuc}
                      {!danhMuc.trangThaiHienThi
                        ? " (Đang ẩn)"
                        : ""}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="danhMucConKhuyenMai">
                Danh mục con
              </label>

              <select
                id="danhMucConKhuyenMai"
                value={maDanhMucCon}
                onChange={(event) =>
                  xuLyThayDoiDanhMucCon(
                    event.target.value,
                  )
                }
                disabled={
                  dangLuu
                  || dangTaiDanhMuc
                  || !maDanhMucCha
                  || danhSachDanhMucCon.length === 0
                }
              >
                <option value="">
                  {!maDanhMucCha
                    ? "Chọn danh mục cha trước"
                    : danhSachDanhMucCon.length === 0
                      ? "Danh mục này không có danh mục con"
                      : "Tất cả sản phẩm trong danh mục cha"}
                </option>

                {danhSachDanhMucCon.map(
                  (danhMuc) => (
                    <option
                      key={danhMuc.maDanhMuc}
                      value={danhMuc.maDanhMuc}
                    >
                      {danhMuc.tenDanhMuc}
                      {!danhMuc.trangThaiHienThi
                        ? " (Đang ẩn)"
                        : ""}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {maDanhMucCha && (
            <div
              className="ql-alert"
              style={{
                marginTop: "14px",
              }}
            >
              {maDanhMucCon
                ? "Đang hiển thị sản phẩm thuộc danh mục con đã chọn."
                : danhSachDanhMucCon.length > 0
                  ? "Đang hiển thị toàn bộ sản phẩm thuộc danh mục cha và các danh mục con trực tiếp. Chọn danh mục con để thu hẹp phạm vi."
                  : "Đang hiển thị sản phẩm thuộc danh mục đã chọn."}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  void chonTatCaTrongDanhMuc()
                }
                disabled={
                  dangXuLy
                  || maDanhMucHieuLuc === null
                }
              >
                <i className="bi bi-check2-square" />
                {dangChonTatCa
                  ? "Đang chọn..."
                  : "Chọn tất cả trong danh mục"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={boChonTatCa}
                disabled={
                  dangXuLy
                  || danhSachMaDaChon.length === 0
                }
              >
                <i className="bi bi-square" />
                Bỏ chọn tất cả
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <span>
                Có{" "}
                <strong>
                  {tongSoSanPham}
                </strong>{" "}
                sản phẩm có thể áp dụng
              </span>

              <span>
                Đã chọn{" "}
                <strong>
                  {danhSachMaDaChon.length}
                </strong>{" "}
                sản phẩm
              </span>
            </div>
          </div>

          {loiTai && (
            <div className="ql-alert ql-alert-error">
              {loiTai}
            </div>
          )}

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
                        <td
                          colSpan={4}
                          className="ql-table-message"
                        >
                          Không có sản phẩm phù hợp.
                        </td>
                      </tr>
                    ) : (
                      danhSachSanPham.map(
                        (sanPham) => (
                          <tr
                            key={sanPham.maSanPham}
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={
                                  danhSachMaDaChon.includes(
                                    sanPham.maSanPham,
                                  )
                                }
                                onChange={() =>
                                  thayDoiLuaChon(
                                    sanPham.maSanPham,
                                  )
                                }
                                disabled={dangLuu}
                              />
                            </td>

                            <td>
                              <strong>
                                #{sanPham.maSanPham}
                              </strong>
                            </td>

                            <td>
                              {sanPham.tenSanPham}
                            </td>

                            <td>
                              Không kê đơn
                            </td>
                          </tr>
                        ),
                      )
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
                  disabled={
                    trang <= 0
                    || dangTai
                    || dangLuu
                  }
                >
                  <i className="bi bi-chevron-left" />
                  Trước
                </button>

                <span>
                  Trang{" "}
                  <strong>
                    {tongSoTrang === 0
                      ? 0
                      : trang + 1}
                  </strong>
                  {" / "}
                  <strong>
                    {tongSoTrang}
                  </strong>
                </span>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={sangTrangSau}
                  disabled={
                    tongSoTrang === 0
                    || trang >= tongSoTrang - 1
                    || dangTai
                    || dangLuu
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
            disabled={
              dangTaiDuLieu
              || dangChonTatCa
              || dangLuu
              || Boolean(loiTai)
            }
          >
            {dangLuu
              ? "Đang lưu..."
              : "Lưu sản phẩm áp dụng"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default KhuyenMaiSanPhamModal;
