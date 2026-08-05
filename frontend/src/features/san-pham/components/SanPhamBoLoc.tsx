import type { KeyboardEvent } from "react";
import type {
  DanhMucSanPhamOption,
  NhaSanXuatOption,
} from "../types/SanPham";

type SanPhamBoLocProps = {
  keyWordInput: string;
  laThuocKeDonFilter: string;
  trangThaiSanPhamFilter: string;
  maDanhMucFilter: string;
  maNhaSanXuatFilter: string;

  dsDanhmuc: DanhMucSanPhamOption[];
  dsNSX: NhaSanXuatOption[];

  onKeywordInputChange: (giaTri: string) => void;
  onTimKiem: () => void;
  onXoaBoLoc: () => void;
  onLaThuocKeDonChange: (giaTri: string) => void;
  onTrangThaiSanPhamChange: (giaTri: string) => void;
  onMaDanhMucChange: (giaTri: string) => void;
  onMaNhaSanXuatChange: (giaTri: string) => void;
};

function SanPhamBoLoc({
  keyWordInput,
  laThuocKeDonFilter,
  trangThaiSanPhamFilter,
  maDanhMucFilter,
  maNhaSanXuatFilter,
  dsDanhmuc,
  dsNSX,
  onKeywordInputChange,
  onTimKiem,
  onXoaBoLoc,
  onLaThuocKeDonChange,
  onTrangThaiSanPhamChange,
  onMaDanhMucChange,
  onMaNhaSanXuatChange,
}: SanPhamBoLocProps) {
  const xuLyNhanEnter = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      onTimKiem();
    }
  };

  return (
    <div className="ql-filter-grid">
      <div className="ql-filter-search">
        <input
          type="text"
          className="ql-filter-control"
          value={keyWordInput}
          onChange={(event) =>
            onKeywordInputChange(event.target.value)
          }
          onKeyDown={xuLyNhanEnter}
          placeholder="Tìm theo tên sản phẩm..."
        />

        <button
          type="button"
          className="ql-button ql-button-primary"
          onClick={onTimKiem}
        >
          <i className="bi bi-search" />
          <span>Tìm</span>
        </button>
      </div>

      <select
        className="ql-filter-control"
        value={laThuocKeDonFilter}
        onChange={(event) =>
          onLaThuocKeDonChange(event.target.value)
        }
      >
        <option value="">Tất cả loại thuốc</option>
        <option value="true">Thuốc kê đơn</option>
        <option value="false">Không kê đơn</option>
      </select>

      <select
        className="ql-filter-control"
        value={trangThaiSanPhamFilter}
        onChange={(event) =>
          onTrangThaiSanPhamChange(event.target.value)
        }
      >
        <option value="">Tất cả trạng thái</option>
        <option value="true">Đang hiển thị</option>
        <option value="false">Đã ẩn</option>
      </select>

      <select
        className="ql-filter-control"
        value={maDanhMucFilter}
        onChange={(event) =>
          onMaDanhMucChange(event.target.value)
        }
      >
        <option value="">Tất cả danh mục</option>

        {dsDanhmuc
          .filter((danhMuc) => danhMuc.trangThaiHienThi)
          .map((danhMuc) => (
            <option
              key={danhMuc.maDanhMuc}
              value={danhMuc.maDanhMuc}
            >
              {danhMuc.tenDanhMuc}
            </option>
          ))}
      </select>

      <select
        className="ql-filter-control"
        value={maNhaSanXuatFilter}
        onChange={(event) =>
          onMaNhaSanXuatChange(event.target.value)
        }
      >
        <option value="">Tất cả nhà sản xuất</option>

        {dsNSX
          .filter((nhaSanXuat) => nhaSanXuat.trangThai)
          .map((nhaSanXuat) => (
            <option
              key={nhaSanXuat.maNhaSanXuat}
              value={nhaSanXuat.maNhaSanXuat}
            >
              {nhaSanXuat.tenNhaSanXuat}
            </option>
          ))}
      </select>

      <div className="ql-filter-actions">
        <button
          type="button"
          className="ql-button ql-button-ghost"
          onClick={onXoaBoLoc}
        >
          <i className="bi bi-arrow-counterclockwise" />
          <span>Xóa lọc</span>
        </button>
      </div>
    </div>
  );
}

export default SanPhamBoLoc;