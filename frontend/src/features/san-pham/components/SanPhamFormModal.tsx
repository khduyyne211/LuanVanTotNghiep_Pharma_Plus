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
import SanPhamThongTinStep from "./form-san-pham/SanPhamThongTinStep";
import type { SanPhamThongTinFormData } from "./form-san-pham/SanPhamThongTinStep";
import SanPhamDonViStep from "./form-san-pham/SanPhamDonViStep";
import type { SanPhamDonViFormData } from "./form-san-pham/SanPhamDonViStep";
import SanPhamQuyDoiStep from "./form-san-pham/SanPhamQuyDoiStep";
import type { SanPhamQuyDoiFormData } from "./form-san-pham/SanPhamQuyDoiStep";


type SanPhamForm = SanPhamThongTinFormData;
type DonViTaoMoiForm = SanPhamDonViFormData;
type QuyDoiTaoMoiForm = SanPhamQuyDoiFormData;

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
      laThuocKeDon: sanPhamCanSua.laThuocKeDon,
    };
  }

  return {
    maDanhMuc: "",
    maNhaSanXuat: "",
    tenSanPham: "",
    hinhAnh: "",
    moTaNgan: "",
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
          <SanPhamThongTinStep
            formData={formData}
            danhSachDanhMuc={danhSachDanhMuc}
            danhSachNhaSanXuat={danhSachNhaSanXuat}
            laThemMoi={laThemMoi}
            dangLuu={dangLuu}
            onSubmit={
              laThemMoi
                ? (event) => {
                    event.preventDefault();
                    sangBuoc2();
                  }
                : xuLyCapNhatSanPham
            }
            onInputChange={xuLyThayDoiInput}
            onCheckboxChange={xuLyThayDoiCheckbox}
            onClose={onClose}
          />
        )}
        {laThemMoi && buocHienTai === 2 && (
          <SanPhamDonViStep
            danhSachDonVi={danhSachDonVi}
            donViTinhDangDung={donViTinhDangDung}
            onCapNhatDonVi={capNhatDonVi}
            onChonDonViCoSo={chonDonViCoSo}
            onThemDongDonVi={themDongDonVi}
            onXoaDongDonVi={xoaDongDonVi}
            onQuayLai={() => setBuocHienTai(1)}
            onTiepTuc={sangBuoc3}
          />
        )}

        {laThemMoi && buocHienTai === 3 && (
          <SanPhamQuyDoiStep
            danhSachQuyDoi={danhSachQuyDoi}
            donViDaChon={donViDaChon}
            dangLuu={dangLuu}
            onCapNhatQuyDoi={capNhatQuyDoi}
            onThemDongQuyDoi={themDongQuyDoi}
            onXoaDongQuyDoi={xoaDongQuyDoi}
            onQuayLai={() => setBuocHienTai(2)}
            onHoanTat={() =>
              void xuLyTaoSanPhamDayDu()
            }
          />
        )}
      </div>
    </div>
  );
}

export default SanPhamFormModal;