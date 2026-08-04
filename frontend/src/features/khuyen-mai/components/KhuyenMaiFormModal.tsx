import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";

import { themKhuyenMai, capNhatKhuyenMai } from "../api/khuyenMaiApi";
import type { KhuyenMai, KhuyenMaiRequest, KieuGiamGia } from "../types/KhuyenMai";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";

type KhuyenMaiFormData = {
  tenChuongTrinh: string;
  loaiKhuyenMai: string;
  kieuGiamGia: KieuGiamGia;
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

const LOAI_KHUYEN_MAI_SAN_PHAM = "SAN_PHAM";

const taoDuLieuForm = (khuyenMaiCanSua: KhuyenMai | null): KhuyenMaiFormData => {
  if (khuyenMaiCanSua) {
    return {
      tenChuongTrinh: khuyenMaiCanSua.tenChuongTrinh,
      loaiKhuyenMai: khuyenMaiCanSua.loaiKhuyenMai,
      kieuGiamGia: khuyenMaiCanSua.kieuGiamGia,
      giaTriGiam: String(khuyenMaiCanSua.giaTriGiam),
      thoiGianBatDau: khuyenMaiCanSua.thoiGianBatDau.slice(0, 16),
      thoiGianKetThuc: khuyenMaiCanSua.thoiGianKetThuc.slice(0, 16),
    };
  }

  return {
    tenChuongTrinh: "",
    loaiKhuyenMai: LOAI_KHUYEN_MAI_SAN_PHAM,
    kieuGiamGia: "PHAN_TRAM",
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
  const { nguoiDungDangNhap } = useXacThucContext();

  const [formData, setFormData] = useState<KhuyenMaiFormData>(() =>
    taoDuLieuForm(khuyenMaiCanSua),
  );

  const [dangLuu, setDangLuu] = useState(false);

  const xuLyThayDoiInput = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const xuLySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tenChuongTrinh = formData.tenChuongTrinh.trim();
    const giaTriGiam = Number(formData.giaTriGiam);

    if (!tenChuongTrinh) {
      alert("Tên chương trình không được để trống");
      return;
    }

    if (!nguoiDungDangNhap?.maNhanVien) {
      alert("Không xác định được nhân viên đang đăng nhập");
      return;
    }

    if (!formData.giaTriGiam || Number.isNaN(giaTriGiam) || giaTriGiam <= 0) {
      alert("Giá trị giảm phải lớn hơn 0");
      return;
    }

    if (formData.kieuGiamGia === "PHAN_TRAM" && giaTriGiam > 100) {
      alert("Phần trăm giảm không được vượt quá 100");
      return;
    }

    if (!formData.thoiGianBatDau || !formData.thoiGianKetThuc) {
      alert("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc");
      return;
    }

    if (
      new Date(formData.thoiGianKetThuc).getTime() <=
      new Date(formData.thoiGianBatDau).getTime()
    ) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const request: KhuyenMaiRequest = {
      maNhanVienTao: nguoiDungDangNhap.maNhanVien,
      tenChuongTrinh,
      loaiKhuyenMai: formData.loaiKhuyenMai,
      kieuGiamGia: formData.kieuGiamGia,
      giaTriGiam,
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
      console.error("Không thể lưu khuyến mãi:", error);

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(message ?? "Không thể lưu khuyến mãi.");
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
              Khai báo tên chương trình, kiểu giảm giá và thời gian áp dụng
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
                maxLength={200}
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
                <option value={LOAI_KHUYEN_MAI_SAN_PHAM}>
                  Khuyến mãi sản phẩm
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="kieuGiamGia">Kiểu giảm giá</label>

              <select
                id="kieuGiamGia"
                name="kieuGiamGia"
                value={formData.kieuGiamGia}
                onChange={xuLyThayDoiInput}
                required
              >
                <option value="PHAN_TRAM">Giảm theo phần trăm</option>
                <option value="SO_TIEN">Giảm theo số tiền</option>
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
                max={formData.kieuGiamGia === "PHAN_TRAM" ? "100" : undefined}
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