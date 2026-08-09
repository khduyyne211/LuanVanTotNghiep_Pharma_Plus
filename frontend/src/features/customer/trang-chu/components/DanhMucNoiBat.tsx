import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { layIconDanhMuc } from "../../../danh-muc-khach-hang/constants/IconDanhMuc";
import { useDanhMucNoiBat } from "../../../danh-muc-khach-hang/hooks/useDanhMucNoiBat";
import type { DanhMucNoiBat as DanhMucNoiBatType } from "../../../danh-muc-khach-hang/types/DanhMucNoiBat";
import { taoSlug } from "../../../../shared/utils/taoSlug";

import "../styles/TrangChu.css";

function DanhMucNoiBat() {
  const navigate = useNavigate();

  const {
    danhSachDanhMucNoiBat,
    dangTaiDanhMucNoiBat,
    loiTaiDanhMucNoiBat,
  } = useDanhMucNoiBat(12);

  const chuyenDenDanhMuc = (danhMuc: DanhMucNoiBatType) => {
    navigate(
      `/danh-muc/${danhMuc.maDanhMuc}/${taoSlug(danhMuc.tenDanhMuc)}`
    );
  };

  return (
    <section className="danh-muc-noi-bat">
      <div className="danh-muc-noi-bat-tieu-de">
        <i className="bi bi-trophy-fill"></i>
        <h2>Danh mục nổi bật</h2>
      </div>

      <div className="danh-muc-noi-bat-danh-sach">
        {dangTaiDanhMucNoiBat && (
          <p className="danh-muc-noi-bat-trang-thai">
            Đang tải danh mục nổi bật...
          </p>
        )}

        {!dangTaiDanhMucNoiBat && loiTaiDanhMucNoiBat && (
          <p
            className="danh-muc-noi-bat-trang-thai danh-muc-noi-bat-trang-thai--loi"
            role="alert"
          >
            {loiTaiDanhMucNoiBat}
          </p>
        )}

        {!dangTaiDanhMucNoiBat &&
          !loiTaiDanhMucNoiBat &&
          danhSachDanhMucNoiBat.length === 0 && (
            <p className="danh-muc-noi-bat-trang-thai">
              Chưa có danh mục nổi bật.
            </p>
          )}

        {!dangTaiDanhMucNoiBat &&
          !loiTaiDanhMucNoiBat &&
          danhSachDanhMucNoiBat.map((danhMuc, index) => (
            <button
              key={danhMuc.maDanhMuc}
              type="button"
              className="danh-muc-noi-bat-the"
              onClick={() => chuyenDenDanhMuc(danhMuc)}
            >
              <div
                className={
                  `danh-muc-noi-bat-icon ` +
                  `mau-icon-${(index % 12) + 1}`
                }
              >
                <FontAwesomeIcon icon={layIconDanhMuc(danhMuc.maDanhMuc)} />
              </div>

              <strong>{danhMuc.tenDanhMuc}</strong>

              <span>
                {danhMuc.soLuongSanPham.toLocaleString("vi-VN")} sản phẩm
              </span>
            </button>
          ))}
      </div>
    </section>
  );
}

export default DanhMucNoiBat;