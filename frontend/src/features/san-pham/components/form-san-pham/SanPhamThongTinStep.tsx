import type {
  ChangeEvent,
  FormEventHandler,
} from "react";
import type {
  DanhMucSanPhamOption,
  NhaSanXuatOption,
} from "../../types/SanPham";

export type SanPhamThongTinFormData = {
  maDanhMuc: string;
  maNhaSanXuat: string;
  tenSanPham: string;
  hinhAnh: string;
  moTaNgan: string;
  giaBan: string;
  laThuocKeDon: boolean;
};

type SanPhamThongTinStepProps = {
  formData: SanPhamThongTinFormData;
  danhSachDanhMuc: DanhMucSanPhamOption[];
  danhSachNhaSanXuat: NhaSanXuatOption[];

  laThemMoi: boolean;
  dangLuu: boolean;

  onSubmit: FormEventHandler<HTMLFormElement>;
  onInputChange: (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => void;
  onCheckboxChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onClose: () => void;
};

function SanPhamThongTinStep({
  formData,
  danhSachDanhMuc,
  danhSachNhaSanXuat,
  laThemMoi,
  dangLuu,
  onSubmit,
  onInputChange,
  onCheckboxChange,
  onClose,
}: SanPhamThongTinStepProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="product-form-grid">
        <div className="form-group">
          <label>Danh mục sản phẩm</label>

          <select
            name="maDanhMuc"
            value={formData.maDanhMuc}
            onChange={onInputChange}
            required
          >
            <option value="">
              -- Chọn danh mục --
            </option>

            {danhSachDanhMuc
              .filter(
                (danhMuc) =>
                  danhMuc.trangThaiHienThi
              )
              .map((danhMuc) => (
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
          <label>Nhà sản xuất</label>

          <select
            name="maNhaSanXuat"
            value={formData.maNhaSanXuat}
            onChange={onInputChange}
          >
            <option value="">
              -- Chưa chọn nhà sản xuất --
            </option>

            {danhSachNhaSanXuat
              .filter(
                (nhaSanXuat) =>
                  nhaSanXuat.trangThai
              )
              .map((nhaSanXuat) => (
                <option
                  key={nhaSanXuat.maNhaSanXuat}
                  value={nhaSanXuat.maNhaSanXuat}
                >
                  {nhaSanXuat.tenNhaSanXuat}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group product-form-full-row">
          <label>Tên sản phẩm</label>

          <input
            type="text"
            name="tenSanPham"
            value={formData.tenSanPham}
            onChange={onInputChange}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div className="form-group">
          <label>Giá bán mặc định</label>

          <input
            type="number"
            name="giaBan"
            value={formData.giaBan}
            onChange={onInputChange}
            placeholder="Nhập giá bán"
            min={1}
            required
          />
        </div>

        <div className="form-group">
          <label>Đường dẫn hình ảnh</label>

          <input
            type="text"
            name="hinhAnh"
            value={formData.hinhAnh}
            onChange={onInputChange}
            placeholder="/images/products/san-pham.webp"
          />
        </div>

        <div className="form-group product-form-full-row">
          <label>Mô tả ngắn</label>

          <textarea
            name="moTaNgan"
            value={formData.moTaNgan}
            onChange={onInputChange}
            placeholder="Nhập mô tả ngắn"
            rows={3}
          />
        </div>

        <label className="product-inline-checkbox">
          <input
            type="checkbox"
            name="laThuocKeDon"
            checked={formData.laThuocKeDon}
            onChange={onCheckboxChange}
          />
          Là thuốc kê đơn
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
          disabled={dangLuu}
        >
          <i className="bi bi-x-circle" />
          Hủy
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={dangLuu}
        >
          {laThemMoi ? (
            <>
              Tiếp tục
              <i className="bi bi-arrow-right" />
            </>
          ) : (
            <>
              <i className="bi bi-check-circle" />
              {dangLuu
                ? "Đang lưu..."
                : "Cập nhật"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SanPhamThongTinStep;