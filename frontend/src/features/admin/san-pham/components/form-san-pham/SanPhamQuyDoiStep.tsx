export type SanPhamQuyDoiFormData = {
  maDonViTinhNguon: string;
  soLuongNguon: string;
  maDonViTinhDich: string;
  soLuongDich: string;
};

type DonViDaChon = {
  maDonViTinh: string;
  tenDonViTinh: string;
};

type SanPhamQuyDoiStepProps = {
  danhSachQuyDoi: SanPhamQuyDoiFormData[];
  donViDaChon: DonViDaChon[];
  dangLuu: boolean;

  onCapNhatQuyDoi: (
    index: number,
    field: keyof SanPhamQuyDoiFormData,
    value: string
  ) => void;
  onThemDongQuyDoi: () => void;
  onXoaDongQuyDoi: (index: number) => void;
  onQuayLai: () => void;
  onHoanTat: () => void;
};

function SanPhamQuyDoiStep({
  danhSachQuyDoi,
  donViDaChon,
  dangLuu,
  onCapNhatQuyDoi,
  onThemDongQuyDoi,
  onXoaDongQuyDoi,
  onQuayLai,
  onHoanTat,
}: SanPhamQuyDoiStepProps) {
  return (
    <div>
      <div className="product-step-title">
        <div>
          <h3>Quy đổi đơn vị</h3>
          <p>
            Khai báo mối quan hệ giữa các đơn vị vừa chọn.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onThemDongQuyDoi}
          disabled={donViDaChon.length < 2}
        >
          <i className="bi bi-plus-circle" />
          Thêm quy đổi
        </button>
      </div>

      {donViDaChon.length === 1 ? (
        <div className="product-empty-note">
          Sản phẩm chỉ có một đơn vị nên không cần khai báo
          quy đổi.
        </div>
      ) : (
        <div className="product-table-wrapper">
          <table className="data-table product-entry-table">
            <thead>
              <tr>
                <th>Đơn vị nguồn</th>
                <th>SL nguồn</th>
                <th>Đơn vị đích</th>
                <th>SL đích</th>
                <th>Diễn giải</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {danhSachQuyDoi.map((quyDoi, index) => (
                <tr key={`quy-doi-${index}`}>
                  <td>
                    <select
                      value={quyDoi.maDonViTinhNguon}
                      onChange={(event) =>
                        onCapNhatQuyDoi(
                          index,
                          "maDonViTinhNguon",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        -- Chọn nguồn --
                      </option>

                      {donViDaChon.map((donVi) => (
                        <option
                          key={donVi.maDonViTinh}
                          value={donVi.maDonViTinh}
                          disabled={
                            donVi.maDonViTinh ===
                            quyDoi.maDonViTinhDich
                          }
                        >
                          {donVi.tenDonViTinh}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      min={0.001}
                      step="0.001"
                      value={quyDoi.soLuongNguon}
                      onChange={(event) =>
                        onCapNhatQuyDoi(
                          index,
                          "soLuongNguon",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <select
                      value={quyDoi.maDonViTinhDich}
                      onChange={(event) =>
                        onCapNhatQuyDoi(
                          index,
                          "maDonViTinhDich",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        -- Chọn đích --
                      </option>

                      {donViDaChon.map((donVi) => (
                        <option
                          key={donVi.maDonViTinh}
                          value={donVi.maDonViTinh}
                          disabled={
                            donVi.maDonViTinh ===
                            quyDoi.maDonViTinhNguon
                          }
                        >
                          {donVi.tenDonViTinh}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      min={0.001}
                      step="0.001"
                      value={quyDoi.soLuongDich}
                      onChange={(event) =>
                        onCapNhatQuyDoi(
                          index,
                          "soLuongDich",
                          event.target.value
                        )
                      }
                      placeholder="Số lượng"
                    />
                  </td>

                  <td>
                    {quyDoi.soLuongNguon || "?"}{" "}
                    {donViDaChon.find(
                      (item) =>
                        item.maDonViTinh ===
                        quyDoi.maDonViTinhNguon
                    )?.tenDonViTinh || "đơn vị nguồn"}
                    {" = "}
                    {quyDoi.soLuongDich || "?"}{" "}
                    {donViDaChon.find(
                      (item) =>
                        item.maDonViTinh ===
                        quyDoi.maDonViTinhDich
                    )?.tenDonViTinh || "đơn vị đích"}
                  </td>

                  <td className="product-center-cell">
                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={() =>
                        onXoaDongQuyDoi(index)
                      }
                      title="Xóa quy đổi"
                      aria-label="Xóa quy đổi"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}

              {danhSachQuyDoi.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-cell"
                  >
                    Chưa có quy đổi đơn vị.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onQuayLai}
          disabled={dangLuu}
        >
          <i className="bi bi-arrow-left" />
          Quay lại
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={onHoanTat}
          disabled={dangLuu}
        >
          <i className="bi bi-check-circle" />
          {dangLuu
            ? "Đang tạo..."
            : "Hoàn tất tạo sản phẩm"}
        </button>
      </div>
    </div>
  );
}

export default SanPhamQuyDoiStep;