import type { KeyboardEvent } from "react";
import type{
    DanhMucSanPhamOption,
    NhaSanXuatOption,
} from "../types/SanPham";

type SanPhamBoLocProps ={
    keyWordInput: string;
    laThuocKeDonFilter: string;
    trangThaiSanPhamFilter:string;
    maDanhMucFilter: string;
    maNhaSanXuatFilter:string;
    size:number;

    dsDanhmuc: DanhMucSanPhamOption[];
    dsNSX: NhaSanXuatOption[];

    onKeywordInputChange: (giatri:string) => void;
    onTimKiem: ()=>void;
    onXoaBoLoc: ()=>void;

    onLaThuocKeDonChange: (giaTri: string) => void;
    onTrangThaiSanPhamChange: (giaTri: string) => void;
    onMaDanhMucChange: (giaTri: string) => void;
    onMaNhaSanXuatChange: (giaTri: string) => void;
    onSizeChange: (giaTri: number) => void;
}
function SanPhamBoLoc({
    keyWordInput,
    laThuocKeDonFilter,
    trangThaiSanPhamFilter,
    maDanhMucFilter,
    maNhaSanXuatFilter,
    size,
    dsDanhmuc,
    dsNSX,
    onKeywordInputChange,
    onTimKiem,
    onXoaBoLoc,
    onLaThuocKeDonChange,
    onTrangThaiSanPhamChange,
    onMaDanhMucChange,
    onMaNhaSanXuatChange,
    onSizeChange,
}: SanPhamBoLocProps){
    const xuLyNhanEnter = (event: KeyboardEvent<HTMLInputElement>) =>{
        if(event.key === "Enter"){
            onTimKiem();
        }
    };
     return (
    <div className="table-card" style={{ marginBottom: "16px" }}>
      <div className="filter-row">
        <div className="filter-left">
          <input
            type="text"
            value={keyWordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            onKeyDown={xuLyNhanEnter}
            placeholder="Tìm theo tên sản phẩm..."
            className="search-input"
          />

          <button
            type="button"
            className="small-button"
            onClick={onTimKiem}
          >
            Tìm kiếm
          </button>

          <button
            type="button"
            className="small-button"
            onClick={onXoaBoLoc}
          >
            Xóa lọc
          </button>
        </div>

        <div className="filter-right">
          <span>Số dòng:</span>

          <select
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="page-size-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="advanced-filter-row">
        <select
          value={laThuocKeDonFilter}
          onChange={(event) =>
            onLaThuocKeDonChange(event.target.value)
          }
          className="filter-select"
        >
          <option value="">Tất cả loại thuốc</option>
          <option value="true">Thuốc kê đơn</option>
          <option value="false">Không kê đơn</option>
        </select>

        <select
          value={trangThaiSanPhamFilter}
          onChange={(event) =>
            onTrangThaiSanPhamChange(event.target.value)
          }
          className="filter-select"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang bán</option>
          <option value="false">Ngừng bán</option>
        </select>

        <select
          value={maDanhMucFilter}
          onChange={(event) => onMaDanhMucChange(event.target.value)}
          className="filter-select"
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
          value={maNhaSanXuatFilter}
          onChange={(event) =>
            onMaNhaSanXuatChange(event.target.value)
          }
          className="filter-select"
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
      </div>
    </div>
  );
};
export default SanPhamBoLoc;