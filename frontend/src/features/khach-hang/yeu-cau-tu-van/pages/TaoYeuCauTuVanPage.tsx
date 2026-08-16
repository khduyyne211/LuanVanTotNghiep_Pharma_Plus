import {
  type FormEvent,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import ChonSanPhamTuVanModal
  from "../../yeu-cau-tu-van/components/ChonSanPhamTuVanModal";

import {
  useTaoYeuCauTuVan,
} from "../../yeu-cau-tu-van/hooks/useTaoYeuCauTuVan";

import "../../yeu-cau-tu-van/styles/TaoYeuCauTuVan.css";

export default function TaoYeuCauTuVanPage() {
  const navigate = useNavigate();

  const [
    dangMoChonSanPham,
    setDangMoChonSanPham,
  ] = useState(false);

  const {
    duLieuForm,

    sanPhamDaChon,

    dangTaiThongTin,
    dangTaiSanPhamTuVan,
    dangGuiYeuCau,

    loiTaiThongTin,
    loiTaiSanPhamTuVan,
    loiGuiYeuCau,

    capNhatTruong,

    chonSanPhamTuVan,
    xoaSanPhamTuVan,

    taiThongTinTaoMoi,
    guiYeuCauTuVan,
  } = useTaoYeuCauTuVan();

  const xuLyGuiYeuCau = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const yeuCauDaTao =
      await guiYeuCauTuVan();

    if (!yeuCauDaTao) {
      return;
    }

    navigate(
      `/tai-khoan/yeu-cau-tu-van/${yeuCauDaTao.maYeuCauTuVan}`,
      {
        replace: true,
      }
    );
  };

  return (
    <section className="tao-yeu-cau-trang">
      <div className="tao-yeu-cau-header">
        <Link
          to="/tai-khoan/yeu-cau-tu-van"
          className="tao-yeu-cau-quay-lai"
        >
          ← Quay lại danh sách yêu cầu tư vấn
        </Link>
      </div>

      <div className="tao-yeu-cau-khoi tao-yeu-cau-khoi-dau">
        <h1>
          Tạo yêu cầu tư vấn
        </h1>

        <p>
          Cung cấp thông tin để nhà thuốc
          liên hệ và hỗ trợ bạn.
        </p>
      </div>

      {loiTaiThongTin && (
        <div className="tao-yeu-cau-canh-bao">
          <span>
            {loiTaiThongTin}
          </span>

          <button
            type="button"
            onClick={() =>
              void taiThongTinTaoMoi()
            }
          >
            Tải lại
          </button>
        </div>
      )}

      <form
        className="tao-yeu-cau-form"
        onSubmit={xuLyGuiYeuCau}
      >
        <div className="tao-yeu-cau-khoi">
          <h2>
            Thông tin liên hệ
          </h2>

          {dangTaiThongTin ? (
            <div className="tao-yeu-cau-dang-tai">
              <div className="tao-yeu-cau-vong-xoay" />

              <span>
                Đang tải thông tin khách hàng...
              </span>
            </div>
          ) : (
            <div className="tao-yeu-cau-hai-cot">
              <label className="tao-yeu-cau-truong">
                <span>
                  Họ và tên
                  <strong>*</strong>
                </span>

                <input
                  type="text"
                  value={
                    duLieuForm.tenKhachHang
                  }
                  maxLength={100}
                  autoComplete="name"
                  disabled={
                    dangGuiYeuCau
                  }
                  onChange={(event) =>
                    capNhatTruong(
                      "tenKhachHang",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="tao-yeu-cau-truong">
                <span>
                  Số điện thoại
                  <strong>*</strong>
                </span>

                <input
                  type="tel"
                  value={
                    duLieuForm.soDienThoai
                  }
                  maxLength={20}
                  autoComplete="tel"
                  disabled={
                    dangGuiYeuCau
                  }
                  onChange={(event) =>
                    capNhatTruong(
                      "soDienThoai",
                      event.target.value
                    )
                  }
                />
              </label>
            </div>
          )}
        </div>

        <div className="tao-yeu-cau-khoi">
          <h2>
            Hình thức liên hệ
          </h2>

          <div className="tao-yeu-cau-lua-chon">
            <label
              className={
                duLieuForm.hinhThucLienHe ===
                "GOI_DIEN"
                  ? "tao-yeu-cau-lua-chon-muc tao-yeu-cau-lua-chon-muc--dang-chon"
                  : "tao-yeu-cau-lua-chon-muc"
              }
            >
              <input
                type="radio"
                name="hinhThucLienHe"
                value="GOI_DIEN"
                checked={
                  duLieuForm.hinhThucLienHe ===
                  "GOI_DIEN"
                }
                disabled={
                  dangGuiYeuCau
                }
                onChange={() =>
                  capNhatTruong(
                    "hinhThucLienHe",
                    "GOI_DIEN"
                  )
                }
              />

              <i className="bi bi-telephone" />

              <div>
                <strong>
                  Gọi điện thoại
                </strong>

                <span>
                  Nhà thuốc sẽ gọi lại theo số
                  điện thoại đã nhập.
                </span>
              </div>
            </label>

            <label
              className={
                duLieuForm.hinhThucLienHe ===
                "ZALO"
                  ? "tao-yeu-cau-lua-chon-muc tao-yeu-cau-lua-chon-muc--dang-chon"
                  : "tao-yeu-cau-lua-chon-muc"
              }
            >
              <input
                type="radio"
                name="hinhThucLienHe"
                value="ZALO"
                checked={
                  duLieuForm.hinhThucLienHe ===
                  "ZALO"
                }
                disabled={
                  dangGuiYeuCau
                }
                onChange={() =>
                  capNhatTruong(
                    "hinhThucLienHe",
                    "ZALO"
                  )
                }
              />

              <i className="bi bi-chat-dots" />

              <div>
                <strong>
                  Liên hệ qua Zalo
                </strong>

                <span>
                  Nhà thuốc sẽ liên hệ Zalo bằng
                  số điện thoại đã nhập.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="tao-yeu-cau-khoi">
          <div className="tao-yeu-cau-san-pham-header">
            <div>
              <h2>
                Sản phẩm cần tư vấn
              </h2>

              <p>
                Không bắt buộc. Bạn có thể chọn một
                sản phẩm cụ thể cần được tư vấn.
              </p>
            </div>

            {!sanPhamDaChon &&
              !dangTaiSanPhamTuVan && (
                <button
                  type="button"
                  className="tao-yeu-cau-chon-san-pham"
                  disabled={
                    dangGuiYeuCau
                  }
                  onClick={() =>
                    setDangMoChonSanPham(
                      true
                    )
                  }
                >
                  <i className="bi bi-plus-lg" />

                  Chọn sản phẩm
                </button>
              )}
          </div>

          {dangTaiSanPhamTuVan ? (
            <div className="tao-yeu-cau-dang-tai-san-pham">
              <div className="tao-yeu-cau-vong-xoay" />

              <span>
                Đang tải sản phẩm cần tư vấn...
              </span>
            </div>
          ) : sanPhamDaChon ? (
            <div className="tao-yeu-cau-san-pham-da-chon">
              <div className="tao-yeu-cau-san-pham-anh">
                {sanPhamDaChon.hinhAnh ? (
                  <img
                    src={
                      sanPhamDaChon.hinhAnh
                    }
                    alt={
                      sanPhamDaChon.tenSanPham
                    }
                  />
                ) : (
                  <i className="bi bi-capsule" />
                )}
              </div>

              <div className="tao-yeu-cau-san-pham-thong-tin">
                <strong>
                  {
                    sanPhamDaChon.tenSanPham
                  }
                </strong>

                {sanPhamDaChon.laThuocKeDon && (
                  <span>
                    Thuốc kê đơn
                  </span>
                )}
              </div>

              <div className="tao-yeu-cau-san-pham-hanh-dong">
                <button
                  type="button"
                  className="tao-yeu-cau-xoa-san-pham-icon"
                  disabled={
                    dangGuiYeuCau
                  }
                  onClick={
                    xoaSanPhamTuVan
                  }
                  title="Xóa sản phẩm"
                  aria-label="Xóa sản phẩm"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="tao-yeu-cau-chua-chon-san-pham">
              <i className="bi bi-capsule" />

              <span>
                Chưa chọn sản phẩm cụ thể.
              </span>
            </div>
          )}

          {loiTaiSanPhamTuVan && (
            <div className="tao-yeu-cau-loi-san-pham">
              {loiTaiSanPhamTuVan}
            </div>
          )}
        </div>

        <div className="tao-yeu-cau-khoi">
          <h2>
            Nội dung cần tư vấn
          </h2>

          <label className="tao-yeu-cau-truong">
            <span>
              Nội dung
              <strong>*</strong>
            </span>

            <textarea
              value={
                duLieuForm.noiDungCanTuVan
              }
              maxLength={2000}
              rows={7}
              disabled={
                dangGuiYeuCau
              }
              placeholder="Ví dụ: Tôi cần tư vấn về cách sử dụng sản phẩm..."
              onChange={(event) =>
                capNhatTruong(
                  "noiDungCanTuVan",
                  event.target.value
                )
              }
            />

            <small>
              {
                duLieuForm.noiDungCanTuVan
                  .length
              }
              /2000 ký tự
            </small>
          </label>
        </div>

        {loiGuiYeuCau && (
          <div
            className="tao-yeu-cau-loi"
            role="alert"
          >
            {loiGuiYeuCau}
          </div>
        )}

        <div className="tao-yeu-cau-hanh-dong">
          <Link
            to="/tai-khoan/yeu-cau-tu-van"
            className="tao-yeu-cau-huy"
          >
            Hủy
          </Link>

          <button
            type="submit"
            className="tao-yeu-cau-gui"
            disabled={
              dangGuiYeuCau ||
              dangTaiThongTin ||
              dangTaiSanPhamTuVan
            }
          >
            {dangGuiYeuCau ? (
              <>
                <span className="tao-yeu-cau-nut-vong-xoay" />

                Đang gửi...
              </>
            ) : (
              <>
                <i className="bi bi-send" />

                Gửi yêu cầu tư vấn
              </>
            )}
          </button>
        </div>
      </form>

      {dangMoChonSanPham && (
        <ChonSanPhamTuVanModal
          sanPhamDangChon={
            sanPhamDaChon
          }
          onChonSanPham={
            chonSanPhamTuVan
          }
          onDong={() =>
            setDangMoChonSanPham(
              false
            )
          }
        />
      )}
    </section>
  );
}