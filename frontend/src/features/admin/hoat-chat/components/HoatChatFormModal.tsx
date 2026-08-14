import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatHoatChat,
  themHoatChat,
} from "../api/hoatChatApi";

import type {
  HoatChat,
  HoatChatRequest,
} from "../types/HoatChat";

type HoatChatFormData = {
  tenHoatChat: string;
  donVi: string;
  moTa: string;
};

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type HoatChatFormModalProps = {
  isOpen: boolean;
  hoatChatCanSua: HoatChat | null;
  onClose: () => void;
  onSuccess: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  hoatChatCanSua: HoatChat | null,
): HoatChatFormData => {
  if (hoatChatCanSua) {
    return {
      tenHoatChat: hoatChatCanSua.tenHoatChat,
      donVi: hoatChatCanSua.donVi ?? "",
      moTa: hoatChatCanSua.moTa ?? "",
    };
  }

  return {
    tenHoatChat: "",
    donVi: "",
    moTa: "",
  };
};

function HoatChatFormModal(
  props: HoatChatFormModalProps,
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <HoatChatFormNoiDung
      key={
        props.hoatChatCanSua?.maHoatChat ??
        "them-moi"
      }
      {...props}
    />
  );
}

function HoatChatFormNoiDung({
  hoatChatCanSua,
  onClose,
  onSuccess,
  onThongBao,
}: HoatChatFormModalProps) {
  const [formData, setFormData] =
    useState<HoatChatFormData>(
      () => taoDuLieuForm(hoatChatCanSua),
    );

  const [dangLuu, setDangLuu] = useState(false);

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

    const tenHoatChat =
      formData.tenHoatChat.trim();

    if (!tenHoatChat) {
      onThongBao(
        "Tên hoạt chất không được để trống.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    const request: HoatChatRequest = {
      tenHoatChat,
      donVi: formData.donVi.trim() || null,
      moTa: formData.moTa.trim() || null,
    };

    try {
      setDangLuu(true);

      if (hoatChatCanSua) {
        await capNhatHoatChat(
          hoatChatCanSua.maHoatChat,
          request,
        );

        onSuccess();

        onThongBao(
          "Cập nhật hoạt chất thành công.",
          "THANH_CONG",
          "Thành công",
        );
      } else {
        await themHoatChat(request);

        onSuccess();

        onThongBao(
          "Thêm hoạt chất thành công.",
          "THANH_CONG",
          "Thành công",
        );
      }
    } catch (error) {
      console.error(
        "Không thể lưu hoạt chất:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      onThongBao(
        message ?? "Không thể lưu hoạt chất.",
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
              {hoatChatCanSua
                ? "Cập nhật hoạt chất"
                : "Thêm hoạt chất"}
            </h2>

            <p>
              Quản trị viên khai báo tên,
              đơn vị mặc định và mô tả của
              hoạt chất.
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
            <label htmlFor="tenHoatChat">
              Tên hoạt chất
            </label>

            <input
              id="tenHoatChat"
              type="text"
              name="tenHoatChat"
              value={formData.tenHoatChat}
              onChange={xuLyThayDoiInput}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="donVi">
              Đơn vị mặc định
            </label>

            <input
              id="donVi"
              type="text"
              name="donVi"
              value={formData.donVi}
              onChange={xuLyThayDoiInput}
              maxLength={50}
              placeholder="Ví dụ: mg, g, ml"
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
                : hoatChatCanSua
                  ? "Cập nhật"
                  : "Thêm hoạt chất"}
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

export default HoatChatFormModal;