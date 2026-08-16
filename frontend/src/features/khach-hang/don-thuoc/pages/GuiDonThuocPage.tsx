import {
  type ChangeEvent,
  type FormEvent,
  useRef,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useGuiDonThuoc,
} from "../hooks/useGuiDonThuoc";

import "../styles/DonThuocKhachHang.css";

export default function GuiDonThuocPage() {
  const navigate =
    useNavigate();

  const inputAnhRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const {
    tepAnh,

    urlXemTruoc,

    loiAnh,

    loiGui,

    dangGui,

    chonAnh,

    xoaAnh,

    guiDonThuoc,
  } = useGuiDonThuoc();

  const xuLyChonAnh = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    chonAnh(
      file
    );

    /*
     * Cho phép khách chọn lại đúng
     * file vừa xóa.
     */
    event.target.value = "";
  };

  const xuLyGui = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const donThuocDaTao =
      await guiDonThuoc();

    if (!donThuocDaTao) {
      return;
    }

    navigate(
      `/tai-khoan/don-thuoc/${donThuocDaTao.maDonThuoc}`,
      {
        replace: true,
      }
    );
  };

  return (
    <section className="don-thuoc-trang">
      <div className="don-thuoc-quay-lai">
        <Link to="/tai-khoan/don-thuoc">
          ← Quay lại danh sách đơn thuốc
        </Link>
      </div>

      <div className="don-thuoc-khoi">
        <h1>
          Gửi đơn thuốc
        </h1>

        <p className="don-thuoc-mo-ta">
          Tải lên ảnh đơn thuốc để
          dược sĩ kiểm tra trước khi
          hỗ trợ mua thuốc kê đơn.
        </p>
      </div>

      <form
        className="don-thuoc-gui-form"
        onSubmit={
          xuLyGui
        }
      >
        <div className="don-thuoc-khoi">
          <div className="don-thuoc-tieu-de-khoi">
            <h2>
              Ảnh đơn thuốc
            </h2>

            <span>
              Bắt buộc
            </span>
          </div>

          <p className="don-thuoc-mo-ta">
            Hỗ trợ JPG, JPEG, PNG hoặc
            WEBP. Dung lượng tối đa 5 MB.
          </p>

          {!tepAnh ? (
            <button
              type="button"
              className="don-thuoc-khu-vuc-chon-anh"
              disabled={
                dangGui
              }
              onClick={() =>
                inputAnhRef
                  .current
                  ?.click()
              }
            >
              <i className="bi bi-cloud-arrow-up" />

              <strong>
                Chọn ảnh đơn thuốc
              </strong>

              <span>
                Bấm để chọn ảnh từ thiết bị
              </span>
            </button>
          ) : (
            <div className="don-thuoc-preview">
              <div className="don-thuoc-preview-anh">
                <img
                  src={
                    urlXemTruoc
                  }
                  alt="Ảnh đơn thuốc xem trước"
                />
              </div>

              <div className="don-thuoc-preview-footer">
                <div>
                  <strong>
                    {tepAnh.name}
                  </strong>

                  <span>
                    {(
                      tepAnh.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" MB"}
                  </span>
                </div>

                <button
                  type="button"
                  className="don-thuoc-xoa-anh"
                  disabled={
                    dangGui
                  }
                  title="Xóa ảnh"
                  aria-label="Xóa ảnh"
                  onClick={
                    xoaAnh
                  }
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          )}

          <input
            ref={
              inputAnhRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={
              xuLyChonAnh
            }
          />

          {loiAnh && (
            <div
              className="don-thuoc-loi"
              role="alert"
            >
              {loiAnh}
            </div>
          )}
        </div>

        <div className="don-thuoc-luu-y">
          <i className="bi bi-info-circle" />

          <div>
            <strong>
              Lưu ý khi gửi đơn thuốc
            </strong>

            <p>
              Hãy sử dụng ảnh rõ nét,
              đầy đủ nội dung đơn thuốc
              và tránh bị che khuất thông tin.
            </p>
          </div>
        </div>

        {loiGui && (
          <div
            className="don-thuoc-loi"
            role="alert"
          >
            {loiGui}
          </div>
        )}

        <div className="don-thuoc-hanh-dong">
          <Link
            to="/tai-khoan/don-thuoc"
            className="don-thuoc-nut-phu"
          >
            Hủy
          </Link>

          <button
            type="submit"
            className="don-thuoc-nut-chinh"
            disabled={
              dangGui ||
              !tepAnh
            }
          >
            {dangGui ? (
              <>
                <span className="don-thuoc-vong-xoay-nho" />

                Đang gửi...
              </>
            ) : (
              <>
                <i className="bi bi-send" />

                Gửi đơn thuốc
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}