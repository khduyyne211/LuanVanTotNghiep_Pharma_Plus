import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatKhuyenMai,
  themKhuyenMai,
} from "../api/khuyenMaiApi";

import type {
  KhuyenMai,
  KhuyenMaiRequest,
  KieuGiamGia,
} from "../types/KhuyenMai";

type KhuyenMaiFormData = {
  tenChuongTrinh: string;
  kieuGiamGia: KieuGiamGia;
  giaTriGiam: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
};

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type KhuyenMaiFormModalProps = {
  isOpen: boolean;
  khuyenMaiCanSua: KhuyenMai | null;
  onClose: () => void;
  onSuccess: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  khuyenMaiCanSua: KhuyenMai | null,
): KhuyenMaiFormData => {
  if (khuyenMaiCanSua) {
    return {
      tenChuongTrinh:
        khuyenMaiCanSua.tenChuongTrinh,

      kieuGiamGia:
        khuyenMaiCanSua.kieuGiamGia,

      giaTriGiam:
        String(khuyenMaiCanSua.giaTriGiam),

      thoiGianBatDau:
        khuyenMaiCanSua.thoiGianBatDau.slice(
          0,
          16,
        ),

      thoiGianKetThuc:
        khuyenMaiCanSua.thoiGianKetThuc.slice(
          0,
          16,
        ),
    };
  }

  return {
    tenChuongTrinh: "",
    kieuGiamGia: "PHAN_TRAM",
    giaTriGiam: "",
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
  };
};

function KhuyenMaiFormModal(
  props: KhuyenMaiFormModalProps,
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <KhuyenMaiFormNoiDung
      key={
        props.khuyenMaiCanSua?.maKhuyenMai ??
        "them-moi"
      }
      {...props}
    />
  );
}

function KhuyenMaiFormNoiDung({
  khuyenMaiCanSua,
  onClose,
  onSuccess,
  onThongBao,
}: KhuyenMaiFormModalProps) {
  const [formData, setFormData] =
    useState<KhuyenMaiFormData>(
      () => taoDuLieuForm(khuyenMaiCanSua),
    );

  const [dangLuu, setDangLuu] =
    useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((duLieuCu) => {
      if (name === "kieuGiamGia") {
        return {
          ...duLieuCu,
          kieuGiamGia: value as KieuGiamGia,
          giaTriGiam: "",
        };
      }

      return {
        ...duLieuCu,
        [name]: value,
      };
    });
  };

  const xuLySubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const tenChuongTrinh =
      formData.tenChuongTrinh.trim();

    if (!tenChuongTrinh) {
      onThongBao(
        "Tên chương trình không được để trống.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    const request: KhuyenMaiRequest = {
      tenChuongTrinh,

      loaiKhuyenMai: "SAN_PHAM",

      kieuGiamGia:
        formData.kieuGiamGia,

      giaTriGiam:
        Number(formData.giaTriGiam),

      thoiGianBatDau:
        formData.thoiGianBatDau,

      thoiGianKetThuc:
        formData.thoiGianKetThuc,
    };

    try {
      setDangLuu(true);

      if (khuyenMaiCanSua) {
        await capNhatKhuyenMai(
          khuyenMaiCanSua.maKhuyenMai,
          request,
        );

        onSuccess();

        onThongBao(
          "Cập nhật khuyến mãi thành công.",
          "THANH_CONG",
          "Thành công",
        );
      } else {
        await themKhuyenMai(request);

        onSuccess();

        onThongBao(
          "Thêm khuyến mãi thành công.",
          "THANH_CONG",
          "Thành công",
        );
      }
    } catch (error) {
      console.error(
        "Không thể lưu khuyến mãi:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      onThongBao(
        message ??
          "Không thể lưu khuyến mãi.",
        "LOI",
        "Không thể lưu dữ liệu",
      );
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>
              {khuyenMaiCanSua
                ? "Cập nhật khuyến mãi"
                : "Thêm khuyến mãi"}
            </h2>

            <p>
              Khai báo tên chương trình, kiểu giảm
              giá và thời gian áp dụng khuyến mãi.
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

        <form noValidate onSubmit={xuLySubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="tenChuongTrinh">
                Tên chương trình
              </label>

              <input
                id="tenChuongTrinh"
                type="text"
                name="tenChuongTrinh"
                value={formData.tenChuongTrinh}
                onChange={xuLyThayDoiInput}
                maxLength={150}
                placeholder="Nhập tên chương trình khuyến mãi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="kieuGiamGia">
                Kiểu giảm giá
              </label>

              <select
                id="kieuGiamGia"
                name="kieuGiamGia"
                value={formData.kieuGiamGia}
                onChange={xuLyThayDoiInput}
                required
              >
                <option value="PHAN_TRAM">
                  Giảm theo phần trăm
                </option>

                <option value="SO_TIEN">
                  Giảm theo số tiền
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="giaTriGiam">
                {formData.kieuGiamGia === "PHAN_TRAM"
                  ? "Phần trăm giảm"
                  : "Số tiền giảm"}
              </label>

              <input
                id="giaTriGiam"
                type="number"
                name="giaTriGiam"
                value={formData.giaTriGiam}
                onChange={xuLyThayDoiInput}
                min="0.01"
                max={
                  formData.kieuGiamGia === "PHAN_TRAM"
                    ? "100"
                    : undefined
                }
                step="0.01"
                placeholder={
                  formData.kieuGiamGia === "PHAN_TRAM"
                    ? "Ví dụ: 10"
                    : "Ví dụ: 50000"
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="thoiGianBatDau">
                Thời gian bắt đầu
              </label>

              <input
                id="thoiGianBatDau"
                type="datetime-local"
                name="thoiGianBatDau"
                value={formData.thoiGianBatDau}
                onChange={xuLyThayDoiInput}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="thoiGianKetThuc">
                Thời gian kết thúc
              </label>

              <input
                id="thoiGianKetThuc"
                type="datetime-local"
                name="thoiGianKetThuc"
                value={formData.thoiGianKetThuc}
                onChange={xuLyThayDoiInput}
                required
              />
            </div>
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
              type="submit"
              className="primary-button"
              disabled={dangLuu}
            >
              {dangLuu
                ? "Đang lưu..."
                : khuyenMaiCanSua
                  ? "Cập nhật"
                  : "Thêm khuyến mãi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KhuyenMaiFormModal;
