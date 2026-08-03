import type { FormEvent } from "react";

import type { LoiTruongThongTinCaNhan } from "../hooks/useThongTinCaNhan";
import type {
  CapNhatThongTinCaNhanRequest,
  GioiTinh,
  ThongTinCaNhan,
} from "../types/ThongTinCaNhan";

interface ThongTinCaNhanFormProps {
  thongTin: ThongTinCaNhan;
  duLieu: CapNhatThongTinCaNhanRequest;
  loiTruong: LoiTruongThongTinCaNhan;
  dangChinhSua: boolean;
  dangLuu: boolean;
  thayDoiDuLieu: <
    K extends keyof CapNhatThongTinCaNhanRequest,
  >(
    tenTruong: K,
    giaTri: CapNhatThongTinCaNhanRequest[K],
  ) => void;
  batDauChinhSua: () => void;
  huyThayDoi: () => void;
  luuThongTin: () => void;
}

function hienThiGioiTinh(
  gioiTinh: GioiTinh | null,
): string {
  if (gioiTinh === "NAM") return "Nam";
  if (gioiTinh === "NU") return "Nữ";
  if (gioiTinh === "KHAC") return "Khác";

  return "Chưa cập nhật";
}

function hienThiNgaySinh(
  ngaySinh: string | null,
): string {
  if (!ngaySinh) return "Chưa cập nhật";

  const [nam, thang, ngay] =
    ngaySinh.split("-");

  return `${ngay}-${thang}-${nam}`;
}

function ThongTinCaNhanForm({
  thongTin,
  duLieu,
  loiTruong,
  dangChinhSua,
  dangLuu,
  thayDoiDuLieu,
  batDauChinhSua,
  huyThayDoi,
  luuThongTin,
}: ThongTinCaNhanFormProps) {
  const xuLyGuiForm = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    luuThongTin();
  };

  return (
    <div className="thong-tin-ca-nhan-noi-dung">
      <div className="thong-tin-ca-nhan-avatar">
        <i className="bi bi-person-circle"></i>
      </div>

      {!dangChinhSua ? (
        <>
          <div className="thong-tin-ca-nhan-danh-sach">
            <div className="thong-tin-ca-nhan-dong">
              <span>Họ và tên</span>
              <strong>{thongTin.hoTen}</strong>
            </div>

            <div className="thong-tin-ca-nhan-dong">
              <span>Số điện thoại</span>
              <strong>{thongTin.soDienThoai}</strong>
            </div>

            <div className="thong-tin-ca-nhan-dong">
              <span>Giới tính</span>
              <strong>
                {hienThiGioiTinh(thongTin.gioiTinh)}
              </strong>
            </div>

            <div className="thong-tin-ca-nhan-dong">
              <span>Ngày sinh</span>
              <strong>
                {hienThiNgaySinh(thongTin.ngaySinh)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="thong-tin-ca-nhan-nut-chinh"
            onClick={batDauChinhSua}
          >
            Chỉnh sửa thông tin
          </button>
        </>
      ) : (
        <form
          className="thong-tin-ca-nhan-form"
          onSubmit={xuLyGuiForm}
          noValidate
        >
          <div className="thong-tin-ca-nhan-truong">
            <label htmlFor="hoTen">
              Họ và tên
            </label>

            <input
              id="hoTen"
              type="text"
              value={duLieu.hoTen}
              disabled={dangLuu}
              aria-invalid={Boolean(loiTruong.hoTen)}
              onChange={(event) =>
                thayDoiDuLieu(
                  "hoTen",
                  event.target.value,
                )
              }
            />

            {loiTruong.hoTen && (
              <p className="thong-tin-ca-nhan-loi">
                {loiTruong.hoTen}
              </p>
            )}
          </div>

          <div className="thong-tin-ca-nhan-truong">
            <label htmlFor="soDienThoai">
              Số điện thoại
            </label>

            <input
              id="soDienThoai"
              type="text"
              value={thongTin.soDienThoai}
              disabled
            />
          </div>

          <fieldset className="thong-tin-ca-nhan-gioi-tinh">
            <legend>Giới tính</legend>

            <label>
              <input
                type="radio"
                name="gioiTinh"
                checked={duLieu.gioiTinh === "NAM"}
                disabled={dangLuu}
                onChange={() =>
                  thayDoiDuLieu("gioiTinh", "NAM")
                }
              />
              Nam
            </label>

            <label>
              <input
                type="radio"
                name="gioiTinh"
                checked={duLieu.gioiTinh === "NU"}
                disabled={dangLuu}
                onChange={() =>
                  thayDoiDuLieu("gioiTinh", "NU")
                }
              />
              Nữ
            </label>

            <label>
              <input
                type="radio"
                name="gioiTinh"
                checked={duLieu.gioiTinh === "KHAC"}
                disabled={dangLuu}
                onChange={() =>
                  thayDoiDuLieu("gioiTinh", "KHAC")
                }
              />
              Khác
            </label>
          </fieldset>

          <div className="thong-tin-ca-nhan-truong">
            <label htmlFor="ngaySinh">
              Ngày sinh
            </label>

            <input
              id="ngaySinh"
              type="date"
              value={duLieu.ngaySinh ?? ""}
              disabled={dangLuu}
              aria-invalid={Boolean(
                loiTruong.ngaySinh,
              )}
              onChange={(event) =>
                thayDoiDuLieu(
                  "ngaySinh",
                  event.target.value || null,
                )
              }
            />

            {loiTruong.ngaySinh && (
              <p className="thong-tin-ca-nhan-loi">
                {loiTruong.ngaySinh}
              </p>
            )}
          </div>

          <div className="thong-tin-ca-nhan-hanh-dong">
            <button
              type="button"
              className="thong-tin-ca-nhan-nut-phu"
              disabled={dangLuu}
              onClick={huyThayDoi}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="thong-tin-ca-nhan-nut-chinh"
              disabled={dangLuu}
            >
              {dangLuu
                ? "Đang lưu..."
                : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ThongTinCaNhanForm;