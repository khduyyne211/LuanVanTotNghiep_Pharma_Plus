import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
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
  capNhatTaiKhoanNhanVien,
  capNhatVaiTro,
  doiTrangThaiTaiKhoanNhanVien,
  doiTrangThaiVaiTro,
  layDanhSachTaiKhoanNhanVien,
  layDanhSachVaiTro,
  themTaiKhoanNhanVien,
  themVaiTro,
} from "../api/taiKhoanVaiTroApi";

import type {
  TaiKhoanNhanVien,
  TaiKhoanNhanVienCapNhatRequest,
  TaiKhoanNhanVienTaoRequest,
  VaiTro,
  VaiTroRequest,
} from "../types/TaiKhoanVaiTro";

import "../../shared/styles/quan-ly/QuanLyCommon.css";
import "../styles/QuanLyTaiKhoanVaiTro.css";

type TabDangChon =
  | "TAI_KHOAN"
  | "VAI_TRO";

type LoaiXacNhan =
  | "TAI_KHOAN"
  | "VAI_TRO";

type ApiErrorResponse = {
  message?: string;
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

const dinhDangNgayGio = (
  giaTri: string | null | undefined,
) => {
  if (!giaTri) {
    return "-";
  }

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

function QuanLyTaiKhoanVaiTroPage() {
  const thongBao =
    useThongBaoHeThong();

  const [
    tabDangChon,
    setTabDangChon,
  ] = useState<TabDangChon>(
    "TAI_KHOAN",
  );

  const [
    danhSachTaiKhoan,
    setDanhSachTaiKhoan,
  ] = useState<
    TaiKhoanNhanVien[]
  >([]);

  const [
    danhSachVaiTro,
    setDanhSachVaiTro,
  ] = useState<VaiTro[]>([]);

  const [
    dangTaiTaiKhoan,
    setDangTaiTaiKhoan,
  ] = useState(true);

  const [
    dangTaiVaiTro,
    setDangTaiVaiTro,
  ] = useState(true);

  const [
    loiTaiKhoan,
    setLoiTaiKhoan,
  ] = useState("");

  const [
    loiVaiTro,
    setLoiVaiTro,
  ] = useState("");

  const [
    hienFormTaiKhoan,
    setHienFormTaiKhoan,
  ] = useState(false);

  const [
    taiKhoanCanSua,
    setTaiKhoanCanSua,
  ] = useState<
    TaiKhoanNhanVien | null
  >(null);

  const [
    hoTen,
    setHoTen,
  ] = useState("");

  const [
    soDienThoai,
    setSoDienThoai,
  ] = useState("");

  const [
    matKhau,
    setMatKhau,
  ] = useState("");

  const [
    danhSachMaVaiTro,
    setDanhSachMaVaiTro,
  ] = useState<number[]>([]);

  const [
    dangLuuTaiKhoan,
    setDangLuuTaiKhoan,
  ] = useState(false);

  const [
    hienFormVaiTro,
    setHienFormVaiTro,
  ] = useState(false);

  const [
    vaiTroCanSua,
    setVaiTroCanSua,
  ] = useState<VaiTro | null>(
    null,
  );

  const [
    tenVaiTro,
    setTenVaiTro,
  ] = useState("");

  const [
    moTaVaiTro,
    setMoTaVaiTro,
  ] = useState("");

  const [
    dangLuuVaiTro,
    setDangLuuVaiTro,
  ] = useState(false);

  const [
    loaiXacNhan,
    setLoaiXacNhan,
  ] = useState<
    LoaiXacNhan | null
  >(null);

  const [
    doiTuongChoDoiTrangThai,
    setDoiTuongChoDoiTrangThai,
  ] = useState<
    TaiKhoanNhanVien
    | VaiTro
    | null
  >(null);

  const [
    dangDoiTrangThai,
    setDangDoiTrangThai,
  ] = useState(false);

  const taiDanhSachTaiKhoan =
    useCallback(async () => {
      try {
        setDangTaiTaiKhoan(
          true,
        );

        setLoiTaiKhoan("");

        const duLieu =
          await layDanhSachTaiKhoanNhanVien();

        setDanhSachTaiKhoan(
          duLieu,
        );
      } catch (error) {
        console.error(
          "Không thể tải danh sách tài khoản nhân viên:",
          error,
        );

        setDanhSachTaiKhoan(
          [],
        );

        setLoiTaiKhoan(
          "Không thể tải danh sách tài khoản nhân viên.",
        );
      } finally {
        setDangTaiTaiKhoan(
          false,
        );
      }
    }, []);

  const taiDanhSachVaiTro =
    useCallback(async () => {
      try {
        setDangTaiVaiTro(
          true,
        );

        setLoiVaiTro("");

        const duLieu =
          await layDanhSachVaiTro();

        setDanhSachVaiTro(
          duLieu,
        );
      } catch (error) {
        console.error(
          "Không thể tải danh sách vai trò:",
          error,
        );

        setDanhSachVaiTro(
          [],
        );

        setLoiVaiTro(
          "Không thể tải danh sách vai trò.",
        );
      } finally {
        setDangTaiVaiTro(
          false,
        );
      }
    }, []);

  useEffect(() => {
    void taiDanhSachTaiKhoan();
    void taiDanhSachVaiTro();
  }, [
    taiDanhSachTaiKhoan,
    taiDanhSachVaiTro,
  ]);

  const danhSachVaiTroNhanVien =
    useMemo(
      () =>
        danhSachVaiTro.filter(
          (vaiTro) => {
            const ten =
              vaiTro.tenVaiTro
                .trim()
                .toUpperCase();

            return (
              vaiTro.trangThai
              && (
                ten === "ADMIN"
                || ten ===
                  "DUOC_SI"
              )
            );
          },
        ),
      [danhSachVaiTro],
    );

  const moFormThemTaiKhoan =
    () => {
      setTaiKhoanCanSua(null);
      setHoTen("");
      setSoDienThoai("");
      setMatKhau("");
      setDanhSachMaVaiTro([]);
      setHienFormTaiKhoan(
        true,
      );
    };

  const moFormSuaTaiKhoan = (
    taiKhoan:
      TaiKhoanNhanVien,
  ) => {
    setTaiKhoanCanSua(
      taiKhoan,
    );

    setHoTen(
      taiKhoan.hoTen,
    );

    setSoDienThoai(
      taiKhoan.soDienThoai,
    );

    setMatKhau("");

    setDanhSachMaVaiTro(
      taiKhoan.danhSachVaiTro.map(
        (vaiTro) =>
          vaiTro.maVaiTro,
      ),
    );

    setHienFormTaiKhoan(
      true,
    );
  };

  const dongFormTaiKhoan =
    () => {
      if (
        dangLuuTaiKhoan
      ) {
        return;
      }

      setHienFormTaiKhoan(
        false,
      );

      setTaiKhoanCanSua(
        null,
      );
    };

  const thayDoiVaiTroTaiKhoan =
    (
      maVaiTro: number,
    ) => {
      setDanhSachMaVaiTro(
        (danhSachCu) => {
          if (
            danhSachCu.includes(
              maVaiTro,
            )
          ) {
            return danhSachCu.filter(
              (ma) =>
                ma !== maVaiTro,
            );
          }

          return [
            ...danhSachCu,
            maVaiTro,
          ];
        },
      );
    };

  const xuLyLuuTaiKhoan =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const hoTenDaChuanHoa =
        hoTen.trim();

      const soDienThoaiDaChuanHoa =
        soDienThoai.trim();

      if (!hoTenDaChuanHoa) {
        thongBao.hienThongBao(
          "Họ tên nhân viên không được để trống.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !/^0\d{9,10}$/.test(
          soDienThoaiDaChuanHoa,
        )
      ) {
        thongBao.hienThongBao(
          "Số điện thoại không đúng định dạng.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        danhSachMaVaiTro.length
        === 0
      ) {
        thongBao.hienThongBao(
          "Phải chọn ít nhất một vai trò.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        !taiKhoanCanSua
        && (
          matKhau.length < 8
          || matKhau.length
            > 100
        )
      ) {
        thongBao.hienThongBao(
          "Mật khẩu phải có từ 8 đến 100 ký tự.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      try {
        setDangLuuTaiKhoan(
          true,
        );

        if (
          taiKhoanCanSua
        ) {
          const request:
            TaiKhoanNhanVienCapNhatRequest =
          {
            hoTen:
              hoTenDaChuanHoa,
            soDienThoai:
              soDienThoaiDaChuanHoa,
            danhSachMaVaiTro,
          };

          await capNhatTaiKhoanNhanVien(
            taiKhoanCanSua.maNhanVien,
            request,
          );

          thongBao.hienThongBao(
            "Cập nhật tài khoản nhân viên thành công.",
            "THANH_CONG",
            "Thành công",
          );
        } else {
          const request:
            TaiKhoanNhanVienTaoRequest =
          {
            hoTen:
              hoTenDaChuanHoa,
            soDienThoai:
              soDienThoaiDaChuanHoa,
            matKhau,
            danhSachMaVaiTro,
          };

          await themTaiKhoanNhanVien(
            request,
          );

          thongBao.hienThongBao(
            "Thêm tài khoản nhân viên thành công.",
            "THANH_CONG",
            "Thành công",
          );
        }

        setHienFormTaiKhoan(
          false,
        );

        setTaiKhoanCanSua(
          null,
        );

        await taiDanhSachTaiKhoan();
      } catch (error) {
        console.error(
          "Không thể lưu tài khoản nhân viên:",
          error,
        );

        thongBao.hienThongBao(
          layThongBaoLoi(
            error,
            "Không thể lưu tài khoản nhân viên.",
          ),
          "LOI",
          "Không thể lưu dữ liệu",
        );
      } finally {
        setDangLuuTaiKhoan(
          false,
        );
      }
    };

  const moFormThemVaiTro =
    () => {
      setVaiTroCanSua(null);
      setTenVaiTro("");
      setMoTaVaiTro("");
      setHienFormVaiTro(
        true,
      );
    };

  const moFormSuaVaiTro = (
    vaiTro: VaiTro,
  ) => {
    setVaiTroCanSua(vaiTro);

    setTenVaiTro(
      vaiTro.tenVaiTro,
    );

    setMoTaVaiTro(
      vaiTro.moTa ?? "",
    );

    setHienFormVaiTro(
      true,
    );
  };

  const dongFormVaiTro =
    () => {
      if (dangLuuVaiTro) {
        return;
      }

      setHienFormVaiTro(
        false,
      );

      setVaiTroCanSua(
        null,
      );
    };

  const xuLyLuuVaiTro =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const tenDaChuanHoa =
        tenVaiTro.trim();

      if (!tenDaChuanHoa) {
        thongBao.hienThongBao(
          "Tên vai trò không được để trống.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        tenDaChuanHoa.length
        > 50
      ) {
        thongBao.hienThongBao(
          "Tên vai trò không được vượt quá 50 ký tự.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      if (
        moTaVaiTro.trim()
          .length > 255
      ) {
        thongBao.hienThongBao(
          "Mô tả không được vượt quá 255 ký tự.",
          "CANH_BAO",
          "Dữ liệu chưa hợp lệ",
        );

        return;
      }

      const request:
        VaiTroRequest =
      {
        tenVaiTro:
          tenDaChuanHoa,
        moTa:
          moTaVaiTro.trim()
          || null,
      };

      try {
        setDangLuuVaiTro(
          true,
        );

        if (vaiTroCanSua) {
          await capNhatVaiTro(
            vaiTroCanSua.maVaiTro,
            request,
          );

          thongBao.hienThongBao(
            "Cập nhật vai trò thành công.",
            "THANH_CONG",
            "Thành công",
          );
        } else {
          await themVaiTro(
            request,
          );

          thongBao.hienThongBao(
            "Thêm vai trò thành công.",
            "THANH_CONG",
            "Thành công",
          );
        }

        setHienFormVaiTro(
          false,
        );

        setVaiTroCanSua(null);

        await taiDanhSachVaiTro();
      } catch (error) {
        console.error(
          "Không thể lưu vai trò:",
          error,
        );

        thongBao.hienThongBao(
          layThongBaoLoi(
            error,
            "Không thể lưu vai trò.",
          ),
          "LOI",
          "Không thể lưu dữ liệu",
        );
      } finally {
        setDangLuuVaiTro(
          false,
        );
      }
    };

  const moXacNhanTaiKhoan =
    (
      taiKhoan:
        TaiKhoanNhanVien,
    ) => {
      setLoaiXacNhan(
        "TAI_KHOAN",
      );

      setDoiTuongChoDoiTrangThai(
        taiKhoan,
      );
    };

  const moXacNhanVaiTro = (
    vaiTro: VaiTro,
  ) => {
    setLoaiXacNhan(
      "VAI_TRO",
    );

    setDoiTuongChoDoiTrangThai(
      vaiTro,
    );
  };

  const dongXacNhan = () => {
    if (
      dangDoiTrangThai
    ) {
      return;
    }

    setLoaiXacNhan(null);

    setDoiTuongChoDoiTrangThai(
      null,
    );
  };

  const xacNhanDoiTrangThai =
    async () => {
      if (
        !loaiXacNhan
        || !doiTuongChoDoiTrangThai
      ) {
        return;
      }

      try {
        setDangDoiTrangThai(
          true,
        );

        if (
          loaiXacNhan
          === "TAI_KHOAN"
        ) {
          const taiKhoan =
            doiTuongChoDoiTrangThai as TaiKhoanNhanVien;

          await doiTrangThaiTaiKhoanNhanVien(
            taiKhoan.maNhanVien,
          );

          thongBao.hienThongBao(
            taiKhoan.trangThaiTaiKhoan
              ? "Khóa tài khoản nhân viên thành công."
              : "Mở lại tài khoản nhân viên thành công.",
            "THANH_CONG",
            "Thành công",
          );

          await taiDanhSachTaiKhoan();
        } else {
          const vaiTro =
            doiTuongChoDoiTrangThai as VaiTro;

          await doiTrangThaiVaiTro(
            vaiTro.maVaiTro,
          );

          thongBao.hienThongBao(
            vaiTro.trangThai
              ? "Ngừng hoạt động vai trò thành công."
              : "Kích hoạt vai trò thành công.",
            "THANH_CONG",
            "Thành công",
          );

          await taiDanhSachVaiTro();
        }

        setLoaiXacNhan(null);

        setDoiTuongChoDoiTrangThai(
          null,
        );
      } catch (error) {
        console.error(
          "Không thể đổi trạng thái:",
          error,
        );

        thongBao.hienThongBao(
          layThongBaoLoi(
            error,
            "Không thể thay đổi trạng thái.",
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

  const noiDungXacNhan =
    () => {
      if (
        loaiXacNhan
          === "TAI_KHOAN"
        && doiTuongChoDoiTrangThai
      ) {
        const taiKhoan =
          doiTuongChoDoiTrangThai as TaiKhoanNhanVien;

        return taiKhoan.trangThaiTaiKhoan
          ? `Bạn có chắc muốn khóa tài khoản của "${taiKhoan.hoTen}"?`
          : `Bạn có chắc muốn mở lại tài khoản của "${taiKhoan.hoTen}"?`;
      }

      if (
        loaiXacNhan
          === "VAI_TRO"
        && doiTuongChoDoiTrangThai
      ) {
        const vaiTro =
          doiTuongChoDoiTrangThai as VaiTro;

        return vaiTro.trangThai
          ? `Bạn có chắc muốn ngừng hoạt động vai trò "${vaiTro.tenVaiTro}"?`
          : `Bạn có chắc muốn kích hoạt lại vai trò "${vaiTro.tenVaiTro}"?`;
      }

      return "";
    };

  return (
    <div className="ql-page tai-khoan-vai-tro-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý tài khoản & vai trò"
        moTa="Quản lý tài khoản nhân viên nội bộ và danh sách vai trò trong hệ thống"
      />

      <div className="tkvt-tabs">
        <button
          type="button"
          className={
            tabDangChon
              === "TAI_KHOAN"
              ? "tkvt-tab tkvt-tab-active"
              : "tkvt-tab"
          }
          onClick={() =>
            setTabDangChon(
              "TAI_KHOAN",
            )
          }
        >
          <i className="bi bi-people" />
          Tài khoản nhân viên
        </button>

        <button
          type="button"
          className={
            tabDangChon
              === "VAI_TRO"
              ? "tkvt-tab tkvt-tab-active"
              : "tkvt-tab"
          }
          onClick={() =>
            setTabDangChon(
              "VAI_TRO",
            )
          }
        >
          <i className="bi bi-person-badge" />
          Vai trò
        </button>
      </div>

      {tabDangChon
        === "TAI_KHOAN"
        ? (
          <section className="tkvt-section">
            <div className="tkvt-section-header">
              <div>
                <h2>
                  Tài khoản nhân viên
                </h2>

                <p>
                  Tổng cộng{" "}
                  <strong>
                    {
                      danhSachTaiKhoan.length
                    }
                  </strong>{" "}
                  nhân viên.
                </p>
              </div>

              <button
                type="button"
                className="ql-button ql-button-primary"
                onClick={
                  moFormThemTaiKhoan
                }
              >
                <i className="bi bi-plus-lg" />
                Thêm tài khoản
              </button>
            </div>

            {loiTaiKhoan && (
              <div className="tkvt-error">
                <i className="bi bi-exclamation-circle-fill" />
                {loiTaiKhoan}
              </div>
            )}

            <div className="tkvt-table-wrapper">
              <table className="tkvt-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {dangTaiTaiKhoan
                    ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="tkvt-table-message"
                        >
                          <AdminLoading
                            noiDung="Đang tải danh sách tài khoản..."
                          />
                        </td>
                      </tr>
                    )
                    : danhSachTaiKhoan.length
                      === 0
                      ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="tkvt-table-message"
                          >
                            Chưa có tài khoản nhân viên.
                          </td>
                        </tr>
                      )
                      : danhSachTaiKhoan.map(
                        (taiKhoan) => (
                          <tr
                            key={
                              taiKhoan.maNhanVien
                            }
                          >
                            <td>
                              #
                              {
                                taiKhoan.maNhanVien
                              }
                            </td>

                            <td>
                              <strong>
                                {
                                  taiKhoan.hoTen
                                }
                              </strong>
                            </td>

                            <td>
                              {
                                taiKhoan.soDienThoai
                              }
                            </td>

                            <td>
                              <div className="tkvt-role-list">
                                {taiKhoan
                                  .danhSachVaiTro
                                  .map(
                                    (
                                      vaiTro,
                                    ) => (
                                      <span
                                        key={
                                          vaiTro.maVaiTro
                                        }
                                        className="tkvt-role-badge"
                                      >
                                        {
                                          vaiTro.tenVaiTro
                                        }
                                      </span>
                                    ),
                                  )}
                              </div>
                            </td>

                            <td>
                              {dinhDangNgayGio(
                                taiKhoan.ngayTao,
                              )}
                            </td>

                            <td>
                              <span
                                className={
                                  taiKhoan.trangThaiTaiKhoan
                                    ? "tkvt-status tkvt-status-active"
                                    : "tkvt-status tkvt-status-inactive"
                                }
                              >
                                {taiKhoan.trangThaiTaiKhoan
                                  ? "Hoạt động"
                                  : "Đã khóa"}
                              </span>
                            </td>

                            <td>
                              <div className="tkvt-actions">
                                <button
                                  type="button"
                                  className="tkvt-action-button"
                                  onClick={() =>
                                    moFormSuaTaiKhoan(
                                      taiKhoan,
                                    )
                                  }
                                  title="Chỉnh sửa"
                                >
                                  <i className="bi bi-pencil-square" />
                                </button>

                                <button
                                  type="button"
                                  className={
                                    taiKhoan.trangThaiTaiKhoan
                                      ? "tkvt-action-button tkvt-action-danger"
                                      : "tkvt-action-button tkvt-action-success"
                                  }
                                  onClick={() =>
                                    moXacNhanTaiKhoan(
                                      taiKhoan,
                                    )
                                  }
                                  title={
                                    taiKhoan.trangThaiTaiKhoan
                                      ? "Khóa tài khoản"
                                      : "Mở tài khoản"
                                  }
                                >
                                  <i
                                    className={
                                      taiKhoan.trangThaiTaiKhoan
                                        ? "bi bi-lock"
                                        : "bi bi-unlock"
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
        )
        : (
          <section className="tkvt-section">
            <div className="tkvt-section-header">
              <div>
                <h2>
                  Danh sách vai trò
                </h2>

                <p>
                  Tổng cộng{" "}
                  <strong>
                    {
                      danhSachVaiTro.length
                    }
                  </strong>{" "}
                  vai trò.
                </p>
              </div>

              <button
                type="button"
                className="ql-button ql-button-primary"
                onClick={
                  moFormThemVaiTro
                }
              >
                <i className="bi bi-plus-lg" />
                Thêm vai trò
              </button>
            </div>

            {loiVaiTro && (
              <div className="tkvt-error">
                <i className="bi bi-exclamation-circle-fill" />
                {loiVaiTro}
              </div>
            )}

            <div className="tkvt-table-wrapper">
              <table className="tkvt-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>
                      Tên vai trò
                    </th>
                    <th>Mô tả</th>
                    <th>
                      Trạng thái
                    </th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {dangTaiVaiTro
                    ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="tkvt-table-message"
                        >
                          <AdminLoading
                            noiDung="Đang tải danh sách vai trò..."
                          />
                        </td>
                      </tr>
                    )
                    : danhSachVaiTro.length
                      === 0
                      ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="tkvt-table-message"
                          >
                            Chưa có vai trò.
                          </td>
                        </tr>
                      )
                      : danhSachVaiTro.map(
                        (vaiTro) => (
                          <tr
                            key={
                              vaiTro.maVaiTro
                            }
                          >
                            <td>
                              #
                              {
                                vaiTro.maVaiTro
                              }
                            </td>

                            <td>
                              <strong>
                                {
                                  vaiTro.tenVaiTro
                                }
                              </strong>
                            </td>

                            <td>
                              {
                                vaiTro.moTa
                                || "-"
                              }
                            </td>

                            <td>
                              <span
                                className={
                                  vaiTro.trangThai
                                    ? "tkvt-status tkvt-status-active"
                                    : "tkvt-status tkvt-status-inactive"
                                }
                              >
                                {vaiTro.trangThai
                                  ? "Hoạt động"
                                  : "Ngừng hoạt động"}
                              </span>
                            </td>

                            <td>
                              <div className="tkvt-actions">
                                <button
                                  type="button"
                                  className="tkvt-action-button"
                                  onClick={() =>
                                    moFormSuaVaiTro(
                                      vaiTro,
                                    )
                                  }
                                  title="Chỉnh sửa"
                                >
                                  <i className="bi bi-pencil-square" />
                                </button>

                                <button
                                  type="button"
                                  className={
                                    vaiTro.trangThai
                                      ? "tkvt-action-button tkvt-action-danger"
                                      : "tkvt-action-button tkvt-action-success"
                                  }
                                  onClick={() =>
                                    moXacNhanVaiTro(
                                      vaiTro,
                                    )
                                  }
                                  title={
                                    vaiTro.trangThai
                                      ? "Ngừng hoạt động"
                                      : "Kích hoạt"
                                  }
                                >
                                  <i
                                    className={
                                      vaiTro.trangThai
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
        )}

      {hienFormTaiKhoan && (
        <div className="tkvt-modal-overlay">
          <div className="tkvt-modal">
            <div className="tkvt-modal-header">
              <div>
                <h2>
                  {taiKhoanCanSua
                    ? "Cập nhật tài khoản"
                    : "Thêm tài khoản nhân viên"}
                </h2>

                <p>
                  {taiKhoanCanSua
                    ? "Cập nhật thông tin và vai trò của nhân viên."
                    : "Tạo tài khoản đăng nhập cho nhân viên nội bộ."}
                </p>
              </div>

              <button
                type="button"
                className="tkvt-modal-close"
                onClick={
                  dongFormTaiKhoan
                }
                disabled={
                  dangLuuTaiKhoan
                }
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={
                xuLyLuuTaiKhoan
              }
            >
              <div className="tkvt-modal-body">
                <div className="tkvt-form-group">
                  <label
                    htmlFor="tkvtHoTen"
                  >
                    Họ tên *
                  </label>

                  <input
                    id="tkvtHoTen"
                    type="text"
                    value={hoTen}
                    maxLength={100}
                    onChange={(event) =>
                      setHoTen(
                        event.target.value,
                      )
                    }
                    disabled={
                      dangLuuTaiKhoan
                    }
                  />
                </div>

                <div className="tkvt-form-group">
                  <label
                    htmlFor="tkvtSoDienThoai"
                  >
                    Số điện thoại *
                  </label>

                  <input
                    id="tkvtSoDienThoai"
                    type="text"
                    value={
                      soDienThoai
                    }
                    maxLength={20}
                    onChange={(event) =>
                      setSoDienThoai(
                        event.target.value,
                      )
                    }
                    disabled={
                      dangLuuTaiKhoan
                    }
                  />
                </div>

                {!taiKhoanCanSua && (
                  <div className="tkvt-form-group">
                    <label
                      htmlFor="tkvtMatKhau"
                    >
                      Mật khẩu *
                    </label>

                    <input
                      id="tkvtMatKhau"
                      type="password"
                      value={matKhau}
                      maxLength={100}
                      onChange={(event) =>
                        setMatKhau(
                          event.target.value,
                        )
                      }
                      disabled={
                        dangLuuTaiKhoan
                      }
                      autoComplete="new-password"
                    />

                    <small>
                      Từ 8 đến 100 ký tự.
                    </small>
                  </div>
                )}

                <div className="tkvt-form-group">
                  <label>
                    Vai trò *
                  </label>

                  <div className="tkvt-role-options">
                    {danhSachVaiTroNhanVien.length
                      === 0
                      ? (
                        <div className="tkvt-empty-role">
                          Không có vai trò ADMIN hoặc DUOC_SI đang hoạt động.
                        </div>
                      )
                      : danhSachVaiTroNhanVien.map(
                        (vaiTro) => (
                          <label
                            key={
                              vaiTro.maVaiTro
                            }
                            className="tkvt-role-option"
                          >
                            <input
                              type="checkbox"
                              checked={
                                danhSachMaVaiTro.includes(
                                  vaiTro.maVaiTro,
                                )
                              }
                              onChange={() =>
                                thayDoiVaiTroTaiKhoan(
                                  vaiTro.maVaiTro,
                                )
                              }
                              disabled={
                                dangLuuTaiKhoan
                              }
                            />

                            <span>
                              {
                                vaiTro.tenVaiTro
                              }
                            </span>
                          </label>
                        ),
                      )}
                  </div>
                </div>
              </div>

              <div className="tkvt-modal-footer">
                <button
                  type="button"
                  className="ql-button ql-button-ghost"
                  onClick={
                    dongFormTaiKhoan
                  }
                  disabled={
                    dangLuuTaiKhoan
                  }
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="ql-button ql-button-primary"
                  disabled={
                    dangLuuTaiKhoan
                  }
                >
                  {dangLuuTaiKhoan
                    ? "Đang lưu..."
                    : taiKhoanCanSua
                      ? "Cập nhật"
                      : "Thêm tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hienFormVaiTro && (
        <div className="tkvt-modal-overlay">
          <div className="tkvt-modal tkvt-modal-small">
            <div className="tkvt-modal-header">
              <div>
                <h2>
                  {vaiTroCanSua
                    ? "Cập nhật vai trò"
                    : "Thêm vai trò"}
                </h2>
              </div>

              <button
                type="button"
                className="tkvt-modal-close"
                onClick={
                  dongFormVaiTro
                }
                disabled={
                  dangLuuVaiTro
                }
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={
                xuLyLuuVaiTro
              }
            >
              <div className="tkvt-modal-body">
                <div className="tkvt-form-group">
                  <label
                    htmlFor="tkvtTenVaiTro"
                  >
                    Tên vai trò *
                  </label>

                  <input
                    id="tkvtTenVaiTro"
                    type="text"
                    value={tenVaiTro}
                    maxLength={50}
                    onChange={(event) =>
                      setTenVaiTro(
                        event.target.value,
                      )
                    }
                    disabled={
                      dangLuuVaiTro
                    }
                  />
                </div>

                <div className="tkvt-form-group">
                  <label
                    htmlFor="tkvtMoTaVaiTro"
                  >
                    Mô tả
                  </label>

                  <textarea
                    id="tkvtMoTaVaiTro"
                    value={moTaVaiTro}
                    maxLength={255}
                    rows={4}
                    onChange={(event) =>
                      setMoTaVaiTro(
                        event.target.value,
                      )
                    }
                    disabled={
                      dangLuuVaiTro
                    }
                  />
                </div>
              </div>

              <div className="tkvt-modal-footer">
                <button
                  type="button"
                  className="ql-button ql-button-ghost"
                  onClick={
                    dongFormVaiTro
                  }
                  disabled={
                    dangLuuVaiTro
                  }
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="ql-button ql-button-primary"
                  disabled={
                    dangLuuVaiTro
                  }
                >
                  {dangLuuVaiTro
                    ? "Đang lưu..."
                    : vaiTroCanSua
                      ? "Cập nhật"
                      : "Thêm vai trò"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminXacNhan
        dangHien={
          loaiXacNhan !== null
        }
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={
          noiDungXacNhan()
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
          dongXacNhan
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
        loai={thongBao.loai}
        dongThongBao={
          thongBao.dongThongBao
        }
      />
    </div>
  );
}

export default QuanLyTaiKhoanVaiTroPage;