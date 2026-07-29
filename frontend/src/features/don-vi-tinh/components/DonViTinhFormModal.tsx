import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";

import { capNhatDonViTinh, themDonViTinh } from "../api/donViTinhApi";
import type { DonViTinh, DonViTinhRequest } from "../types/DonViTinh";

type DonViTinhFormModalProps = {
  isOpen: boolean;
  donViTinhCanSua: DonViTinh | null;
  onClose: () => void;
  onSuccess: () => void;
};

type DonViTinhFormContentProps = {
  donViTinhCanSua: DonViTinh | null;
  onClose: () => void;
  onSuccess: () => void;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string>;
};

function DonViTinhFormContent({
  donViTinhCanSua,
  onClose,
  onSuccess,
}: DonViTinhFormContentProps) {
  const [tenDonViTinh, setTenDonViTinh] = useState(
    donViTinhCanSua?.tenDonViTinh ?? ""
  );
  const [kyHieu, setKyHieu] = useState(donViTinhCanSua?.kyHieu ?? "");
  const [moTa, setMoTa] = useState(donViTinhCanSua?.moTa ?? "");
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  const dangCapNhat = donViTinhCanSua !== null;

  const xuLyDongForm = () => {
    if (dangLuu) {
      return;
    }

    onClose();
  };

  const layThongBaoLoi = (error: unknown) => {
    if (!isAxiosError<ApiErrorResponse>(error)) {
      return "Không thể lưu đơn vị tính.";
    }

    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.errors) {
      const danhSachLoi = Object.values(responseData.errors);

      if (danhSachLoi.length > 0) {
        return danhSachLoi[0];
      }
    }

    return "Không thể lưu đơn vị tính.";
  };

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tenDaChuanHoa = tenDonViTinh.trim();
    const kyHieuDaChuanHoa = kyHieu.trim();
    const moTaDaChuanHoa = moTa.trim();

    if (!tenDaChuanHoa) {
      setLoi("Tên đơn vị tính không được để trống.");
      return;
    }

    const request: DonViTinhRequest = {
      tenDonViTinh: tenDaChuanHoa,
      kyHieu: kyHieuDaChuanHoa || null,
      moTa: moTaDaChuanHoa || null,
    };

    try {
      setDangLuu(true);
      setLoi(null);

      if (donViTinhCanSua) {
        await capNhatDonViTinh(donViTinhCanSua.maDonViTinh, request);
      } else {
        await themDonViTinh(request);
      }

      onSuccess();
    } catch (error) {
      console.error("Không thể lưu đơn vị tính:", error);
      setLoi(layThongBaoLoi(error));
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={xuLyDongForm}>
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{dangCapNhat ? "Cập nhật đơn vị tính" : "Thêm đơn vị tính"}</h2>
            <p>Nhập tên, ký hiệu và mô tả của đơn vị tính.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={xuLyDongForm}
            disabled={dangLuu}
            aria-label="Đóng"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={xuLySubmit}>
          <div className="modal-body">
            {loi && <div className="error-message">{loi}</div>}

            <div className="form-group">
              <label htmlFor="tenDonViTinh">
                Tên đơn vị tính <span aria-hidden="true">*</span>
              </label>

              <input
                id="tenDonViTinh"
                type="text"
                value={tenDonViTinh}
                onChange={(event) => setTenDonViTinh(event.target.value)}
                maxLength={50}
                placeholder="Ví dụ: Hộp"
                disabled={dangLuu}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="kyHieu">Ký hiệu</label>

              <input
                id="kyHieu"
                type="text"
                value={kyHieu}
                onChange={(event) => setKyHieu(event.target.value)}
                maxLength={20}
                placeholder="Ví dụ: hộp"
                disabled={dangLuu}
              />
            </div>

            <div className="form-group">
              <label htmlFor="moTa">Mô tả</label>

              <textarea
                id="moTa"
                value={moTa}
                onChange={(event) => setMoTa(event.target.value)}
                maxLength={255}
                rows={4}
                placeholder="Nhập mô tả đơn vị tính"
                disabled={dangLuu}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={xuLyDongForm}
              disabled={dangLuu}
            >
              Hủy
            </button>

            <button type="submit" className="primary-button" disabled={dangLuu}>
              {dangLuu
                ? "Đang lưu..."
                : dangCapNhat
                  ? "Lưu thay đổi"
                  : "Thêm đơn vị tính"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DonViTinhFormModal({
  isOpen,
  donViTinhCanSua,
  onClose,
  onSuccess,
}: DonViTinhFormModalProps) {
  if (!isOpen) {
    return null;
  }

  const formKey = donViTinhCanSua
    ? `sua-${donViTinhCanSua.maDonViTinh}`
    : "them-don-vi-tinh";

  return (
    <DonViTinhFormContent
      key={formKey}
      donViTinhCanSua={donViTinhCanSua}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

export default DonViTinhFormModal;