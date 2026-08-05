import { useEffect, useMemo, useState } from "react";

import type { ChangeEvent, FormEvent } from "react";

import { isAxiosError } from "axios";

import { layTuyChonNhapKho, taoPhieuNhap } from "../api/phieuNhapApi";

import { layDanhSachNhaCungCap } from "../../nha-cung-cap/api/nhaCungCapApi";

import type {
  DonViNhapKhoOption,
  PhieuNhap,
  PhieuNhapTaoMoiRequest,
  SanPhamNhapKhoOption,
} from "../types/PhieuNhap";

import type { NhaCungCap } from "../../nha-cung-cap/types/NhaCungCap";

type PhieuNhapFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phieuNhap: PhieuNhap) => void;
};

type DongSanPhamForm = {
  idTam: number;
  maSanPham: string;
  maDonViSanPham: string;
  danhSachDonVi: DonViNhapKhoOption[];
  soLuongNhap: string;
  donGiaNhap: string;
  hanSuDung: string;
};

type ApiErrorResponse = {
  message?: string;
};

type DuLieuTaoPhieuNhap = {
  danhSachNhaCungCap: NhaCungCap[];
  danhSachSanPham: SanPhamNhapKhoOption[];
};

const MA_NHAN_VIEN_TAM_THOI = 1;

let yeuCauTaiDuLieuDangChay: Promise<DuLieuTaoPhieuNhap> | null = null;

const taiDuLieuTaoPhieuNhap = (): Promise<DuLieuTaoPhieuNhap> => {
  if (!yeuCauTaiDuLieuDangChay) {
    yeuCauTaiDuLieuDangChay = Promise.all([
      layDanhSachNhaCungCap(),
      layTuyChonNhapKho(),
    ])
      .then(([responseNhaCungCap, responseSanPham]) => ({
        danhSachNhaCungCap: responseNhaCungCap.data.filter(
          (nhaCungCap) => nhaCungCap.trangThaiHopTac,
        ),

        danhSachSanPham: responseSanPham.data,
      }))
      .finally(() => {
        yeuCauTaiDuLieuDangChay = null;
      });
  }

  return yeuCauTaiDuLieuDangChay;
};

const layNgayToiThieu = () => {
  const ngay = new Date();

  ngay.setDate(ngay.getDate() + 1);

  const nam = ngay.getFullYear();

  const thang = String(ngay.getMonth() + 1).padStart(2, "0");

  const ngayTrongThang = String(ngay.getDate()).padStart(2, "0");

  return `${nam}-${thang}-${ngayTrongThang}`;
};

const taoDongTrong = (idTam: number): DongSanPhamForm => ({
  idTam,
  maSanPham: "",
  maDonViSanPham: "",
  danhSachDonVi: [],
  soLuongNhap: "",
  donGiaNhap: "",
  hanSuDung: "",
});

const dinhDangTien = (giaTri: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri);
};

function PhieuNhapFormModal(props: PhieuNhapFormModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return <PhieuNhapFormNoiDung {...props} />;
}

function PhieuNhapFormNoiDung({ onClose, onSuccess }: PhieuNhapFormModalProps) {
  const [danhSachNhaCungCap, setDanhSachNhaCungCap] = useState<NhaCungCap[]>(
    [],
  );

  const [danhSachSanPham, setDanhSachSanPham] = useState<
    SanPhamNhapKhoOption[]
  >([]);

  const [maNhaCungCap, setMaNhaCungCap] = useState("");

  const [ghiChu, setGhiChu] = useState("");

  const [danhSachDong, setDanhSachDong] = useState<DongSanPhamForm[]>([
    taoDongTrong(1),
  ]);

  const [idTamTiepTheo, setIdTamTiepTheo] = useState(2);

  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);

  const [loiTaiDuLieu, setLoiTaiDuLieu] = useState<string | null>(null);

  const [dangLuu, setDangLuu] = useState(false);

  const ngayToiThieu = useMemo(() => layNgayToiThieu(), []);

  useEffect(() => {
    let daHuy = false;

    const taiDuLieu = async () => {
      try {
        setDangTaiDuLieu(true);
        setLoiTaiDuLieu(null);

        const duLieu = await taiDuLieuTaoPhieuNhap();

        if (daHuy) {
          return;
        }

        setDanhSachNhaCungCap(duLieu.danhSachNhaCungCap);

        setDanhSachSanPham(duLieu.danhSachSanPham);
      } catch (error) {
        console.error("Không thể tải dữ liệu tạo phiếu nhập:", error);

        if (!daHuy) {
          setLoiTaiDuLieu("Không thể tải nhà cung cấp hoặc sản phẩm nhập kho.");
        }
      } finally {
        if (!daHuy) {
          setDangTaiDuLieu(false);
        }
      }
    };

    void taiDuLieu();

    return () => {
      daHuy = true;
    };
  }, []);

  const tongTienDuKien = useMemo(() => {
    return danhSachDong.reduce((tongTien, dong) => {
      const soLuong = Number(dong.soLuongNhap);

      const donGia = Number(dong.donGiaNhap);

      if (
        !Number.isFinite(soLuong) ||
        !Number.isFinite(donGia) ||
        soLuong <= 0 ||
        donGia <= 0
      ) {
        return tongTien;
      }

      return tongTien + soLuong * donGia;
    }, 0);
  }, [danhSachDong]);

  const capNhatDong = (
    idTam: number,
    duLieuCapNhat: Partial<DongSanPhamForm>,
  ) => {
    setDanhSachDong((danhSachCu) =>
      danhSachCu.map((dong) =>
        dong.idTam === idTam
          ? {
              ...dong,
              ...duLieuCapNhat,
            }
          : dong,
      ),
    );
  };

  const xuLyChonSanPham = (idTam: number, maSanPham: string) => {
    const sanPham = danhSachSanPham.find(
      (item) => item.maSanPham === Number(maSanPham),
    );

    const danhSachDonVi = sanPham?.danhSachDonViNhap ?? [];

    capNhatDong(idTam, {
      maSanPham,
      danhSachDonVi,

      maDonViSanPham:
        danhSachDonVi.length === 1
          ? String(danhSachDonVi[0].maDonViSanPham)
          : "",
    });
  };

  const themDongSanPham = () => {
    setDanhSachDong((danhSachCu) => [
      ...danhSachCu,
      taoDongTrong(idTamTiepTheo),
    ]);

    setIdTamTiepTheo((giaTriCu) => giaTriCu + 1);
  };

  const xoaDongSanPham = (idTam: number) => {
    setDanhSachDong((danhSachCu) => {
      if (danhSachCu.length === 1) {
        return danhSachCu;
      }

      return danhSachCu.filter((dong) => dong.idTam !== idTam);
    });
  };

  const kiemTraDuLieu = () => {
    if (!maNhaCungCap) {
      alert("Vui lòng chọn nhà cung cấp.");

      return false;
    }

    if (danhSachDong.length === 0) {
      alert("Phiếu nhập phải có ít nhất một sản phẩm.");

      return false;
    }

    for (let chiSo = 0; chiSo < danhSachDong.length; chiSo += 1) {
      const dong = danhSachDong[chiSo];

      const soLuongNhap = Number(dong.soLuongNhap);

      const donGiaNhap = Number(dong.donGiaNhap);

      if (!dong.maSanPham || !dong.maDonViSanPham) {
        alert(
          `Vui lòng chọn đầy đủ sản phẩm và đơn vị nhập tại dòng ${chiSo + 1}.`,
        );

        return false;
      }

      if (!Number.isFinite(soLuongNhap) || soLuongNhap <= 0) {
        alert(`Số lượng nhập tại dòng ${chiSo + 1} phải lớn hơn 0.`);

        return false;
      }

      if (!Number.isFinite(donGiaNhap) || donGiaNhap <= 0) {
        alert(`Đơn giá nhập tại dòng ${chiSo + 1} phải lớn hơn 0.`);

        return false;
      }

      if (!dong.hanSuDung) {
        alert(`Vui lòng chọn hạn sử dụng tại dòng ${chiSo + 1}.`);

        return false;
      }

      if (dong.hanSuDung < ngayToiThieu) {
        alert(`Hạn sử dụng tại dòng ${chiSo + 1} phải lớn hơn ngày hiện tại.`);

        return false;
      }
    }

    const khoaDaChon = new Set<string>();

    for (const dong of danhSachDong) {
      const khoa = [dong.maSanPham, dong.maDonViSanPham, dong.hanSuDung].join(
        "-",
      );

      if (khoaDaChon.has(khoa)) {
        alert("Không được nhập trùng cùng sản phẩm, đơn vị và hạn sử dụng.");

        return false;
      }

      khoaDaChon.add(khoa);
    }

    return true;
  };

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!kiemTraDuLieu()) {
      return;
    }

    const request: PhieuNhapTaoMoiRequest = {
      maNhaCungCap: Number(maNhaCungCap),

      maNhanVienLap: MA_NHAN_VIEN_TAM_THOI,

      ghiChu: ghiChu.trim() || null,

      danhSachChiTiet: danhSachDong.map((dong) => ({
        maSanPham: Number(dong.maSanPham),

        maDonViSanPham: Number(dong.maDonViSanPham),

        soLuongNhap: Number(dong.soLuongNhap),

        donGiaNhap: Number(dong.donGiaNhap),

        hanSuDung: dong.hanSuDung,
      })),
    };

    try {
      setDangLuu(true);

      const response = await taoPhieuNhap(request);

      onSuccess(response.data);
    } catch (error) {
      console.error("Không thể tạo phiếu nhập:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể tạo phiếu nhập.");
    } finally {
      setDangLuu(false);
    }
  };

  const xuLyThayDoiGhiChu = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setGhiChu(event.target.value);
  };

  const xuLyDongForm = () => {
    if (!dangLuu) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={xuLyDongForm}>
      <div
        className="modal-card product-detail-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Tạo phiếu nhập</h2>

            <p>Khai báo nhà cung cấp và các lô sản phẩm cần nhập kho.</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={xuLyDongForm}
            disabled={dangLuu}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {dangTaiDuLieu ? (
          <div className="ql-table-message">
            Đang tải dữ liệu tạo phiếu nhập...
          </div>
        ) : loiTaiDuLieu ? (
          <div className="ql-error-message">
            <i className="bi bi-exclamation-circle-fill" />

            <span>{loiTaiDuLieu}</span>
          </div>
        ) : (
          <form onSubmit={xuLySubmit}>
            <section className="detail-section">
              <h3>Thông tin phiếu nhập</h3>

              <div className="detail-grid">
                <div className="form-group">
                  <label htmlFor="maNhaCungCap">Nhà cung cấp</label>

                  <select
                    id="maNhaCungCap"
                    value={maNhaCungCap}
                    onChange={(event) => setMaNhaCungCap(event.target.value)}
                    disabled={dangLuu}
                    required
                  >
                    <option value="">Chọn nhà cung cấp</option>

                    {danhSachNhaCungCap.map((nhaCungCap) => (
                      <option
                        key={nhaCungCap.maNhaCungCap}
                        value={nhaCungCap.maNhaCungCap}
                      >
                        {nhaCungCap.tenNhaCungCap}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nhân viên lập</label>

                  <input
                    value={`Nhân viên #${MA_NHAN_VIEN_TAM_THOI}`}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Tổng tiền dự kiến</label>

                  <input value={dinhDangTien(tongTienDuKien)} disabled />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ghiChu">Ghi chú</label>

                <textarea
                  id="ghiChu"
                  value={ghiChu}
                  onChange={xuLyThayDoiGhiChu}
                  maxLength={500}
                  placeholder="Có thể để trống"
                  disabled={dangLuu}
                />
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-header">
                <h3>Sản phẩm nhập kho</h3>

                <button
                  type="button"
                  className="ql-button ql-button-ghost"
                  onClick={themDongSanPham}
                  disabled={dangLuu}
                >
                  <i className="bi bi-plus-lg" />
                  Thêm dòng sản phẩm
                </button>
              </div>

              <div className="ql-table-wrapper">
                <table className="ql-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị nhập</th>
                      <th>Số lượng</th>
                      <th>Đơn giá nhập</th>
                      <th>Hạn sử dụng</th>
                      <th>Thành tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {danhSachDong.map((dong) => {
                      const thanhTien =
                        Number(dong.soLuongNhap) * Number(dong.donGiaNhap);

                      return (
                        <tr key={dong.idTam}>
                          <td>
                            <select
                              className="ql-filter-control"
                              value={dong.maSanPham}
                              onChange={(event) =>
                                xuLyChonSanPham(dong.idTam, event.target.value)
                              }
                              disabled={dangLuu}
                              required
                            >
                              <option value="">Chọn sản phẩm</option>

                              {danhSachSanPham.map((sanPham) => (
                                <option
                                  key={sanPham.maSanPham}
                                  value={sanPham.maSanPham}
                                >
                                  {sanPham.tenSanPham}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <select
                              className="ql-filter-control"
                              value={dong.maDonViSanPham}
                              onChange={(event) =>
                                capNhatDong(dong.idTam, {
                                  maDonViSanPham: event.target.value,
                                })
                              }
                              disabled={dangLuu || !dong.maSanPham}
                              required
                            >
                              <option value="">Chọn đơn vị</option>

                              {dong.danhSachDonVi.map((donVi) => (
                                <option
                                  key={donVi.maDonViSanPham}
                                  value={donVi.maDonViSanPham}
                                >
                                  {donVi.tenDonViTinh}

                                  {donVi.kyHieu ? ` (${donVi.kyHieu})` : ""}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              className="ql-filter-control"
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={dong.soLuongNhap}
                              onChange={(event) =>
                                capNhatDong(dong.idTam, {
                                  soLuongNhap: event.target.value,
                                })
                              }
                              disabled={dangLuu}
                              required
                            />
                          </td>

                          <td>
                            <input
                              className="ql-filter-control"
                              type="number"
                              min="1"
                              step="1"
                              value={dong.donGiaNhap}
                              onChange={(event) =>
                                capNhatDong(dong.idTam, {
                                  donGiaNhap: event.target.value,
                                })
                              }
                              disabled={dangLuu}
                              required
                            />
                          </td>

                          <td>
                            <input
                              className="ql-filter-control"
                              type="date"
                              min={ngayToiThieu}
                              value={dong.hanSuDung}
                              onChange={(event) =>
                                capNhatDong(dong.idTam, {
                                  hanSuDung: event.target.value,
                                })
                              }
                              disabled={dangLuu}
                              required
                            />
                          </td>

                          <td>
                            <strong>
                              {dinhDangTien(
                                Number.isFinite(thanhTien) ? thanhTien : 0,
                              )}
                            </strong>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="ql-action-button"
                              onClick={() => xoaDongSanPham(dong.idTam)}
                              disabled={dangLuu || danhSachDong.length === 1}
                            >
                              <i className="bi bi-trash" />
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={dangLuu}
              >
                {dangLuu ? "Đang tạo..." : "Tạo phiếu nhập"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={xuLyDongForm}
                disabled={dangLuu}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PhieuNhapFormModal;
