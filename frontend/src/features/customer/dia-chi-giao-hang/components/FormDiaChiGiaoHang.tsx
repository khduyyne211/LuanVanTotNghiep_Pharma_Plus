import type { FormEvent } from "react";

import {
  DANH_SACH_TINH_THANH_GIAO_HANG,
} from "../constants/DiaChiGiaoHangConstants";

import type {
  DiaChiGiaoHang,
  LoiTruongDiaChiGiaoHang,
  LuuDiaChiGiaoHangRequest,
} from "../types/DiaChiGiaoHang";

import "../styles/DiaChiGiaoHang.css";

interface FormDiaChiGiaoHangProps {
  dangMoForm: boolean;
  diaChiDangSua: DiaChiGiaoHang | null;
  duLieuForm: LuuDiaChiGiaoHangRequest;
  loiTruong: LoiTruongDiaChiGiaoHang;
  dangLuu: boolean;

  thayDoiDuLieuForm: <
    K extends keyof LuuDiaChiGiaoHangRequest,
  >(
    tenTruong: K,
    giaTri: LuuDiaChiGiaoHangRequest[K],
  ) => void;

  dongForm: () => void;
  luuDiaChi: () => void;
}

function FormDiaChiGiaoHang({
  dangMoForm,
  diaChiDangSua,
  duLieuForm,
  loiTruong,
  dangLuu,
  thayDoiDuLieuForm,
  dongForm,
  luuDiaChi,
}: FormDiaChiGiaoHangProps) {
  if (!dangMoForm) {
    return null;
  }

  const xuLyGuiForm = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    luuDiaChi();
  };

  return (
    <div
      className="dia-chi-form-overlay"
      onMouseDown={dongForm}
    >
      <section
        className="dia-chi-form-khung"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diaChiFormTieuDe"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="dia-chi-form-tieu-de">
          <h2 id="diaChiFormTieuDe">
            {diaChiDangSua
              ? "Chỉnh sửa địa chỉ"
              : "Thêm địa chỉ mới"}
          </h2>

          <button
            type="button"
            aria-label="Đóng form địa chỉ"
            onClick={dongForm}
            disabled={dangLuu}
          >
            ×
          </button>
        </div>

        <form
          className="dia-chi-form"
          onSubmit={xuLyGuiForm}
          noValidate
        >
          <div className="dia-chi-form-noi-dung">
            <div className="dia-chi-form-truong">
              <label htmlFor="tenNguoiNhan">
                Họ tên người nhận
              </label>

              <input
                id="tenNguoiNhan"
                type="text"
                value={duLieuForm.tenNguoiNhan}
                maxLength={100}
                disabled={dangLuu}
                aria-invalid={Boolean(
                  loiTruong.tenNguoiNhan,
                )}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "tenNguoiNhan",
                    event.target.value,
                  )
                }
              />

              {loiTruong.tenNguoiNhan && (
                <p className="dia-chi-form-loi">
                  {loiTruong.tenNguoiNhan}
                </p>
              )}
            </div>

            <div className="dia-chi-form-truong">
              <label htmlFor="soDienThoaiNhan">
                Số điện thoại người nhận
              </label>

              <input
                id="soDienThoaiNhan"
                type="tel"
                value={duLieuForm.soDienThoaiNhan}
                maxLength={10}
                inputMode="numeric"
                disabled={dangLuu}
                aria-invalid={Boolean(
                  loiTruong.soDienThoaiNhan,
                )}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "soDienThoaiNhan",
                    event.target.value,
                  )
                }
              />

              {loiTruong.soDienThoaiNhan && (
                <p className="dia-chi-form-loi">
                  {loiTruong.soDienThoaiNhan}
                </p>
              )}
            </div>

            <div className="dia-chi-form-ngan-cach"></div>

            <div className="dia-chi-form-truong">
              <label htmlFor="thanhPho">
                Tỉnh/Thành phố
              </label>

              <select
                id="thanhPho"
                value={duLieuForm.thanhPho}
                disabled={dangLuu}
                aria-invalid={Boolean(
                  loiTruong.thanhPho,
                )}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "thanhPho",
                    event.target.value,
                  )
                }
              >
                {DANH_SACH_TINH_THANH_GIAO_HANG.map(
                  (tinhThanh) => (
                    <option
                      key={tinhThanh}
                      value={tinhThanh}
                    >
                      {tinhThanh}
                    </option>
                  ),
                )}
              </select>

              {loiTruong.thanhPho && (
                <p className="dia-chi-form-loi">
                  {loiTruong.thanhPho}
                </p>
              )}
            </div>

            <div className="dia-chi-form-truong">
              <label htmlFor="phuongKhuVuc">
                Phường hoặc khu vực
              </label>

              <input
                id="phuongKhuVuc"
                type="text"
                value={duLieuForm.phuongKhuVuc}
                maxLength={150}
                disabled={dangLuu}
                aria-invalid={Boolean(
                  loiTruong.phuongKhuVuc,
                )}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "phuongKhuVuc",
                    event.target.value,
                  )
                }
              />

              {loiTruong.phuongKhuVuc && (
                <p className="dia-chi-form-loi">
                  {loiTruong.phuongKhuVuc}
                </p>
              )}
            </div>

            <div className="dia-chi-form-truong">
              <label htmlFor="diaChiChiTiet">
                Địa chỉ chi tiết
              </label>

              <textarea
                id="diaChiChiTiet"
                value={duLieuForm.diaChiChiTiet}
                maxLength={255}
                rows={3}
                disabled={dangLuu}
                aria-invalid={Boolean(
                  loiTruong.diaChiChiTiet,
                )}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "diaChiChiTiet",
                    event.target.value,
                  )
                }
              />

              {loiTruong.diaChiChiTiet && (
                <p className="dia-chi-form-loi">
                  {loiTruong.diaChiChiTiet}
                </p>
              )}
            </div>

            <label className="dia-chi-form-mac-dinh">
              <span>
                Đặt làm địa chỉ mặc định
              </span>

              <input
                type="checkbox"
                checked={duLieuForm.laMacDinh}
                disabled={dangLuu}
                onChange={(event) =>
                  thayDoiDuLieuForm(
                    "laMacDinh",
                    event.target.checked,
                  )
                }
              />

              <span className="dia-chi-form-cong-tac"></span>
            </label>
          </div>

          <div className="dia-chi-form-hanh-dong">
            <button
              type="button"
              className="dia-chi-form-nut-huy"
              onClick={dongForm}
              disabled={dangLuu}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="dia-chi-form-nut-luu"
              disabled={dangLuu}
            >
              {dangLuu
                ? "Đang lưu..."
                : diaChiDangSua
                  ? "Cập nhật"
                  : "Thêm địa chỉ"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default FormDiaChiGiaoHang;