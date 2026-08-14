import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatNhaSanXuat,
  themNhaSanXuat,
} from "../api/nhaSanXuatApi";

import type {
  NhaSanXuat,
  NhaSanXuatRequest,
} from "../types/NhaSanXuat";

type NhaSanXuatFormData = {
  tenNhaSanXuat: string;
  quocGia: string;
  diaChi: string;
};

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type NhaSanXuatFormModalProps = {
  isOpen: boolean;
  nhaSanXuatCanSua: NhaSanXuat | null;
  onClose: () => void;
  onSuccess: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  nhaSanXuatCanSua: NhaSanXuat | null,
): NhaSanXuatFormData => {
  if (nhaSanXuatCanSua) {
    return {
      tenNhaSanXuat:
        nhaSanXuatCanSua.tenNhaSanXuat,
      quocGia:
        nhaSanXuatCanSua.quocGia ?? "",
      diaChi:
        nhaSanXuatCanSua.diaChi ?? "",
    };
  }

  return {
    tenNhaSanXuat: "",
    quocGia: "",
    diaChi: "",
  };
};

function NhaSanXuatFormModal(
  props: NhaSanXuatFormModalProps,
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <NhaSanXuatFormNoiDung
      key={
        props.nhaSanXuatCanSua?.maNhaSanXuat ??
        "them-moi"
      }
      {...props}
    />
  );
}

function NhaSanXuatFormNoiDung({
  nhaSanXuatCanSua,
  onClose,
  onSuccess,
  onThongBao,
}: NhaSanXuatFormModalProps) {
  const [formData, setFormData] =
    useState<NhaSanXuatFormData>(
      () => taoDuLieuForm(nhaSanXuatCanSua),
    );

  const [dangLuu, setDangLuu] =
    useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((duLieuCu) => ({
      ...duLieuCu,
      [name]: value,
    }));
  };

  const xuLySubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const tenNhaSanXuat =
      formData.tenNhaSanXuat.trim();

    if (!tenNhaSanXuat) {
      onThongBao(
        "Tên nhà sản xuất không được để trống.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    const request: NhaSanXuatRequest = {
      tenNhaSanXuat,
      quocGia:
        formData.quocGia.trim() || null,
      diaChi:
        formData.diaChi.trim() || null,
    };

    try {
      setDangLuu(true);

      if (nhaSanXuatCanSua) {
        await capNhatNhaSanXuat(
          nhaSanXuatCanSua.maNhaSanXuat,
          request,
        );

        onSuccess();

        onThongBao(
          "Cập nhật nhà sản xuất thành công.",
          "THANH_CONG",
          "Thành công",
        );
      } else {
        await themNhaSanXuat(request);

        onSuccess();

        onThongBao(
          "Thêm nhà sản xuất thành công.",
          "THANH_CONG",
          "Thành công",
        );
      }
    } catch (error) {
      console.error(
        "Không thể lưu nhà sản xuất:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      onThongBao(
        message ??
          "Không thể lưu nhà sản xuất.",
        "LOI",
        "Không thể lưu dữ liệu",
      );
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card unit-form-modal">
        <div className="modal-header">
          <div>
            <h2>
              {nhaSanXuatCanSua
                ? "Cập nhật nhà sản xuất"
                : "Thêm nhà sản xuất"}
            </h2>

            <p>
              Quản trị viên khai báo tên, quốc gia
              và địa chỉ của nhà sản xuất.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            disabled={dangLuu}
          >
            ×
          </button>
        </div>

        <form noValidate onSubmit={xuLySubmit}>
          <div className="form-group">
            <label htmlFor="tenNhaSanXuat">
              Tên nhà sản xuất
            </label>

            <input
              id="tenNhaSanXuat"
              type="text"
              name="tenNhaSanXuat"
              value={formData.tenNhaSanXuat}
              onChange={xuLyThayDoiInput}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quocGia">
              Quốc gia
            </label>

            <input
              id="quocGia"
              type="text"
              name="quocGia"
              value={formData.quocGia}
              onChange={xuLyThayDoiInput}
              maxLength={100}
              placeholder="Có thể để trống"
            />
          </div>

          <div className="form-group">
            <label htmlFor="diaChi">
              Địa chỉ
            </label>

            <textarea
              id="diaChi"
              name="diaChi"
              value={formData.diaChi}
              onChange={xuLyThayDoiInput}
              maxLength={255}
              rows={4}
              placeholder="Có thể để trống"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={dangLuu}
            >
              {dangLuu
                ? "Đang lưu..."
                : nhaSanXuatCanSua
                  ? "Cập nhật"
                  : "Thêm nhà sản xuất"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={dangLuu}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NhaSanXuatFormModal;