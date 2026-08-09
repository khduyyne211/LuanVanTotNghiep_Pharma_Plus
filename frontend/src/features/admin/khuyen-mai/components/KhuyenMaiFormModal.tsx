import { useState } from "react";
import type {  FormEvent } from "react";
import { isAxiosError } from "axios";

import { themKhuyenMai, capNhatKhuyenMai } from "../api/khuyenMaiApi";
import type { KhuyenMai, KhuyenMaiRequest } from "../types/KhuyenMai";

type KhuyenMaiFormData = {
  tenChuongTrinh: string;
  loaiKhuyenMai: "PHAN_TRAM" | "SO_TIEN";
  giamGia: string;
  giaTriGiam: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
};

type KhuyenMaiFormModalProps = {
  isOpen: boolean;
  khuyenMaiCanSua: KhuyenMai | null;
  onClose: () => void;
  onSuccess: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

const taoDuLieuForm = (
  khuyenMaiCanSua: KhuyenMai | null,
): KhuyenMaiFormData => {
  if (khuyenMaiCanSua) {
    return {
      tenChuongTrinh: khuyenMaiCanSua.tenChuongTrinh,
      loaiKhuyenMai: khuyenMaiCanSua.loaiKhuyenMai,
      giamGia:
        khuyenMaiCanSua.giamGia !== null ? String(khuyenMaiCanSua.giamGia) : "",
      giaTriGiam:
        khuyenMaiCanSua.giaTriGiam !== null
          ? String(khuyenMaiCanSua.giaTriGiam)
          : "",
      thoiGianBatDau: khuyenMaiCanSua.thoiGianBatDau.slice(0, 16),
      thoiGianKetThuc: khuyenMaiCanSua.thoiGianKetThuc.slice(0, 16),
    };
  }

  return {
    tenChuongTrinh: "",
    loaiKhuyenMai: "PHAN_TRAM",
    giamGia: "",
    giaTriGiam: "",
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
  };
};

function KhuyenMaiFormModal(props: KhuyenMaiFormModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <KhuyenMaiFormNoiDung
      key={props.khuyenMaiCanSua?.maKhuyenMai ?? "them-moi"}
      {...props}
    />
  );
}

function KhuyenMaiFormNoiDung({
  khuyenMaiCanSua,
  onClose,
  onSuccess,
}: KhuyenMaiFormModalProps) {
  const [formData, setFormData] = useState<KhuyenMaiFormData>(() =>
    taoDuLieuForm(khuyenMaiCanSua),
  );

  const [dangLuu, setDangLuu] = useState(false);

  const xuLyThayDoiInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((duLieuCu) => {
      if (name === "loaiKhuyenMai") {
        return {
          ...duLieuCu,
          loaiKhuyenMai: value as KhuyenMaiFormData["loaiKhuyenMai"],
          giamGia: "",
          giaTriGiam: "",
        };
      }

      return {
        ...duLieuCu,
        [name]: value,
      };
    });
  };

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tenChuongTrinh = formData.tenChuongTrinh.trim();

    if (!tenChuongTrinh) {
      alert("Tên chương trình không được để trống");
      return;
    }

    const request: KhuyenMaiRequest = {
      tenChuongTrinh,
      loaiKhuyenMai: formData.loaiKhuyenMai,
      giamGia:
        formData.loaiKhuyenMai === "PHAN_TRAM"
          ? Number(formData.giamGia)
          : null,
      giaTriGiam:
        formData.loaiKhuyenMai === "SO_TIEN"
          ? Number(formData.giaTriGiam)
          : null,
      thoiGianBatDau: formData.thoiGianBatDau,
      thoiGianKetThuc: formData.thoiGianKetThuc,
    };

    try {
      setDangLuu(true);

      if (khuyenMaiCanSua) {
        await capNhatKhuyenMai(khuyenMaiCanSua.maKhuyenMai, request);
      } else {
        await themKhuyenMai(request);
      }

      onSuccess();
    } catch (error) {
      console.error("Không thể lưu nhà sản xuất:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể lưu nhà sản xuất.");
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
              {khuyenMaiCanSua ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
            </h2>

            <p>
              Khai báo tên chương trình, loại giảm giá và thời gian áp dụng
              khuyến mãi.
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

        <form onSubmit={xuLySubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="tenChuongTrinh">Tên chương trình</label>

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
              <label htmlFor="loaiKhuyenMai">Loại khuyến mãi</label>

              <select
                id="loaiKhuyenMai"
                name="loaiKhuyenMai"
                value={formData.loaiKhuyenMai}
                onChange={xuLyThayDoiInput}
                required
              >
                <option value="PHAN_TRAM">Giảm theo phần trăm</option>

                <option value="SO_TIEN">Giảm theo số tiền</option>
              </select>
            </div>

            {formData.loaiKhuyenMai === "PHAN_TRAM" ? (
              <div className="form-group">
                <label htmlFor="giamGia">Phần trăm giảm</label>

                <input
                  id="giamGia"
                  type="number"
                  name="giamGia"
                  value={formData.giamGia}
                  onChange={xuLyThayDoiInput}
                  min="0.01"
                  max="100"
                  step="0.01"
                  placeholder="Ví dụ: 10"
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="giaTriGiam">Số tiền giảm</label>

                <input
                  id="giaTriGiam"
                  type="number"
                  name="giaTriGiam"
                  value={formData.giaTriGiam}
                  onChange={xuLyThayDoiInput}
                  min="0.01"
                  step="0.01"
                  placeholder="Ví dụ: 50000"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="thoiGianBatDau">Thời gian bắt đầu</label>

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
              <label htmlFor="thoiGianKetThuc">Thời gian kết thúc</label>

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

            <button type="submit" className="primary-button" disabled={dangLuu}>
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
