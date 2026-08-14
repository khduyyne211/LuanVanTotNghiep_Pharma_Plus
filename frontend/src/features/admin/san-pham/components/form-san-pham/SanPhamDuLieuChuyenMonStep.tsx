import type { FormEvent } from "react";

export type SanPhamDuLieuChuyenMonFormData = {
  dangBaoChe: string;
  phanLoaiThuoc: string;
  congDungThamKhao: string;
  cachDungThamKhao: string;
  canhBaoAnToan: string;
};

type SanPhamDuLieuChuyenMonStepProps = {
  formData: SanPhamDuLieuChuyenMonFormData;
  dangLuu: boolean;
  onCapNhat: (
    field: keyof SanPhamDuLieuChuyenMonFormData,
    value: string,
  ) => void;
  onQuayLai: () => void;
  onHoanTat: () => void;
};

function SanPhamDuLieuChuyenMonStep({
  formData,
  dangLuu,
  onCapNhat,
  onQuayLai,
  onHoanTat,
}: SanPhamDuLieuChuyenMonStepProps) {
  const xuLySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onHoanTat();
  };

  return (
    <form noValidate onSubmit={xuLySubmit}>
      <div className="product-step-title">
        <div>
          <h3>Dữ liệu chuyên môn thuốc</h3>
          <p>
            Dữ liệu do Admin nhập sẽ ở trạng thái chờ Dược sĩ
            xác nhận.
          </p>
        </div>
      </div>

      <div className="product-professional-grid">
        <div className="form-group">
          <label>Dạng bào chế</label>
          <input
            type="text"
            value={formData.dangBaoChe}
            onChange={(event) =>
              onCapNhat("dangBaoChe", event.target.value)
            }
            placeholder="Ví dụ: Viên nén bao phim"
            required
          />
        </div>

        <div className="form-group">
          <label>Phân loại thuốc</label>
          <input
            type="text"
            value={formData.phanLoaiThuoc}
            onChange={(event) =>
              onCapNhat("phanLoaiThuoc", event.target.value)
            }
            placeholder="Ví dụ: Thuốc giảm đau, hạ sốt"
            required
          />
        </div>

        <div className="form-group product-form-full-row">
          <label>Công dụng tham khảo</label>
          <textarea
            value={formData.congDungThamKhao}
            onChange={(event) =>
              onCapNhat(
                "congDungThamKhao",
                event.target.value,
              )
            }
            rows={4}
            placeholder="Nhập công dụng tham khảo"
            required
          />
        </div>

        <div className="form-group product-form-full-row">
          <label>Cách dùng tham khảo</label>
          <textarea
            value={formData.cachDungThamKhao}
            onChange={(event) =>
              onCapNhat(
                "cachDungThamKhao",
                event.target.value,
              )
            }
            rows={4}
            placeholder="Nhập cách dùng tham khảo"
            required
          />
        </div>

        <div className="form-group product-form-full-row">
          <label>Cảnh báo an toàn</label>
          <textarea
            value={formData.canhBaoAnToan}
            onChange={(event) =>
              onCapNhat(
                "canhBaoAnToan",
                event.target.value,
              )
            }
            rows={4}
            placeholder="Nhập cảnh báo, chống chỉ định và lưu ý an toàn"
            required
          />
        </div>
      </div>

      <div className="product-step-actions">
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
          type="submit"
          className="primary-button"
          disabled={dangLuu}
        >
          {dangLuu ? (
            <>
              <i className="bi bi-arrow-repeat" />
              Đang tạo...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg" />
              Hoàn tất
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SanPhamDuLieuChuyenMonStep;