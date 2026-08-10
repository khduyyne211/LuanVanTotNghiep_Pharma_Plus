import "../../styles/quan-ly/QuanLyCommon.css";

type PhanTrangQuanLyProps = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  tenDonVi: string;
  danhSachKichThuoc?: number[];
  onDoiTrang: (page: number) => void;
  onDoiKichThuoc: (size: number) => void;
};

export default function PhanTrangQuanLy({
  page,
  size,
  totalElements,
  totalPages,
  first,
  last,
  tenDonVi,
  danhSachKichThuoc = [5, 10, 20],
  onDoiTrang,
  onDoiKichThuoc,
}: PhanTrangQuanLyProps) {
  const khongCoDuLieu = totalPages === 0;

  return (
    <div className="ql-pagination">
      <div className="ql-pagination-info">
        <span>Hiển thị</span>

        <select
          value={size}
          onChange={(event) =>
            onDoiKichThuoc(Number(event.target.value))
          }
        >
          {danhSachKichThuoc.map((kichThuoc) => (
            <option key={kichThuoc} value={kichThuoc}>
              {kichThuoc}
            </option>
          ))}
        </select>

        <span>
          trên {totalElements} {tenDonVi}
        </span>
      </div>

      <div className="ql-pagination-actions">
        <button
          type="button"
          disabled={first || khongCoDuLieu}
          onClick={() => onDoiTrang(Math.max(0, page - 1))}
          aria-label="Trang trước"
        >
          <i className="bi bi-chevron-left" />
        </button>

        <span>
          Trang {khongCoDuLieu ? 0 : page + 1}/{totalPages}
        </span>

        <button
          type="button"
          disabled={last || khongCoDuLieu}
          onClick={() => onDoiTrang(page + 1)}
          aria-label="Trang sau"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}