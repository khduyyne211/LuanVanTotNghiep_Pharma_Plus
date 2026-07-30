import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";

import {
  capNhatVaiTro,
  themVaiTro,
} from "../api/vaiTroApi";
import type {
  VaiTro,
  VaiTroRequest,
} from "../types/VaiTro";

type VaiTroFormData = {
  tenVaiTro: string;
  moTa: string;
};

type VaiTroFormModalProps = {
  isOpen: boolean;
  VaiTroCanSua: VaiTro | null;
  onClose: () => void;
  onSuccess: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  VaiTroCanSua: VaiTro | null
): VaiTroFormData => {
  if (VaiTroCanSua) {
    return {
      tenVaiTro: VaiTroCanSua.tenVaiTro,
      moTa: VaiTroCanSua.moTa ?? "",
    };
  }

  return {
    tenVaiTro: "",
    moTa: "",
  };
};

function VaiTroFormModal(
  props: VaiTroFormModalProps
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <VaiTroFormNoiDung
      key={
        props.VaiTroCanSua?.maVaiTro ??
        "them-moi"
      }
      {...props}
    />
  );
}

function VaiTroFormNoiDung({
  VaiTroCanSua,
  onClose,
  onSuccess,
}: VaiTroFormModalProps) {
  const [formData, setFormData] =
    useState<VaiTroFormData>(
      () => taoDuLieuForm(VaiTroCanSua)
    );

  const [dangLuu, setDangLuu] = useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((duLieuCu) => ({
      ...duLieuCu,
      [name]: value,
    }));
  };

  const xuLySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const tenVaiTro = formData.tenVaiTro.trim();

    if (!tenVaiTro) {
      alert(
        "Tên vai trò không được để trống"
      );
      return;
    }

    const request: VaiTroRequest = {
      tenVaiTro,
      moTa: formData.moTa.trim() || null,
    };

    try {
      setDangLuu(true);

      if (VaiTroCanSua) {
        await capNhatVaiTro(
          VaiTroCanSua.maVaiTro,
          request
        );
      } else {
        await themVaiTro(request);
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Không thể lưu vai trò:",
        error
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      alert(
        message ??
          "Không thể lưu vai trò."
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
              {VaiTroCanSua
                ? "Cập nhật vai trò"
                : "Thêm vai trò"}
            </h2>

            <p>
              Quản trị viên khai báo tên và mô tả của vai trò.
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

        <form onSubmit={xuLySubmit}>
          <div className="form-group">
            <label htmlFor="tenVaiTro">
              Tên vai trò
            </label>

            <input
              id="tenVaiTro"
              type="text"
              name="tenVaiTro"
              value={formData.tenVaiTro}
              onChange={xuLyThayDoiInput}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="moTa">
              Mô tả
            </label>

            <textarea
              id="moTa"
              name="moTa"
              value={formData.moTa}
              onChange={xuLyThayDoiInput}
              maxLength={255}
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
                : VaiTroCanSua
                  ? "Cập nhật"
                  : "Thêm vai trò"}
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

export default VaiTroFormModal;