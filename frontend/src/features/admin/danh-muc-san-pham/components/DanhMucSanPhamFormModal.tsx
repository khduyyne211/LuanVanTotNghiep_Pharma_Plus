import { useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { isAxiosError } from "axios";

import {
  capNhatDanhMucSanPham,
  themDanhMucSanPham,
} from "../api/danhMucSanPhamApi";
import type {
  DanhMucSanPham,
  DanhMucSanPhamRequest,
} from "../types/DanhMucSanPham";

type DanhMucSanPhamFormData = {
  maDanhMucCha: string;
  tenDanhMuc: string;
  moTa: string;
  thuTuHienThi: string;
};

type DanhMucSanPhamFormModalProps = {
  isOpen: boolean;
  danhMucCanSua: DanhMucSanPham | null;
  danhSachDanhMuc: DanhMucSanPham[];
  onClose: () => void;
  onSuccess: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  danhMucCanSua: DanhMucSanPham | null
): DanhMucSanPhamFormData => {
  if (danhMucCanSua) {
    return {
      maDanhMucCha:
        danhMucCanSua.maDanhMucCha !== null
          ? String(danhMucCanSua.maDanhMucCha)
          : "",
      tenDanhMuc: danhMucCanSua.tenDanhMuc,
      moTa: danhMucCanSua.moTa ?? "",
      thuTuHienThi:
        danhMucCanSua.thuTuHienThi !== null
          ? String(danhMucCanSua.thuTuHienThi)
          : "",
    };
  }

  return {
    maDanhMucCha: "",
    tenDanhMuc: "",
    moTa: "",
    thuTuHienThi: "",
  };
};

function DanhMucSanPhamFormModal(
  props: DanhMucSanPhamFormModalProps
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <DanhMucSanPhamFormNoiDung
      key={props.danhMucCanSua?.maDanhMuc ?? "them-moi"}
      {...props}
    />
  );
}

function DanhMucSanPhamFormNoiDung({
  danhMucCanSua,
  danhSachDanhMuc,
  onClose,
  onSuccess,
}: DanhMucSanPhamFormModalProps) {
  const [formData, setFormData] =
    useState<DanhMucSanPhamFormData>(
      () => taoDuLieuForm(danhMucCanSua)
    );
  const [dangLuu, setDangLuu] = useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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

    const tenDanhMuc = formData.tenDanhMuc.trim();

    if (!tenDanhMuc) {
      alert("Tên danh mục sản phẩm không được để trống");
      return;
    }

    const request: DanhMucSanPhamRequest = {
      maDanhMucCha: formData.maDanhMucCha
        ? Number(formData.maDanhMucCha)
        : null,
      tenDanhMuc,
      moTa: formData.moTa.trim() || null,
      thuTuHienThi: formData.thuTuHienThi
        ? Number(formData.thuTuHienThi)
        : null,
    };

    try {
      setDangLuu(true);

      if (danhMucCanSua) {
        await capNhatDanhMucSanPham(
          danhMucCanSua.maDanhMuc,
          request
        );
      } else {
        await themDanhMucSanPham(request);
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Không thể lưu danh mục sản phẩm:",
        error
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(
        message ??
          "Không thể lưu danh mục sản phẩm."
      );
    } finally {
      setDangLuu(false);
    }
  };

  const danhSachDanhMucCha =
    danhSachDanhMuc.filter(
      (danhMuc) =>
        danhMuc.maDanhMuc !==
        danhMucCanSua?.maDanhMuc
    );

  return (
    <div className="modal-overlay">
      <div className="modal-card unit-form-modal">
        <div className="modal-header">
          <div>
            <h2>
              {danhMucCanSua
                ? "Cập nhật danh mục sản phẩm"
                : "Thêm danh mục sản phẩm"}
            </h2>

            <p>
              Quản trị viên khai báo tên, danh mục cha,
              mô tả và thứ tự hiển thị.
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
            <label htmlFor="tenDanhMuc">
              Tên danh mục
            </label>

            <input
              id="tenDanhMuc"
              type="text"
              name="tenDanhMuc"
              value={formData.tenDanhMuc}
              onChange={xuLyThayDoiInput}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maDanhMucCha">
              Danh mục cha
            </label>

            <select
              id="maDanhMucCha"
              name="maDanhMucCha"
              value={formData.maDanhMucCha}
              onChange={xuLyThayDoiInput}
            >
              <option value="">
                Tạo danh mục cha
              </option>

              {danhSachDanhMucCha.map((danhMuc) => (
                <option
                  key={danhMuc.maDanhMuc}
                  value={danhMuc.maDanhMuc}
                >
                  {danhMuc.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="moTa">Mô tả</label>

            <textarea
              id="moTa"
              name="moTa"
              value={formData.moTa}
              onChange={xuLyThayDoiInput}
              maxLength={255}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thuTuHienThi">
              Thứ tự hiển thị
            </label>

            <input
              id="thuTuHienThi"
              type="number"
              name="thuTuHienThi"
              value={formData.thuTuHienThi}
              onChange={xuLyThayDoiInput}
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
                : danhMucCanSua
                  ? "Cập nhật"
                  : "Thêm danh mục"}
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

export default DanhMucSanPhamFormModal;