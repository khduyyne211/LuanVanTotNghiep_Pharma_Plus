import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AdminLoading
  from "../../shared/components/loading/AdminLoading";

import TieuDeTrangQuanLy
  from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import {
  layDanhSachLoSapHetHan,
  layDanhSachTonKhoThap,
} from "../api/khoApi";

import type {
  LoSapHetHan,
  MucCanhBaoHetHan,
  TonKhoThap,
} from "../types/Kho";

import "../../shared/styles/quan-ly/QuanLyCommon.css";
import "../styles/QuanLyKho.css";

const NGUONG_TON_MAC_DINH = 10;
const SO_NGAY_CANH_BAO_MAC_DINH = 30;

const dinhDangSoLuong = (
  giaTri: number | null | undefined,
) => {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 3,
  }).format(giaTri ?? 0);
};

const dinhDangNgay = (
  giaTri: string,
) => {
  if (!giaTri) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
  ).format(
    new Date(
      `${giaTri}T00:00:00`,
    ),
  );
};

const hienThiMucCanhBao = (
  mucCanhBao: MucCanhBaoHetHan,
) => {
  switch (mucCanhBao) {
    case "NGUY_CAP":
      return "Nguy cấp";

    case "SAP_HET_HAN":
      return "Sắp hết hạn";

    case "CAN_THEO_DOI":
      return "Cần theo dõi";

    default:
      return mucCanhBao;
  }
};

function QuanLyKhoPage() {
  const [
    danhSachTonKhoThap,
    setDanhSachTonKhoThap,
  ] = useState<TonKhoThap[]>([]);

  const [
    danhSachLoSapHetHan,
    setDanhSachLoSapHetHan,
  ] = useState<LoSapHetHan[]>([]);

  const [
    nguongTonInput,
    setNguongTonInput,
  ] = useState(
    String(NGUONG_TON_MAC_DINH),
  );

  const [
    soNgayInput,
    setSoNgayInput,
  ] = useState(
    String(
      SO_NGAY_CANH_BAO_MAC_DINH,
    ),
  );

  const [
    nguongTonDangApDung,
    setNguongTonDangApDung,
  ] = useState(
    NGUONG_TON_MAC_DINH,
  );

  const [
    soNgayDangApDung,
    setSoNgayDangApDung,
  ] = useState(
    SO_NGAY_CANH_BAO_MAC_DINH,
  );

  const [
    dangTaiTonKho,
    setDangTaiTonKho,
  ] = useState(true);

  const [
    dangTaiLoSapHetHan,
    setDangTaiLoSapHetHan,
  ] = useState(true);

  const [
    loiTonKho,
    setLoiTonKho,
  ] = useState("");

  const [
    loiLoSapHetHan,
    setLoiLoSapHetHan,
  ] = useState("");

  const taiTonKhoThap =
    useCallback(
      async (
        nguongTon: number,
      ) => {
        try {
          setDangTaiTonKho(true);
          setLoiTonKho("");

          const duLieu =
            await layDanhSachTonKhoThap(
              nguongTon,
            );

          setDanhSachTonKhoThap(
            duLieu,
          );
        } catch (error) {
          console.error(
            "Không thể tải danh sách tồn kho thấp:",
            error,
          );

          setDanhSachTonKhoThap(
            [],
          );

          setLoiTonKho(
            "Không thể tải danh sách tồn kho thấp.",
          );
        } finally {
          setDangTaiTonKho(false);
        }
      },
      [],
    );

  const taiLoSapHetHan =
    useCallback(
      async (
        soNgay: number,
      ) => {
        try {
          setDangTaiLoSapHetHan(
            true,
          );

          setLoiLoSapHetHan("");

          const duLieu =
            await layDanhSachLoSapHetHan(
              soNgay,
            );

          setDanhSachLoSapHetHan(
            duLieu,
          );
        } catch (error) {
          console.error(
            "Không thể tải danh sách lô sắp hết hạn:",
            error,
          );

          setDanhSachLoSapHetHan(
            [],
          );

          setLoiLoSapHetHan(
            "Không thể tải danh sách lô sắp hết hạn.",
          );
        } finally {
          setDangTaiLoSapHetHan(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void taiTonKhoThap(
      NGUONG_TON_MAC_DINH,
    );

    void taiLoSapHetHan(
      SO_NGAY_CANH_BAO_MAC_DINH,
    );
  }, [
    taiTonKhoThap,
    taiLoSapHetHan,
  ]);

  const apDungNguongTon = () => {
    const nguongTon =
      Number(nguongTonInput);

    if (
      !Number.isFinite(
        nguongTon,
      )
      || nguongTon < 0
    ) {
      setLoiTonKho(
        "Ngưỡng tồn phải là số lớn hơn hoặc bằng 0.",
      );

      return;
    }

    setNguongTonDangApDung(
      nguongTon,
    );

    void taiTonKhoThap(
      nguongTon,
    );
  };

  const apDungSoNgayCanhBao =
    () => {
      const soNgay =
        Number(soNgayInput);

      if (
        !Number.isInteger(
          soNgay,
        )
        || soNgay < 0
      ) {
        setLoiLoSapHetHan(
          "Số ngày cảnh báo phải là số nguyên lớn hơn hoặc bằng 0.",
        );

        return;
      }

      setSoNgayDangApDung(
        soNgay,
      );

      void taiLoSapHetHan(
        soNgay,
      );
    };

  const lamMoiDuLieu = () => {
    void taiTonKhoThap(
      nguongTonDangApDung,
    );

    void taiLoSapHetHan(
      soNgayDangApDung,
    );
  };

  const dangTai =
    dangTaiTonKho
    || dangTaiLoSapHetHan;

  return (
    <div className="ql-page kho-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý kho"
        moTa="Theo dõi sản phẩm tồn kho thấp và các lô hàng sắp hết hạn"
      >
        <button
          type="button"
          className="ql-button ql-button-ghost"
          onClick={
            lamMoiDuLieu
          }
          disabled={dangTai}
        >
          <i className="bi bi-arrow-clockwise" />

          {dangTai
            ? "Đang tải..."
            : "Làm mới"}
        </button>
      </TieuDeTrangQuanLy>

      <section className="kho-summary-grid">
        <article className="kho-summary-card">
          <div className="kho-summary-icon">
            <i className="bi bi-box-seam" />
          </div>

          <div>
            <span>
              Sản phẩm tồn kho thấp
            </span>

            <strong>
              {
                danhSachTonKhoThap.length
              }
            </strong>

            <small>
              Ngưỡng hiện tại:{" "}
              {dinhDangSoLuong(
                nguongTonDangApDung,
              )}
            </small>
          </div>
        </article>

        <article className="kho-summary-card">
          <div className="kho-summary-icon">
            <i className="bi bi-calendar2-x" />
          </div>

          <div>
            <span>
              Lô sắp hết hạn
            </span>

            <strong>
              {
                danhSachLoSapHetHan.length
              }
            </strong>

            <small>
              Trong{" "}
              {soNgayDangApDung} ngày
              tới
            </small>
          </div>
        </article>
      </section>

      <section className="kho-section">
        <div className="kho-section-header">
          <div>
            <h2>
              Sản phẩm tồn kho thấp
            </h2>

            <p>
              Hiển thị sản phẩm có tổng
              tồn quy đổi không vượt quá
              ngưỡng đã chọn.
            </p>
          </div>

          <div className="kho-filter">
            <label
              htmlFor="khoNguongTon"
            >
              Ngưỡng tồn
            </label>

            <input
              id="khoNguongTon"
              type="number"
              min={0}
              step="0.001"
              value={
                nguongTonInput
              }
              onChange={(event) =>
                setNguongTonInput(
                  event.target.value,
                )
              }
              disabled={
                dangTaiTonKho
              }
            />

            <button
              type="button"
              className="ql-button ql-button-primary"
              onClick={
                apDungNguongTon
              }
              disabled={
                dangTaiTonKho
              }
            >
              Áp dụng
            </button>
          </div>
        </div>

        {loiTonKho && (
          <div className="kho-error">
            <i className="bi bi-exclamation-circle-fill" />

            <span>
              {loiTonKho}
            </span>
          </div>
        )}

        <div className="kho-table-wrapper">
          <table className="kho-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Sản phẩm</th>
                <th>
                  Tổng tồn quy đổi
                </th>
                <th>Ngưỡng</th>
                <th>
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
              {dangTaiTonKho ? (
                <tr>
                  <td
                    colSpan={5}
                    className="kho-table-message"
                  >
                    <AdminLoading
                      noiDung="Đang tải dữ liệu tồn kho..."
                    />
                  </td>
                </tr>
              ) : danhSachTonKhoThap.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="kho-table-message"
                  >
                    Không có sản phẩm tồn
                    kho thấp theo ngưỡng
                    hiện tại.
                  </td>
                </tr>
              ) : (
                danhSachTonKhoThap.map(
                  (sanPham) => (
                    <tr
                      key={
                        sanPham.maSanPham
                      }
                    >
                      <td>
                        #
                        {
                          sanPham.maSanPham
                        }
                      </td>

                      <td>
                        <strong>
                          {
                            sanPham.tenSanPham
                          }
                        </strong>
                      </td>

                      <td>
                        {dinhDangSoLuong(
                          sanPham.tongSoLuongTon,
                        )}
                      </td>

                      <td>
                        {dinhDangSoLuong(
                          sanPham.nguongTon,
                        )}
                      </td>

                      <td>
                        <span className="kho-badge kho-badge-low-stock">
                          Tồn thấp
                        </span>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="kho-section">
        <div className="kho-section-header">
          <div>
            <h2>
              Lô hàng sắp hết hạn
            </h2>

            <p>
              Theo dõi các lô đang còn
              tồn và sẽ hết hạn trong
              khoảng thời gian đã chọn.
            </p>
          </div>

          <div className="kho-filter">
            <label
              htmlFor="khoSoNgayHetHan"
            >
              Số ngày
            </label>

            <input
              id="khoSoNgayHetHan"
              type="number"
              min={0}
              step={1}
              value={soNgayInput}
              onChange={(event) =>
                setSoNgayInput(
                  event.target.value,
                )
              }
              disabled={
                dangTaiLoSapHetHan
              }
            />

            <button
              type="button"
              className="ql-button ql-button-primary"
              onClick={
                apDungSoNgayCanhBao
              }
              disabled={
                dangTaiLoSapHetHan
              }
            >
              Áp dụng
            </button>
          </div>
        </div>

        {loiLoSapHetHan && (
          <div className="kho-error">
            <i className="bi bi-exclamation-circle-fill" />

            <span>
              {loiLoSapHetHan}
            </span>
          </div>
        )}

        <div className="kho-table-wrapper">
          <table className="kho-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Phiếu nhập</th>
                <th>Đơn vị</th>
                <th>
                  SL còn lại
                </th>
                <th>
                  Hạn sử dụng
                </th>
                <th>Còn lại</th>
                <th>Cảnh báo</th>
              </tr>
            </thead>

            <tbody>
              {dangTaiLoSapHetHan ? (
                <tr>
                  <td
                    colSpan={7}
                    className="kho-table-message"
                  >
                    <AdminLoading
                      noiDung="Đang tải dữ liệu lô sắp hết hạn..."
                    />
                  </td>
                </tr>
              ) : danhSachLoSapHetHan.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="kho-table-message"
                  >
                    Không có lô hàng sắp
                    hết hạn trong khoảng
                    thời gian hiện tại.
                  </td>
                </tr>
              ) : (
                danhSachLoSapHetHan.map(
                  (loHang) => (
                    <tr
                      key={
                        loHang.maChiTietPhieuNhap
                      }
                    >
                      <td>
                        <strong>
                          {
                            loHang.tenSanPham
                          }
                        </strong>

                        <small className="kho-table-subtext">
                          SP #
                          {
                            loHang.maSanPham
                          }
                        </small>
                      </td>

                      <td>
                        #
                        {
                          loHang.maPhieuNhap
                        }
                      </td>

                      <td>
                        {
                          loHang.tenDonViTinh
                        }
                      </td>

                      <td>
                        {dinhDangSoLuong(
                          loHang.soLuongConLai,
                        )}
                      </td>

                      <td>
                        {dinhDangNgay(
                          loHang.hanSuDung,
                        )}
                      </td>

                      <td>
                        <strong>
                          {
                            loHang.soNgayConLai
                          }{" "}
                          ngày
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`kho-badge kho-badge-${loHang.mucCanhBao.toLowerCase()}`}
                        >
                          {hienThiMucCanhBao(
                            loHang.mucCanhBao,
                          )}
                        </span>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default QuanLyKhoPage;