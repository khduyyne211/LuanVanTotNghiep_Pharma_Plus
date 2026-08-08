import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axiosClient from "../../../../api/axiosClient";
import type { DonViSanPham } from "../types/SanPham";

type DonViTinh = {
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;
  trangThai: boolean;
};

type DonViSanPhamForm = {
  maDonViTinh: string;
  giaBanTheoDonVi: string;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
};

type DonViSanPhamFormModalProps = {
  isOpen: boolean;
  maSanPham: number;
  donViCanSua: DonViSanPham | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

const taoDuLieuFormDonVi = (
  donViCanSua: DonViSanPham | null,
): DonViSanPhamForm => {
  if (donViCanSua) {
    return {
      maDonViTinh: String(donViCanSua.maDonViTinh),
      giaBanTheoDonVi:
        donViCanSua.giaBanTheoDonVi !== null
          ? String(donViCanSua.giaBanTheoDonVi)
          : "",
      laDonViCoSo: donViCanSua.laDonViCoSo,
      choPhepBan: donViCanSua.choPhepBan,
      choPhepNhap: donViCanSua.choPhepNhap,
    };
  }

  return {
    maDonViTinh: "",
    giaBanTheoDonVi: "",
    laDonViCoSo: false,
    choPhepBan: true,
    choPhepNhap: true,
  };
};

function DonViSanPhamFormModal(props: DonViSanPhamFormModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <DonViSanPhamFormNoiDung
      key={props.donViCanSua?.maDonViSanPham ?? "them-moi"}
      {...props}
    />
  );
}

function DonViSanPhamFormNoiDung({
  maSanPham,
  donViCanSua,
  onClose,
  onSuccess,
}: DonViSanPhamFormModalProps) {
  const [formData, setFormData] = useState<DonViSanPhamForm>(() =>
    taoDuLieuFormDonVi(donViCanSua),
  );

  const [danhSachDonViTinh, setDanhSachDonViTinh] = useState<DonViTinh[]>([]);
  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    let daHuy = false;

    const layDanhSachDonViTinh = async () => {
      try {
        const response = await axiosClient.get<DonViTinh[]>("/don-vi-tinh");

        if (daHuy) {
          return;
        }

        setDanhSachDonViTinh(response.data);
      } catch (error) {
        if (daHuy) {
          return;
        }

        console.error("Lỗi khi lấy danh sách đơn vị tính:", error);
        alert("Không thể tải danh sách đơn vị tính");
      }
    };

    void layDanhSachDonViTinh();

    return () => {
      daHuy = true;
    };
  }, []);

  const xuLyThayDoiInput = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const xuLyThayDoiCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.maDonViTinh) {
      alert("Vui lòng chọn đơn vị tính");
      return;
    }

    if (formData.giaBanTheoDonVi && Number(formData.giaBanTheoDonVi) < 0) {
      alert("Giá bán theo đơn vị không được nhỏ hơn 0");
      return;
    }

    const duLieuGuiLen = {
      maSanPham: maSanPham,
      maDonViTinh: Number(formData.maDonViTinh),
      giaBanTheoDonVi: formData.giaBanTheoDonVi
        ? Number(formData.giaBanTheoDonVi)
        : null,
      laDonViCoSo: formData.laDonViCoSo,
      choPhepBan: formData.choPhepBan,
      choPhepNhap: formData.choPhepNhap,
    };

    try {
      setDangLuu(true);

      if (donViCanSua) {
        await axiosClient.put(
          `/don-vi-san-pham/${donViCanSua.maDonViSanPham}`,
          duLieuGuiLen,
        );
      } else {
        await axiosClient.post("/don-vi-san-pham", duLieuGuiLen);
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu đơn vị sản phẩm:", error);
      alert(
        "Lưu đơn vị sản phẩm thất bại. Có thể sản phẩm đã có đơn vị này hoặc đã có đơn vị cơ sở.",
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
              {donViCanSua
                ? "Cập nhật đơn vị sản phẩm"
                : "Thêm đơn vị sản phẩm"}
            </h2>

            <p>
              Cấu hình đơn vị bán, đơn vị nhập và đơn vị cơ sở cho sản phẩm.
            </p>
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
            <label>Đơn vị tính</label>

            <select
              name="maDonViTinh"
              value={formData.maDonViTinh}
              onChange={xuLyThayDoiInput}
              required
            >
              <option value="">-- Chọn đơn vị tính --</option>

              {danhSachDonViTinh
                .filter((dv) => dv.trangThai)
                .map((dv) => (
                  <option key={dv.maDonViTinh} value={dv.maDonViTinh}>
                    {dv.tenDonViTinh}
                    {dv.kyHieu ? ` (${dv.kyHieu})` : ""}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Giá bán theo đơn vị</label>

            <input
              type="number"
              name="giaBanTheoDonVi"
              value={formData.giaBanTheoDonVi}
              onChange={xuLyThayDoiInput}
              placeholder="Có thể để trống nếu đơn vị này không bán trực tiếp"
              min={0}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="laDonViCoSo"
              checked={formData.laDonViCoSo}
              onChange={xuLyThayDoiCheckbox}
            />

            <label>Là đơn vị cơ sở</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="choPhepBan"
              checked={formData.choPhepBan}
              onChange={xuLyThayDoiCheckbox}
            />

            <label>Cho phép bán theo đơn vị này</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="choPhepNhap"
              checked={formData.choPhepNhap}
              onChange={xuLyThayDoiCheckbox}
            />

            <label>Cho phép nhập kho theo đơn vị này</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={dangLuu}>
              {dangLuu
                ? "Đang lưu..."
                : donViCanSua
                  ? "Cập nhật"
                  : "Lưu đơn vị"}
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

export default DonViSanPhamFormModal;
