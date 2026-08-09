import type { DonViTinhOption } from "../../types/SanPham";

export type SanPhamDonViFormData = {
  maDonViTinh: string;
  giaBanTheoDonVi: string;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
};

type SanPhamDonViStepProps = {
  danhSachDonVi: SanPhamDonViFormData[];
  donViTinhDangDung: DonViTinhOption[];

  onCapNhatDonVi: (
    index: number,
    field: keyof SanPhamDonViFormData,
    value: string | boolean
  ) => void;
  onChonDonViCoSo: (index: number) => void;
  onThemDongDonVi: () => void;
  onXoaDongDonVi: (index: number) => void;
  onQuayLai: () => void;
  onTiepTuc: () => void;
};

function SanPhamDonViStep({
  danhSachDonVi,
  donViTinhDangDung,
  onCapNhatDonVi,
  onChonDonViCoSo,
  onThemDongDonVi,
  onXoaDongDonVi,
  onQuayLai,
  onTiepTuc,
}: SanPhamDonViStepProps) {
  return (
    <div>
      <div className="product-step-title">
        <div>
          <h3>Đơn vị sản phẩm</h3>
          <p>
            Chọn đúng một đơn vị cơ sở. Đơn vị được bán
            phải có giá bán.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onThemDongDonVi}
        >
          <i className="bi bi-plus-circle" />
          Thêm đơn vị
        </button>
      </div>

      <div className="product-table-wrapper">
        <table className="data-table product-entry-table">
          <thead>
            <tr>
              <th>Đơn vị tính</th>
              <th>Giá bán</th>
              <th>Cơ sở</th>
              <th>Cho bán</th>
              <th>Cho nhập</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachDonVi.map((donVi, index) => (
              <tr key={`don-vi-${index}`}>
                <td>
                  <select
                    value={donVi.maDonViTinh}
                    onChange={(event) =>
                      onCapNhatDonVi(
                        index,
                        "maDonViTinh",
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      -- Chọn đơn vị --
                    </option>

                    {donViTinhDangDung.map((item) => {
                      const daDuocDongKhacChon =
                        danhSachDonVi.some(
                          (donViKhac, viTriKhac) =>
                            viTriKhac !== index &&
                            donViKhac.maDonViTinh ===
                              String(item.maDonViTinh)
                        );

                      return (
                        <option
                          key={item.maDonViTinh}
                          value={item.maDonViTinh}
                          disabled={daDuocDongKhacChon}
                        >
                          {item.tenDonViTinh}
                          {item.kyHieu
                            ? ` (${item.kyHieu})`
                            : ""}
                        </option>
                      );
                    })}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    min={0}
                    value={donVi.giaBanTheoDonVi}
                    onChange={(event) =>
                      onCapNhatDonVi(
                        index,
                        "giaBanTheoDonVi",
                        event.target.value
                      )
                    }
                    placeholder="Giá bán"
                  />
                </td>

                <td className="product-center-cell">
                  <input
                    type="radio"
                    name="donViCoSo"
                    checked={donVi.laDonViCoSo}
                    onChange={() =>
                      onChonDonViCoSo(index)
                    }
                    title="Chọn làm đơn vị cơ sở"
                  />
                </td>

                <td className="product-center-cell">
                  <input
                    type="checkbox"
                    checked={donVi.choPhepBan}
                    onChange={(event) =>
                      onCapNhatDonVi(
                        index,
                        "choPhepBan",
                        event.target.checked
                      )
                    }
                  />
                </td>

                <td className="product-center-cell">
                  <input
                    type="checkbox"
                    checked={donVi.choPhepNhap}
                    onChange={(event) =>
                      onCapNhatDonVi(
                        index,
                        "choPhepNhap",
                        event.target.checked
                      )
                    }
                  />
                </td>

                <td className="product-center-cell">
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() =>
                      onXoaDongDonVi(index)
                    }
                    title="Xóa đơn vị"
                    aria-label="Xóa đơn vị"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onQuayLai}
        >
          <i className="bi bi-arrow-left" />
          Quay lại
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={onTiepTuc}
        >
          Tiếp tục
          <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

export default SanPhamDonViStep;