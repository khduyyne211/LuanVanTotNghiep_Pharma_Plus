import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  capNhatDonViSanPham,
  layDanhSachDonViTinh,
  themDonViSanPham,
} from "../api/sanPhamApi";

import type {
  DonViSanPham,
  DonViTinhOption,
} from "../types/SanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type DonViSanPhamForm = {
  maDonViTinh: string;
  giaBanTheoDonVi: string;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
};

type DonViSanPhamFormModalProps = {
  isOpen: boolean;
  maSanPham: number;
  donViCanSua: DonViSanPham | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  onThongBao: HienThongBao;
};

const taoDuLieuFormDonVi = (
  donViCanSua: DonViSanPham | null,
): DonViSanPhamForm => {
  if (donViCanSua) {
    return {
      maDonViTinh: String(
        donViCanSua.maDonViTinh,
      ),

      giaBanTheoDonVi:
        donViCanSua.giaBanTheoDonVi !==
        null
          ? String(
              donViCanSua.giaBanTheoDonVi,
            )
          : "",

      laDonViCoSo:
        donViCanSua.laDonViCoSo,

      choPhepBan:
        donViCanSua.choPhepBan,

      choPhepNhap:
        donViCanSua.choPhepNhap,
    };
  }

  return {
    maDonViTinh: "",
    giaBanTheoDonVi: "",
    laDonViCoSo: false,
    choPhepBan: true,
    choPhepNhap: true,
  };
};

function DonViSanPhamFormModal(
  props: DonViSanPhamFormModalProps,
) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <DonViSanPhamFormNoiDung
      key={
        props.donViCanSua
          ?.maDonViSanPham
        ?? "them-moi"
      }
      {...props}
    />
  );
}

function DonViSanPhamFormNoiDung({
  maSanPham,
  donViCanSua,
  onClose,
  onSuccess,
  onThongBao,
}: DonViSanPhamFormModalProps) {
  const [
    formData,
    setFormData,
  ] = useState<DonViSanPhamForm>(
    () =>
      taoDuLieuFormDonVi(
        donViCanSua,
      ),
  );

  const [
    danhSachDonViTinh,
    setDanhSachDonViTinh,
  ] = useState<
    DonViTinhOption[]
  >([]);

  const [
    dangLuu,
    setDangLuu,
  ] = useState(false);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSachDonViTinh =
      async () => {
        try {
          const response =
            await layDanhSachDonViTinh();

          if (daHuy) {
            return;
          }

          setDanhSachDonViTinh(
            response.data,
          );
        } catch (error) {
          if (daHuy) {
            return;
          }

          console.error(
            "Lỗi khi lấy danh sách đơn vị tính:",
            error,
          );

          onThongBao(
            "Không thể tải danh sách đơn vị tính.",
            "LOI",
            "Không thể tải dữ liệu",
          );
        }
      };

    void taiDanhSachDonViTinh();

    return () => {
      daHuy = true;
    };
  }, []);

  const xuLyThayDoiInput = (
    event:
      ChangeEvent<
        | HTMLInputElement
        | HTMLSelectElement
      >,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const xuLyThayDoiCheckbox = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      name,
      checked,
    } = event.target;

    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const hienCanhBao = (
    noiDung: string,
  ) => {
    onThongBao(
      noiDung,
      "CANH_BAO",
      "Dữ liệu chưa hợp lệ",
    );
  };

  const xuLySubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!formData.maDonViTinh) {
      hienCanhBao(
        "Vui lòng chọn đơn vị tính.",
      );

      return;
    }

    if (
      formData.giaBanTheoDonVi
      && Number(
        formData.giaBanTheoDonVi,
      ) < 0
    ) {
      hienCanhBao(
        "Giá bán theo đơn vị không được nhỏ hơn 0.",
      );

      return;
    }

    const duLieuGuiLen = {
      maSanPham,

      maDonViTinh:
        Number(
          formData.maDonViTinh,
        ),

      giaBanTheoDonVi:
        formData.giaBanTheoDonVi
          ? Number(
              formData.giaBanTheoDonVi,
            )
          : null,

      laDonViCoSo:
        formData.laDonViCoSo,

      choPhepBan:
        formData.choPhepBan,

      choPhepNhap:
        formData.choPhepNhap,
    };

    try {
      setDangLuu(true);

      if (donViCanSua) {
        await capNhatDonViSanPham(
          donViCanSua.maDonViSanPham,
          duLieuGuiLen,
        );
      } else {
        await themDonViSanPham(
          duLieuGuiLen,
        );
      }

      await onSuccess();

      onClose();

      onThongBao(
        donViCanSua
          ? "Cập nhật đơn vị sản phẩm thành công."
          : "Thêm đơn vị sản phẩm thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi lưu đơn vị sản phẩm:",
        error,
      );

      onThongBao(
        "Lưu đơn vị sản phẩm thất bại. Có thể sản phẩm đã có đơn vị này hoặc đã có đơn vị cơ sở.",
        "LOI",
        "Không thể lưu đơn vị sản phẩm",
      );
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card unit-form-modal">
        <div className="modal-header">
          <div>
            <h2>
              {donViCanSua
                ? "Cập nhật đơn vị sản phẩm"
                : "Thêm đơn vị sản phẩm"}
            </h2>

            <p>
              Cấu hình đơn vị bán,
              đơn vị nhập và đơn vị
              cơ sở cho sản phẩm.
            </p>
          </div>

          <button
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={xuLySubmit}>
          <div className="form-group">
            <label>
              Đơn vị tính
            </label>

            <select
              name="maDonViTinh"
              value={
                formData.maDonViTinh
              }
              onChange={
                xuLyThayDoiInput
              }
              required
            >
              <option value="">
                -- Chọn đơn vị tính --
              </option>

              {danhSachDonViTinh
                .filter(
                  (donViTinh) =>
                    donViTinh.trangThai,
                )
                .map(
                  (donViTinh) => (
                    <option
                      key={
                        donViTinh.maDonViTinh
                      }
                      value={
                        donViTinh.maDonViTinh
                      }
                    >
                      {
                        donViTinh.tenDonViTinh
                      }

                      {donViTinh.kyHieu
                        ? ` (${donViTinh.kyHieu})`
                        : ""}
                    </option>
                  ),
                )}
            </select>
          </div>

          <div className="form-group">
            <label>
              Giá bán theo đơn vị
            </label>

            <input
              type="number"
              name="giaBanTheoDonVi"
              value={
                formData.giaBanTheoDonVi
              }
              onChange={
                xuLyThayDoiInput
              }
              placeholder="Có thể để trống nếu đơn vị này không bán trực tiếp"
              min={0}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="laDonViCoSo"
              checked={
                formData.laDonViCoSo
              }
              onChange={
                xuLyThayDoiCheckbox
              }
            />

            <label>
              Là đơn vị cơ sở
            </label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="choPhepBan"
              checked={
                formData.choPhepBan
              }
              onChange={
                xuLyThayDoiCheckbox
              }
            />

            <label>
              Cho phép bán theo đơn vị này
            </label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="choPhepNhap"
              checked={
                formData.choPhepNhap
              }
              onChange={
                xuLyThayDoiCheckbox
              }
            />

            <label>
              Cho phép nhập kho theo đơn vị này
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={dangLuu}
            >
              {dangLuu
                ? "Đang lưu..."
                : donViCanSua
                  ? "Cập nhật"
                  : "Lưu đơn vị"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={dangLuu}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonViSanPhamFormModal;
