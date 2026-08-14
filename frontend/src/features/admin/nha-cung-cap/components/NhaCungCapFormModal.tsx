import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatNhaCungCap,
  themNhaCungCap,
} from "../api/nhaCungCapApi";

import type {
  NhaCungCap,
  NhaCungCapRequest,
} from "../types/NhaCungCap";

type NhaCungCapFormData = {
  tenNhaCungCap: string;
  soDienThoai: string;
  diaChi: string;
  email: string;
};

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type NhaCungCapFormModalProps = {
  isOpen: boolean;
  NhaCungCapCanSua: NhaCungCap | null;
  onClose: () => void;
  onSuccess: () => void;
  onThongBao: HienThongBao;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  NhaCungCapCanSua: NhaCungCap | null,
): NhaCungCapFormData => {
  if (NhaCungCapCanSua) {
    return {
      tenNhaCungCap: NhaCungCapCanSua.tenNhaCungCap,
      soDienThoai: NhaCungCapCanSua.soDienThoai ?? "",
      diaChi: NhaCungCapCanSua.diaChi ?? "",
      email: NhaCungCapCanSua.email ?? "",
    };
  }

  return {
    tenNhaCungCap: "",
    soDienThoai: "",
    diaChi: "",
    email: "",
  };
};

function NhaCungCapFormModal(
  props: NhaCungCapFormModalProps,
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <NhaCungCapFormNoiDung
      key={
        props.NhaCungCapCanSua?.maNhaCungCap ??
        "them-moi"
      }
      {...props}
    />
  );
}

function NhaCungCapFormNoiDung({
  NhaCungCapCanSua,
  onClose,
  onSuccess,
  onThongBao,
}: NhaCungCapFormModalProps) {
  const [formData, setFormData] =
    useState<NhaCungCapFormData>(
      () => taoDuLieuForm(NhaCungCapCanSua),
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

    const tenNhaCungCap =
      formData.tenNhaCungCap.trim();

    if (!tenNhaCungCap) {
      onThongBao(
        "Tên nhà cung cấp không được để trống.",
        "CANH_BAO",
        "Dữ liệu chưa hợp lệ",
      );

      return;
    }

    const request: NhaCungCapRequest = {
      tenNhaCungCap,
      soDienThoai:
        formData.soDienThoai.trim() || null,
      diaChi:
        formData.diaChi.trim() || null,
      email:
        formData.email.trim() || null,
    };

    try {
      setDangLuu(true);

      if (NhaCungCapCanSua) {
        await capNhatNhaCungCap(
          NhaCungCapCanSua.maNhaCungCap,
          request,
        );

        onSuccess();

        onThongBao(
          "Cập nhật nhà cung cấp thành công.",
          "THANH_CONG",
          "Thành công",
        );
      } else {
        await themNhaCungCap(request);

        onSuccess();

        onThongBao(
          "Thêm nhà cung cấp thành công.",
          "THANH_CONG",
          "Thành công",
        );
      }
    } catch (error) {
      console.error(
        "Không thể lưu nhà cung cấp:",
        error,
      );

      const message =
        isAxiosError<ApiErrorResponse>(error)
          ? error.response?.data?.message
          : null;

      onThongBao(
        message ??
          "Không thể lưu nhà cung cấp.",
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
              {NhaCungCapCanSua
                ? "Cập nhật nhà cung cấp"
                : "Thêm nhà cung cấp"}
            </h2>

            <p>
              Quản trị viên khai báo tên,
              số điện thoại, địa chỉ và email của
              nhà cung cấp.
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
            <label htmlFor="tenNhaCungCap">
              Tên nhà cung cấp
            </label>

            <input
              id="tenNhaCungCap"
              type="text"
              name="tenNhaCungCap"
              value={formData.tenNhaCungCap}
              onChange={xuLyThayDoiInput}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="soDienThoai">
              Số điện thoại
            </label>

            <input
              id="soDienThoai"
              type="text"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={xuLyThayDoiInput}
              maxLength={20}
              placeholder="Ví dụ: 091333444"
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
              placeholder="Có thể để trống"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <textarea
              id="email"
              name="email"
              value={formData.email}
              onChange={xuLyThayDoiInput}
              maxLength={100}
              placeholder="Ví dụ: cty@gmail.com"
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
                : NhaCungCapCanSua
                  ? "Cập nhật"
                  : "Thêm nhà cung cấp"}
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

export default NhaCungCapFormModal;