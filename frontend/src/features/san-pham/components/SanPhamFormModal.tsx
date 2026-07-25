import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type {
  DanhMucSanPhamOption,
  DonViTinhOption,
  NhaSanXuatOption,
  SanPham,
} from "../types/SanPham";
import "../styles/SanPhamTaoDayDuModal.css";
import {
  capNhatSanPham,
  layDanhSachDanhMucSanPham,
  layDanhSachDonViTinh,
  layDanhSachNhaSanXuat,
  taoSanPhamDayDu,
} from "../api/sanPhamApi";
import type {
  SanPhamRequest,
  SanPhamTaoDayDuRequest,
} from "../api/sanPhamApi";
type SanPhamForm = {
  maDanhMuc: string;
  maNhaSanXuat: string;
  tenSanPham: string;
  hinhAnh: string;
  moTaNgan: string;
  giaBan: string;
  laThuocKeDon: boolean;
};

type DonViTaoMoiForm = {
  maDonViTinh: string;
  giaBanTheoDonVi: string;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
};

type QuyDoiTaoMoiForm = {
  maDonViTinhNguon: string;
  soLuongNguon: string;
  maDonViTinhDich: string;
  soLuongDich: string;
};

type SanPhamFormModalProps = {
  isOpen: boolean;
  sanPhamCanSua: SanPham | null;
  onClose: () => void;
  onSuccess: (
    sanPhamDaLuu: SanPham,
    laThemMoi: boolean
  ) => Promise<void>;
};

const taoDuLieuFormSanPham = (
  sanPhamCanSua: SanPham | null
): SanPhamForm => {
  if (sanPhamCanSua) {
    return {
      maDanhMuc: String(sanPhamCanSua.maDanhMuc),
      maNhaSanXuat:
        sanPhamCanSua.maNhaSanXuat !== null
          ? String(sanPhamCanSua.maNhaSanXuat)
          : "",
      tenSanPham: sanPhamCanSua.tenSanPham,
      hinhAnh: sanPhamCanSua.hinhAnh || "",
      moTaNgan: sanPhamCanSua.moTaNgan || "",
      giaBan: String(sanPhamCanSua.giaBan),
      laThuocKeDon: sanPhamCanSua.laThuocKeDon,
    };
  }

  return {
    maDanhMuc: "",
    maNhaSanXuat: "",
    tenSanPham: "",
    hinhAnh: "",
    moTaNgan: "",
    giaBan: "",
    laThuocKeDon: false,
  };
};

const taoDonViMacDinh = (): DonViTaoMoiForm => ({
  maDonViTinh: "",
  giaBanTheoDonVi: "",
  laDonViCoSo: true,
  choPhepBan: true,
  choPhepNhap: true,
});

function SanPhamFormModal(props: SanPhamFormModalProps) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <SanPhamFormNoiDung
      key={props.sanPhamCanSua?.maSanPham ?? "them-moi"}
      {...props}
    />
  );
}

function SanPhamFormNoiDung({
  sanPhamCanSua,
  onClose,
  onSuccess,
}: SanPhamFormModalProps) {
  const laThemMoi = sanPhamCanSua === null;

  const [buocHienTai, setBuocHienTai] = useState(1);
  const [formData, setFormData] = useState<SanPhamForm>(() =>
    taoDuLieuFormSanPham(sanPhamCanSua)
  );

  const [danhSachDonVi, setDanhSachDonVi] = useState<
    DonViTaoMoiForm[]
  >(() => [taoDonViMacDinh()]);

  const [danhSachQuyDoi, setDanhSachQuyDoi] = useState<
    QuyDoiTaoMoiForm[]
  >([]);

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<
    DanhMucSanPhamOption[]
  >([]);

  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<
    NhaSanXuatOption[]
  >([]);

  const [danhSachDonViTinh, setDanhSachDonViTinh] = useState<
    DonViTinhOption[]
  >([]);

  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    let daHuy = false;

    const layDuLieuDropdown = async () => {
      try {
        const [
          danhMucResponse,
          nhaSanXuatResponse,
          donViTinhResponse,
        ] = await Promise.all([
          layDanhSachDanhMucSanPham(),
          layDanhSachNhaSanXuat(),
          layDanhSachDonViTinh(),
        ]);
        if (daHuy) {
          return;
        }

        setDanhSachDanhMuc(danhMucResponse.data);
        setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
        setDanhSachDonViTinh(donViTinhResponse.data);
      } catch (error) {
        if (daHuy) {
          return;
        }

        console.error("Lỗi khi tải dữ liệu form sản phẩm:", error);
        alert(
          "Không thể tải danh mục, nhà sản xuất hoặc đơn vị tính"
        );
      }
    };

    void layDuLieuDropdown();

    return () => {
      daHuy = true;
    };
  }, []);

  const donViTinhDangDung = useMemo(
    () => danhSachDonViTinh.filter((donVi) => donVi.trangThai),
    [danhSachDonViTinh]
  );

  const donViDaChon = useMemo(
    () =>
      danhSachDonVi
        .filter((donVi) => donVi.maDonViTinh)
        .map((donVi) => ({
          maDonViTinh: donVi.maDonViTinh,
          tenDonViTinh:
            donViTinhDangDung.find(
              (item) =>
                String(item.maDonViTinh) ===
                donVi.maDonViTinh
            )?.tenDonViTinh ?? "Đơn vị",
        })),
    [danhSachDonVi, donViTinhDangDung]
  );

  const xuLyThayDoiInput = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((duLieuCu) => ({
      ...duLieuCu,
      [name]: value,
    }));
  };

  const xuLyThayDoiCheckbox = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    setFormData((duLieuCu) => ({
      ...duLieuCu,
      [name]: checked,
    }));
  };

  const capNhatDonVi = (
    index: number,
    field: keyof DonViTaoMoiForm,
    value: string | boolean
  ) => {
    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.map((donVi, viTri) =>
        viTri === index
          ? { ...donVi, [field]: value }
          : donVi
      )
    );
  };

  const chonDonViCoSo = (index: number) => {
    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.map((donVi, viTri) => ({
        ...donVi,
        laDonViCoSo: viTri === index,
      }))
    );
  };

  const themDongDonVi = () => {
    setDanhSachDonVi((danhSachCu) => [
      ...danhSachCu,
      {
        maDonViTinh: "",
        giaBanTheoDonVi: "",
        laDonViCoSo: false,
        choPhepBan: true,
        choPhepNhap: true,
      },
    ]);
  };

  const xoaDongDonVi = (index: number) => {
    if (danhSachDonVi.length === 1) {
      alert("Sản phẩm phải có ít nhất một đơn vị");
      return;
    }

    const maDonViBiXoa = danhSachDonVi[index].maDonViTinh;
    const donViBiXoaLaCoSo =
      danhSachDonVi[index].laDonViCoSo;

    setDanhSachDonVi((danhSachCu) => {
      const danhSachMoi = danhSachCu.filter(
        (_, viTri) => viTri !== index
      );

      if (
        donViBiXoaLaCoSo &&
        danhSachMoi.length > 0
      ) {
        danhSachMoi[0] = {
          ...danhSachMoi[0],
          laDonViCoSo: true,
        };
      }

      return danhSachMoi;
    });

    if (maDonViBiXoa) {
      setDanhSachQuyDoi((danhSachCu) =>
        danhSachCu.filter(
          (quyDoi) =>
            quyDoi.maDonViTinhNguon !== maDonViBiXoa &&
            quyDoi.maDonViTinhDich !== maDonViBiXoa
        )
      );
    }
  };

  const capNhatQuyDoi = (
    index: number,
    field: keyof QuyDoiTaoMoiForm,
    value: string
  ) => {
    setDanhSachQuyDoi((danhSachCu) =>
      danhSachCu.map((quyDoi, viTri) =>
        viTri === index
          ? { ...quyDoi, [field]: value }
          : quyDoi
      )
    );
  };

  const themDongQuyDoi = () => {
    const maDonViCoSo =
      danhSachDonVi.find((donVi) => donVi.laDonViCoSo)
        ?.maDonViTinh ?? "";

    const maDonViNguon =
      danhSachDonVi.find(
        (donVi) =>
          donVi.maDonViTinh &&
          donVi.maDonViTinh !== maDonViCoSo
      )?.maDonViTinh ?? "";

    setDanhSachQuyDoi((danhSachCu) => [
      ...danhSachCu,
      {
        maDonViTinhNguon: maDonViNguon,
        soLuongNguon: "1",
        maDonViTinhDich: maDonViCoSo,
        soLuongDich: "",
      },
    ]);
  };

  const xoaDongQuyDoi = (index: number) => {
    setDanhSachQuyDoi((danhSachCu) =>
      danhSachCu.filter((_, viTri) => viTri !== index)
    );
  };

  const kiemTraThongTinSanPham = () => {
    if (!formData.maDanhMuc) {
      alert("Vui lòng chọn danh mục sản phẩm");
      return false;
    }

    if (!formData.tenSanPham.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return false;
    }

    if (
      !formData.giaBan ||
      Number(formData.giaBan) <= 0
    ) {
      alert("Giá bán mặc định phải lớn hơn 0");
      return false;
    }

    return true;
  };

  const kiemTraDanhSachDonVi = () => {
    if (danhSachDonVi.length === 0) {
      alert("Sản phẩm phải có ít nhất một đơn vị");
      return false;
    }

    const maDonViDaChon = new Set<string>();
    let soDonViCoSo = 0;

    for (const donVi of danhSachDonVi) {
      if (!donVi.maDonViTinh) {
        alert("Vui lòng chọn đơn vị tính cho tất cả các dòng");
        return false;
      }

      if (maDonViDaChon.has(donVi.maDonViTinh)) {
        alert("Không được chọn trùng đơn vị tính");
        return false;
      }

      maDonViDaChon.add(donVi.maDonViTinh);

      if (donVi.laDonViCoSo) {
        soDonViCoSo++;
      }

      if (
        donVi.choPhepBan &&
        (!donVi.giaBanTheoDonVi ||
          Number(donVi.giaBanTheoDonVi) <= 0)
      ) {
        alert(
          "Đơn vị được phép bán phải có giá bán lớn hơn 0"
        );
        return false;
      }
    }

    if (soDonViCoSo !== 1) {
      alert("Sản phẩm phải có đúng một đơn vị cơ sở");
      return false;
    }

    return true;
  };

  const kiemTraDanhSachQuyDoi = () => {
    if (
      danhSachDonVi.length >= 2 &&
      danhSachQuyDoi.length === 0
    ) {
      alert(
        "Sản phẩm có từ hai đơn vị phải có ít nhất một quy đổi"
      );
      return false;
    }

    const capQuyDoiDaChon = new Set<string>();

    for (const quyDoi of danhSachQuyDoi) {
      if (
        !quyDoi.maDonViTinhNguon ||
        !quyDoi.maDonViTinhDich
      ) {
        alert("Vui lòng chọn đầy đủ đơn vị nguồn và đích");
        return false;
      }

      if (
        quyDoi.maDonViTinhNguon ===
        quyDoi.maDonViTinhDich
      ) {
        alert(
          "Đơn vị nguồn và đơn vị đích không được giống nhau"
        );
        return false;
      }

      if (
        !quyDoi.soLuongNguon ||
        Number(quyDoi.soLuongNguon) <= 0 ||
        !quyDoi.soLuongDich ||
        Number(quyDoi.soLuongDich) <= 0
      ) {
        alert("Số lượng quy đổi phải lớn hơn 0");
        return false;
      }

      const capQuyDoi =
        `${quyDoi.maDonViTinhNguon}-` +
        `${quyDoi.maDonViTinhDich}`;

      if (capQuyDoiDaChon.has(capQuyDoi)) {
        alert("Không được khai báo trùng cùng một quy đổi");
        return false;
      }

      capQuyDoiDaChon.add(capQuyDoi);
    }

    return true;
  };

  const sangBuoc2 = () => {
    if (kiemTraThongTinSanPham()) {
      setBuocHienTai(2);
    }
  };

  const sangBuoc3 = () => {
    if (!kiemTraDanhSachDonVi()) {
      return;
    }

    if (
      danhSachDonVi.length >= 2 &&
      danhSachQuyDoi.length === 0
    ) {
      const maDonViCoSo =
        danhSachDonVi.find(
          (donVi) => donVi.laDonViCoSo
        )?.maDonViTinh ?? "";

      const maDonViNguon =
        danhSachDonVi.find(
          (donVi) =>
            donVi.maDonViTinh &&
            donVi.maDonViTinh !== maDonViCoSo
        )?.maDonViTinh ?? "";

      setDanhSachQuyDoi([
        {
          maDonViTinhNguon: maDonViNguon,
          soLuongNguon: "1",
          maDonViTinhDich: maDonViCoSo,
          soLuongDich: "",
        },
      ]);
    }

    setBuocHienTai(3);
  };

  const taoThongTinSanPhamGuiLen = (): SanPhamRequest => ({
    maDanhMuc: Number(formData.maDanhMuc),
    maNhaSanXuat: formData.maNhaSanXuat
      ? Number(formData.maNhaSanXuat)
      : null,
    tenSanPham: formData.tenSanPham.trim(),
    hinhAnh: formData.hinhAnh.trim() || null,
    giaBan: Number(formData.giaBan),
    laThuocKeDon: formData.laThuocKeDon,
    moTaNgan: formData.moTaNgan.trim() || null,
  });

  const xuLyCapNhatSanPham = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!sanPhamCanSua || !kiemTraThongTinSanPham()) {
      return;
    }

    try {
      setDangLuu(true);

      const response = await capNhatSanPham(
        sanPhamCanSua.maSanPham,
        taoThongTinSanPhamGuiLen()
      );

      await onSuccess(response.data, false);
      onClose();
      alert("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Cập nhật sản phẩm thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  const xuLyTaoSanPhamDayDu = async () => {
    if (
      !kiemTraThongTinSanPham() ||
      !kiemTraDanhSachDonVi() ||
      !kiemTraDanhSachQuyDoi()
    ) {
      return;
    }

    const duLieuGuiLen: SanPhamTaoDayDuRequest = {
      thongTinSanPham: taoThongTinSanPhamGuiLen(),
      danhSachDonVi: danhSachDonVi.map((donVi) => ({
        maDonViTinh: Number(donVi.maDonViTinh),
        giaBanTheoDonVi: donVi.giaBanTheoDonVi
          ? Number(donVi.giaBanTheoDonVi)
          : null,
        laDonViCoSo: donVi.laDonViCoSo,
        choPhepBan: donVi.choPhepBan,
        choPhepNhap: donVi.choPhepNhap,
      })),
      danhSachQuyDoi: danhSachQuyDoi.map((quyDoi) => ({
        maDonViTinhNguon: Number(
          quyDoi.maDonViTinhNguon
        ),
        soLuongNguon: Number(quyDoi.soLuongNguon),
        maDonViTinhDich: Number(
          quyDoi.maDonViTinhDich
        ),
        soLuongDich: Number(quyDoi.soLuongDich),
      })),
    };

    try {
      setDangLuu(true);

      const response = await taoSanPhamDayDu(duLieuGuiLen);
      await onSuccess(response.data, true);
      onClose();
      alert(
        "Đã tạo sản phẩm, đơn vị sản phẩm và quy đổi thành công"
      );
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm đầy đủ:", error);
      alert(
        "Tạo sản phẩm thất bại. Toàn bộ dữ liệu đã được rollback."
      );
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card product-full-form-modal">
        <div className="modal-header">
          <div>
            <h2>
              {laThemMoi
                ? "Thêm sản phẩm đầy đủ"
                : "Cập nhật sản phẩm"}
            </h2>
            <p>
              {laThemMoi
                ? "Nhập thông tin, đơn vị và quy đổi trong cùng một lần tạo."
                : "Cập nhật thông tin chung của sản phẩm."}
            </p>
          </div>

          <button
            className="modal-close-button"
            onClick={onClose}
            type="button"
            title="Đóng"
            aria-label="Đóng"
            disabled={dangLuu}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {laThemMoi && (
          <div className="product-stepper">
            <div
              className={
                buocHienTai >= 1
                  ? "product-step active"
                  : "product-step"
              }
            >
              <span>1</span>
              Thông tin
            </div>

            <div
              className={
                buocHienTai >= 2
                  ? "product-step active"
                  : "product-step"
              }
            >
              <span>2</span>
              Đơn vị
            </div>

            <div
              className={
                buocHienTai >= 3
                  ? "product-step active"
                  : "product-step"
              }
            >
              <span>3</span>
              Quy đổi
            </div>
          </div>
        )}

        {buocHienTai === 1 && (
          <form
            onSubmit={
              laThemMoi
                ? (event) => {
                    event.preventDefault();
                    sangBuoc2();
                  }
                : xuLyCapNhatSanPham
            }
          >
            <div className="product-form-grid">
              <div className="form-group">
                <label>Danh mục sản phẩm</label>
                <select
                  name="maDanhMuc"
                  value={formData.maDanhMuc}
                  onChange={xuLyThayDoiInput}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>

                  {danhSachDanhMuc
                    .filter((dm) => dm.trangThaiHienThi)
                    .map((dm) => (
                      <option
                        key={dm.maDanhMuc}
                        value={dm.maDanhMuc}
                      >
                        {dm.tenDanhMuc}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nhà sản xuất</label>
                <select
                  name="maNhaSanXuat"
                  value={formData.maNhaSanXuat}
                  onChange={xuLyThayDoiInput}
                >
                  <option value="">
                    -- Chưa chọn nhà sản xuất --
                  </option>

                  {danhSachNhaSanXuat
                    .filter((nsx) => nsx.trangThai)
                    .map((nsx) => (
                      <option
                        key={nsx.maNhaSanXuat}
                        value={nsx.maNhaSanXuat}
                      >
                        {nsx.tenNhaSanXuat}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group product-form-full-row">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  name="tenSanPham"
                  value={formData.tenSanPham}
                  onChange={xuLyThayDoiInput}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá bán mặc định</label>
                <input
                  type="number"
                  name="giaBan"
                  value={formData.giaBan}
                  onChange={xuLyThayDoiInput}
                  placeholder="Nhập giá bán"
                  min={1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Đường dẫn hình ảnh</label>
                <input
                  type="text"
                  name="hinhAnh"
                  value={formData.hinhAnh}
                  onChange={xuLyThayDoiInput}
                  placeholder="/images/products/san-pham.webp"
                />
              </div>

              <div className="form-group product-form-full-row">
                <label>Mô tả ngắn</label>
                <textarea
                  name="moTaNgan"
                  value={formData.moTaNgan}
                  onChange={xuLyThayDoiInput}
                  placeholder="Nhập mô tả ngắn"
                  rows={3}
                />
              </div>

              <label className="product-inline-checkbox">
                <input
                  type="checkbox"
                  name="laThuocKeDon"
                  checked={formData.laThuocKeDon}
                  onChange={xuLyThayDoiCheckbox}
                />
                Là thuốc kê đơn
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={dangLuu}
              >
                <i className="bi bi-x-circle" />
                Hủy
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={dangLuu}
              >
                {laThemMoi ? (
                  <>
                    Tiếp tục
                    <i className="bi bi-arrow-right" />
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle" />
                    {dangLuu ? "Đang lưu..." : "Cập nhật"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {laThemMoi && buocHienTai === 2 && (
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
                onClick={themDongDonVi}
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
                            capNhatDonVi(
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
                            capNhatDonVi(
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
                          onChange={() => chonDonViCoSo(index)}
                          title="Chọn làm đơn vị cơ sở"
                        />
                      </td>

                      <td className="product-center-cell">
                        <input
                          type="checkbox"
                          checked={donVi.choPhepBan}
                          onChange={(event) =>
                            capNhatDonVi(
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
                            capNhatDonVi(
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
                          onClick={() => xoaDongDonVi(index)}
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
                onClick={() => setBuocHienTai(1)}
              >
                <i className="bi bi-arrow-left" />
                Quay lại
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={sangBuoc3}
              >
                Tiếp tục
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {laThemMoi && buocHienTai === 3 && (
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
                onClick={themDongQuyDoi}
                disabled={donViDaChon.length < 2}
              >
                <i className="bi bi-plus-circle" />
                Thêm quy đổi
              </button>
            </div>

            {donViDaChon.length === 1 ? (
              <div className="product-empty-note">
                Sản phẩm chỉ có một đơn vị nên không cần khai
                báo quy đổi.
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
                            value={
                              quyDoi.maDonViTinhNguon
                            }
                            onChange={(event) =>
                              capNhatQuyDoi(
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
                              capNhatQuyDoi(
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
                              capNhatQuyDoi(
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
                              capNhatQuyDoi(
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
                              xoaDongQuyDoi(index)
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
                onClick={() => setBuocHienTai(2)}
                disabled={dangLuu}
              >
                <i className="bi bi-arrow-left" />
                Quay lại
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => void xuLyTaoSanPhamDayDu()}
                disabled={dangLuu}
              >
                <i className="bi bi-check-circle" />
                {dangLuu
                  ? "Đang tạo..."
                  : "Hoàn tất tạo sản phẩm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SanPhamFormModal;