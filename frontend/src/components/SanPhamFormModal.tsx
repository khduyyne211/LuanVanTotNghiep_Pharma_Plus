import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axiosClient from "../api/axiosClient";
import type { SanPham } from "../types/SanPham";

type DanhMucSanPham = {
  maDanhMuc: number;
  tenDanhMuc: string;
  trangThaiHienThi: boolean;
};

type NhaSanXuat = {
  maNhaSanXuat: number;
  tenNhaSanXuat: string;
  trangThai: boolean;
};

type SanPhamForm = {
  maDanhMuc: string;
  maNhaSanXuat: string;
  tenSanPham: string;
  hinhAnh: string;
  moTaNgan: string;
  giaBan: string;
  laThuocKeDon: boolean;
};

type SanPhamFormModalProps = {
  isOpen: boolean;
  sanPhamCanSua: SanPham | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

function SanPhamFormModal({
  isOpen,
  sanPhamCanSua,
  onClose,
  onSuccess,
}: SanPhamFormModalProps) {
  const [formData, setFormData] = useState<SanPhamForm>({
    maDanhMuc: "",
    maNhaSanXuat: "",
    tenSanPham: "",
    hinhAnh: "",
    moTaNgan: "",
    giaBan: "",
    laThuocKeDon: false,
  });

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMucSanPham[]>([]);
  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<NhaSanXuat[]>(
    []
  );
  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    if (isOpen) {
      layDuLieuDropdown();
    }
  }, [isOpen]);

  useEffect(() => {
    if (sanPhamCanSua) {
      setFormData({
        maDanhMuc: String(sanPhamCanSua.maDanhMuc),
        maNhaSanXuat:
          sanPhamCanSua.maNhaSanXuat !== null
            ? String(sanPhamCanSua.maNhaSanXuat)
            : "",
        tenSanPham: sanPhamCanSua.tenSanPham,
        hinhAnh: sanPhamCanSua.hinhAnh || "",
        moTaNgan: sanPhamCanSua.moTaNgan || "",
        giaBan: String(sanPhamCanSua.giaBan),
        laThuocKeDon: sanPhamCanSua.laThuocKeDon,
      });
    } else {
      setFormData({
        maDanhMuc: "",
        maNhaSanXuat: "",
        tenSanPham: "",
        hinhAnh: "",
        moTaNgan: "",
        giaBan: "",
        laThuocKeDon: false,
      });
    }
  }, [sanPhamCanSua, isOpen]);

  const layDuLieuDropdown = async () => {
    try {
      const [danhMucResponse, nhaSanXuatResponse] = await Promise.all([
        axiosClient.get<DanhMucSanPham[]>("/danh-muc-san-pham"),
        axiosClient.get<NhaSanXuat[]>("/nha-san-xuat"),
      ]);

      setDanhSachDanhMuc(danhMucResponse.data);
      setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục hoặc nhà sản xuất:", error);
      alert("Không thể tải dữ liệu danh mục hoặc nhà sản xuất");
    }
  };

  if (!isOpen) {
    return null;
  }

  const xuLyThayDoiInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    if (!formData.maDanhMuc) {
      alert("Vui lòng chọn danh mục sản phẩm");
      return;
    }

    if (!formData.tenSanPham.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!formData.giaBan || Number(formData.giaBan) < 0) {
      alert("Vui lòng nhập giá bán hợp lệ");
      return;
    }

    const duLieuGuiLen = {
      maDanhMuc: Number(formData.maDanhMuc),
      maNhaSanXuat: formData.maNhaSanXuat
        ? Number(formData.maNhaSanXuat)
        : null,
      tenSanPham: formData.tenSanPham.trim(),
      hinhAnh: formData.hinhAnh.trim() || null,
      giaBan: Number(formData.giaBan),
      laThuocKeDon: formData.laThuocKeDon,
      moTaNgan: formData.moTaNgan.trim() || null,
    };

    try {
      setDangLuu(true);

      if (sanPhamCanSua) {
        await axiosClient.put(
          `/san-pham/${sanPhamCanSua.maSanPham}`,
          duLieuGuiLen
        );
      } else {
        await axiosClient.post("/san-pham", duLieuGuiLen);
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Lưu sản phẩm thất bại. Kiểm tra lại dữ liệu nhập.");
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card product-form-modal">
        <div className="modal-header">
          <div>
            <h2>{sanPhamCanSua ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <p>
              {sanPhamCanSua
                ? "Dược sĩ cập nhật thông tin cơ bản của sản phẩm."
                : "Dược sĩ thêm sản phẩm mới vào hệ thống."}
            </p>
          </div>

          <button className="modal-close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={xuLySubmit}>
          <div className="form-group">
            <label>Danh mục sản phẩm</label>
            <select
              name="maDanhMuc"
              value={formData.maDanhMuc}
              onChange={xuLyThayDoiInput}
              required
            >
              <option value="">-- Chọn danh mục --</option>

              {danhSachDanhMuc
                .filter((dm) => dm.trangThaiHienThi)
                .map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nhà sản xuất</label>
            <select
              name="maNhaSanXuat"
              value={formData.maNhaSanXuat}
              onChange={xuLyThayDoiInput}
            >
              <option value="">-- Chưa chọn nhà sản xuất --</option>

              {danhSachNhaSanXuat
                .filter((nsx) => nsx.trangThai)
                .map((nsx) => (
                  <option key={nsx.maNhaSanXuat} value={nsx.maNhaSanXuat}>
                    {nsx.tenNhaSanXuat}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              name="tenSanPham"
              value={formData.tenSanPham}
              onChange={xuLyThayDoiInput}
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <input
              type="text"
              name="hinhAnh"
              value={formData.hinhAnh}
              onChange={xuLyThayDoiInput}
              placeholder="Ví dụ: /images/products/pregnacare.webp"
            />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea
              name="moTaNgan"
              value={formData.moTaNgan}
              onChange={xuLyThayDoiInput}
              placeholder="Nhập mô tả ngắn của sản phẩm"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Giá bán mặc định</label>
            <input
              type="number"
              name="giaBan"
              value={formData.giaBan}
              onChange={xuLyThayDoiInput}
              placeholder="Nhập giá bán"
              min={0}
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="laThuocKeDon"
              checked={formData.laThuocKeDon}
              onChange={xuLyThayDoiCheckbox}
            />
            <label>Là thuốc kê đơn</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={dangLuu}>
              {dangLuu
                ? "Đang lưu..."
                : sanPhamCanSua
                ? "Cập nhật"
                : "Lưu sản phẩm"}
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

export default SanPhamFormModal;