import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { capNhatQuyDoiDonVi, themQuyDoiDonVi } from "../api/sanPhamApi";

import type { DonViSanPham, QuyDoiDonVi } from "../types/SanPham";

type QuyDoiDonViForm = {
  maDonViNguon: string;
  soLuongNguon: string;
  maDonViDich: string;
  soLuongDich: string;
};

type QuyDoiDonViFormModalProps = {
  isOpen: boolean;
  maSanPham: number;
  danhSachDonViSanPham: DonViSanPham[];
  quyDoiCanSua: QuyDoiDonVi | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

const taoDuLieuFormQuyDoi = (
  quyDoiCanSua: QuyDoiDonVi | null,
): QuyDoiDonViForm => {
  if (quyDoiCanSua) {
    return {
      maDonViNguon: String(quyDoiCanSua.maDonViNguon),
      soLuongNguon: String(quyDoiCanSua.soLuongNguon),
      maDonViDich: String(quyDoiCanSua.maDonViDich),
      soLuongDich: String(quyDoiCanSua.soLuongDich),
    };
  }

  return {
    maDonViNguon: "",
    soLuongNguon: "1",
    maDonViDich: "",
    soLuongDich: "",
  };
};

function QuyDoiDonViFormModal(props: QuyDoiDonViFormModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <QuyDoiDonViFormNoiDung
      key={props.quyDoiCanSua?.maQuyDoi ?? "them-moi"}
      {...props}
    />
  );
}

function QuyDoiDonViFormNoiDung({
  maSanPham,
  danhSachDonViSanPham,
  quyDoiCanSua,
  onClose,
  onSuccess,
}: QuyDoiDonViFormModalProps) {
  const [formData, setFormData] = useState<QuyDoiDonViForm>(() =>
    taoDuLieuFormQuyDoi(quyDoiCanSua),
  );

  const [dangLuu, setDangLuu] = useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.maDonViNguon) {
      alert("Vui lòng chọn đơn vị nguồn");
      return;
    }

    if (!formData.maDonViDich) {
      alert("Vui lòng chọn đơn vị đích");
      return;
    }

    if (formData.maDonViNguon === formData.maDonViDich) {
      alert("Đơn vị nguồn và đơn vị đích không được giống nhau");
      return;
    }

    if (!formData.soLuongNguon || Number(formData.soLuongNguon) <= 0) {
      alert("Số lượng nguồn phải lớn hơn 0");
      return;
    }

    if (!formData.soLuongDich || Number(formData.soLuongDich) <= 0) {
      alert("Số lượng đích phải lớn hơn 0");
      return;
    }

    const duLieuGuiLen = {
      maSanPham,
      maDonViNguon: Number(formData.maDonViNguon),
      soLuongNguon: Number(formData.soLuongNguon),
      maDonViDich: Number(formData.maDonViDich),
      soLuongDich: Number(formData.soLuongDich),
    };

    try {
      setDangLuu(true);

      if (quyDoiCanSua) {
        await capNhatQuyDoiDonVi(quyDoiCanSua.maQuyDoi, duLieuGuiLen);
      } else {
        await themQuyDoiDonVi(duLieuGuiLen);
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu quy đổi đơn vị:", error);

      alert(
        "Lưu quy đổi đơn vị thất bại. Có thể quy đổi này đã tồn tại hoặc đơn vị không thuộc sản phẩm đang chọn.",
      );
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card conversion-form-modal">
        <div className="modal-header">
          <div>
            <h2>
              {quyDoiCanSua ? "Cập nhật quy đổi đơn vị" : "Thêm quy đổi đơn vị"}
            </h2>

            <p>Cấu hình quy đổi giữa các đơn vị của cùng một sản phẩm.</p>
          </div>

          <button
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={xuLySubmit}>
          <div className="form-group">
            <label>Đơn vị nguồn</label>

            <select
              name="maDonViNguon"
              value={formData.maDonViNguon}
              onChange={xuLyThayDoiInput}
              required
            >
              <option value="">-- Chọn đơn vị nguồn --</option>

              {danhSachDonViSanPham
                .filter((donVi) => donVi.trangThai)
                .map((donVi) => (
                  <option
                    key={donVi.maDonViSanPham}
                    value={donVi.maDonViSanPham}
                  >
                    {donVi.tenDonViTinh} ({donVi.kyHieu}) - mã{" "}
                    {donVi.maDonViSanPham}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Số lượng nguồn</label>

            <input
              type="number"
              name="soLuongNguon"
              value={formData.soLuongNguon}
              onChange={xuLyThayDoiInput}
              placeholder="Ví dụ: 1"
              min={0.001}
              step={0.001}
              required
            />
          </div>

          <div className="form-group">
            <label>Đơn vị đích</label>

            <select
              name="maDonViDich"
              value={formData.maDonViDich}
              onChange={xuLyThayDoiInput}
              required
            >
              <option value="">-- Chọn đơn vị đích --</option>

              {danhSachDonViSanPham
                .filter((donVi) => donVi.trangThai)
                .map((donVi) => (
                  <option
                    key={donVi.maDonViSanPham}
                    value={donVi.maDonViSanPham}
                  >
                    {donVi.tenDonViTinh} ({donVi.kyHieu}) - mã{" "}
                    {donVi.maDonViSanPham}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Số lượng đích</label>

            <input
              type="number"
              name="soLuongDich"
              value={formData.soLuongDich}
              onChange={xuLyThayDoiInput}
              placeholder="Ví dụ: 84"
              min={0.001}
              step={0.001}
              required
            />
          </div>

          <div className="conversion-preview">
            <strong>Diễn giải:</strong> {formData.soLuongNguon || "..."} đơn vị
            nguồn = {formData.soLuongDich || "..."} đơn vị đích
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={dangLuu}>
              {dangLuu
                ? "Đang lưu..."
                : quyDoiCanSua
                  ? "Cập nhật"
                  : "Lưu quy đổi"}
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

export default QuyDoiDonViFormModal;
