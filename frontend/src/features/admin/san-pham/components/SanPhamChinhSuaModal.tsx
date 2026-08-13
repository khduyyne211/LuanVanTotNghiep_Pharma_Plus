import { useEffect, useMemo, useState } from "react";

import AdminLoading from "../../shared/components/loading/AdminLoading";

import type { HoatChat } from "../../hoat-chat/types/HoatChat";
import { layDanhSachHoatChat } from "../../hoat-chat/api/hoatChatApi";

import type {
  DanhMucSanPhamOption,
  DonViTinhOption,
  NhaSanXuatOption,
  SanPham,
} from "../types/SanPham";

import type {
  DonViSanPhamCapNhatRequest,
  DuLieuChuyenMonThuocRequest,
  QuyDoiDonViCapNhatRequest,
  SanPhamRequest,
  ThanhPhanHoatChatTaoMoiRequest,
} from "../api/sanPhamApi";

import {
  capNhatDanhSachDonViSanPham,
  capNhatDanhSachQuyDoiDonVi,
  capNhatDuLieuChuyenMonThuoc,
  capNhatSanPham,
  capNhatThanhPhanHoatChat,
  layChiTietSanPhamDayDu,
  layDanhSachDanhMucSanPham,
  layDanhSachDonViTinh,
  layDanhSachNhaSanXuat,
} from "../api/sanPhamApi";

import "../styles/SanPhamFormModal.css";

type TabChinhSua =
  | "thong-tin"
  | "don-vi"
  | "quy-doi"
  | "hoat-chat"
  | "chuyen-mon";

type ThongTinForm = {
  maDanhMuc: string;
  maNhaSanXuat: string;
  tenSanPham: string;
  hinhAnh: string;
  moTaNgan: string;
  laThuocKeDon: boolean;
};

type DonViForm = {
  maDonViSanPham: number | null;
  maDonViTinh: string;
  giaBanTheoDonVi: string;
  laDonViCoSo: boolean;
  choPhepBan: boolean;
  choPhepNhap: boolean;
  trangThai: boolean;
};

type QuyDoiForm = {
  maQuyDoi: number | null;
  maDonViNguon: string;
  soLuongNguon: string;
  maDonViDich: string;
  soLuongDich: string;
  trangThai: boolean;
};

type ThanhPhanForm = {
  maHoatChat: string;
  hamLuong: string;
  donViHamLuong: string;
  vaiTroHoatChat: string;
  ghiChu: string;
};

type DuLieuChuyenMonForm = {
  dangBaoChe: string;
  phanLoaiThuoc: string;
  congDungThamKhao: string;
  cachDungThamKhao: string;
  canhBaoAnToan: string;
};

type SanPhamChinhSuaModalProps = {
  sanPhamCanSua: SanPham;
  onClose: () => void;
  onSuccess: (sanPhamDaLuu: SanPham, laThemMoi: boolean) => Promise<void>;
};

const danhSachTab: {
  ma: TabChinhSua;
  nhan: string;
  icon: string;
}[] = [
  {
    ma: "thong-tin",
    nhan: "Sản phẩm",
    icon: "bi bi-box-seam",
  },
  {
    ma: "don-vi",
    nhan: "Đơn vị tính",
    icon: "bi bi-rulers",
  },
  {
    ma: "quy-doi",
    nhan: "Quy đổi",
    icon: "bi bi-arrow-left-right",
  },
  {
    ma: "hoat-chat",
    nhan: "Hoạt chất",
    icon: "bi bi-capsule",
  },
  {
    ma: "chuyen-mon",
    nhan: "Dữ liệu chuyên môn",
    icon: "bi bi-journal-medical",
  },
];

const taoThanhPhanRong = (): ThanhPhanForm => ({
  maHoatChat: "",
  hamLuong: "",
  donViHamLuong: "",
  vaiTroHoatChat: "",
  ghiChu: "",
});

const taoDuLieuChuyenMonRong = (): DuLieuChuyenMonForm => ({
  dangBaoChe: "",
  phanLoaiThuoc: "",
  congDungThamKhao: "",
  cachDungThamKhao: "",
  canhBaoAnToan: "",
});

function SanPhamChinhSuaModal({
  sanPhamCanSua,
  onClose,
  onSuccess,
}: SanPhamChinhSuaModalProps) {
  const [tabHienTai, setTabHienTai] = useState<TabChinhSua>("thong-tin");

  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);

  const [sanPhamChiTiet, setSanPhamChiTiet] = useState<SanPham | null>(null);

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<
    DanhMucSanPhamOption[]
  >([]);

  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<
    NhaSanXuatOption[]
  >([]);

  const [danhSachDonViTinh, setDanhSachDonViTinh] = useState<DonViTinhOption[]>(
    [],
  );

  const [danhSachHoatChat, setDanhSachHoatChat] = useState<HoatChat[]>([]);

  const [thongTinForm, setThongTinForm] = useState<ThongTinForm>({
    maDanhMuc: "",
    maNhaSanXuat: "",
    tenSanPham: "",
    hinhAnh: "",
    moTaNgan: "",
    laThuocKeDon: false,
  });

  const [danhSachDonVi, setDanhSachDonVi] = useState<DonViForm[]>([]);

  const [danhSachQuyDoi, setDanhSachQuyDoi] = useState<QuyDoiForm[]>([]);

  const [danhSachThanhPhan, setDanhSachThanhPhan] = useState<ThanhPhanForm[]>(
    [],
  );

  const [duLieuChuyenMon, setDuLieuChuyenMon] = useState<DuLieuChuyenMonForm>(
    taoDuLieuChuyenMonRong,
  );

  const apDungChiTiet = (sanPham: SanPham) => {
    setSanPhamChiTiet(sanPham);

    setThongTinForm({
      maDanhMuc: String(sanPham.maDanhMuc),
      maNhaSanXuat:
        sanPham.maNhaSanXuat !== null ? String(sanPham.maNhaSanXuat) : "",
      tenSanPham: sanPham.tenSanPham,
      hinhAnh: sanPham.hinhAnh ?? "",
      moTaNgan: sanPham.moTaNgan ?? "",
      laThuocKeDon: sanPham.laThuocKeDon,
    });

    setDanhSachDonVi(
      (sanPham.danhSachDonViSanPham ?? []).map((donVi) => ({
        maDonViSanPham: donVi.maDonViSanPham,
        maDonViTinh: String(donVi.maDonViTinh),
        giaBanTheoDonVi:
          donVi.giaBanTheoDonVi !== null ? String(donVi.giaBanTheoDonVi) : "",
        laDonViCoSo: donVi.laDonViCoSo,
        choPhepBan: donVi.choPhepBan,
        choPhepNhap: donVi.choPhepNhap,
        trangThai: donVi.trangThai,
      })),
    );

    setDanhSachQuyDoi(
      (sanPham.danhSachQuyDoiDonVi ?? []).map((quyDoi) => ({
        maQuyDoi: quyDoi.maQuyDoi,
        maDonViNguon: String(quyDoi.maDonViNguon),
        soLuongNguon: String(quyDoi.soLuongNguon),
        maDonViDich: String(quyDoi.maDonViDich),
        soLuongDich: String(quyDoi.soLuongDich),
        trangThai: quyDoi.trangThai,
      })),
    );

    const thanhPhan = sanPham.danhSachThanhPhanHoatChat ?? [];

    setDanhSachThanhPhan(
      thanhPhan.length > 0
        ? thanhPhan.map((item) => ({
            maHoatChat: String(item.maHoatChat),
            hamLuong: String(item.hamLuong),
            donViHamLuong: item.donViHamLuong ?? "",
            vaiTroHoatChat: item.vaiTroHoatChat ?? "",
            ghiChu: item.ghiChu ?? "",
          }))
        : [taoThanhPhanRong()],
    );

    const chuyenMon = sanPham.duLieuChuyenMonThuoc;

    setDuLieuChuyenMon(
      chuyenMon
        ? {
            dangBaoChe: chuyenMon.dangBaoChe ?? "",
            phanLoaiThuoc: chuyenMon.phanLoaiThuoc ?? "",
            congDungThamKhao: chuyenMon.congDungThamKhao ?? "",
            cachDungThamKhao: chuyenMon.cachDungThamKhao ?? "",
            canhBaoAnToan: chuyenMon.canhBaoAnToan ?? "",
          }
        : taoDuLieuChuyenMonRong(),
    );
  };

  const taiLaiChiTiet = async () => {
    const response = await layChiTietSanPhamDayDu(sanPhamCanSua.maSanPham);

    apDungChiTiet(response.data);
    return response.data;
  };

  useEffect(() => {
    let daHuy = false;

    const taiDuLieu = async () => {
      try {
        setDangTai(true);

        const [
          chiTietResponse,
          danhMucResponse,
          nhaSanXuatResponse,
          donViTinhResponse,
          hoatChatResponse,
        ] = await Promise.all([
          layChiTietSanPhamDayDu(sanPhamCanSua.maSanPham),
          layDanhSachDanhMucSanPham(),
          layDanhSachNhaSanXuat(),
          layDanhSachDonViTinh(),
          layDanhSachHoatChat(),
        ]);

        if (daHuy) {
          return;
        }

        setDanhSachDanhMuc(danhMucResponse.data);
        setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
        setDanhSachDonViTinh(donViTinhResponse.data);
        setDanhSachHoatChat(hoatChatResponse.data);

        apDungChiTiet(chiTietResponse.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sửa sản phẩm:", error);
        alert("Không thể tải đầy đủ dữ liệu sản phẩm");
        onClose();
      } finally {
        if (!daHuy) {
          setDangTai(false);
        }
      }
    };

    void taiDuLieu();

    return () => {
      daHuy = true;
    };
  }, [sanPhamCanSua.maSanPham]);

  const dongBoSauKhiLuu = async (thongBao: string) => {
    const sanPhamMoi = await taiLaiChiTiet();
    await onSuccess(sanPhamMoi, false);
    alert(thongBao);
  };

  const donViSanPhamDaLuu = useMemo(
    () =>
      danhSachDonVi.filter(
        (donVi) => donVi.maDonViSanPham !== null && donVi.trangThai,
      ),
    [danhSachDonVi],
  );

  const luuThongTinSanPham = async () => {
    if (!thongTinForm.maDanhMuc) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    if (!thongTinForm.maNhaSanXuat) {
      alert("Vui lòng chọn nhà sản xuất");
      return;
    }

    if (!thongTinForm.tenSanPham.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    const request: SanPhamRequest = {
      maDanhMuc: Number(thongTinForm.maDanhMuc),
      maNhaSanXuat: Number(thongTinForm.maNhaSanXuat),
      tenSanPham: thongTinForm.tenSanPham.trim(),
      hinhAnh: thongTinForm.hinhAnh.trim() || null,
      moTaNgan: thongTinForm.moTaNgan.trim() || null,
      laThuocKeDon: thongTinForm.laThuocKeDon,
    };

    try {
      setDangLuu(true);

      await capNhatSanPham(sanPhamCanSua.maSanPham, request);

      await dongBoSauKhiLuu("Cập nhật thông tin sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin sản phẩm:", error);
      alert("Cập nhật sản phẩm thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  const themDongDonVi = () => {
    setDanhSachDonVi((danhSachCu) => [
      ...danhSachCu,
      {
        maDonViSanPham: null,
        maDonViTinh: "",
        giaBanTheoDonVi: "",
        laDonViCoSo: danhSachCu.length === 0,
        choPhepBan: true,
        choPhepNhap: true,
        trangThai: true,
      },
    ]);
  };

  const capNhatDongDonVi = (
    index: number,
    field: keyof DonViForm,
    value: string | boolean,
  ) => {
    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.map((donVi, viTri) =>
        viTri === index
          ? {
              ...donVi,
              [field]: value,
            }
          : donVi,
      ),
    );
  };

  const chonDonViCoSo = (index: number) => {
    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.map((donVi, viTri) => ({
        ...donVi,
        laDonViCoSo: viTri === index && donVi.trangThai,
      })),
    );
  };

  const xoaDongDonViMoi = (index: number) => {
    const donVi = danhSachDonVi[index];

    if (donVi.maDonViSanPham !== null) {
      return;
    }

    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.filter((_, viTri) => viTri !== index),
    );
  };

  const luuDanhSachDonVi = async () => {
    if (danhSachDonVi.length === 0) {
      alert("Sản phẩm phải có ít nhất một đơn vị");
      return;
    }

    const maDonViTinhDaChon = new Set<string>();
    let soDonViCoSoDangHoatDong = 0;

    for (const donVi of danhSachDonVi) {
      if (!donVi.maDonViTinh) {
        alert("Vui lòng chọn đơn vị tính cho tất cả các dòng");
        return;
      }

      if (maDonViTinhDaChon.has(donVi.maDonViTinh)) {
        alert("Không được chọn trùng đơn vị tính");
        return;
      }

      maDonViTinhDaChon.add(donVi.maDonViTinh);

      if (donVi.laDonViCoSo && donVi.trangThai) {
        soDonViCoSoDangHoatDong++;
      }

      if (donVi.laDonViCoSo && !donVi.trangThai) {
        alert("Đơn vị cơ sở phải đang hoạt động");
        return;
      }

      if (
        donVi.giaBanTheoDonVi &&
        Number(donVi.giaBanTheoDonVi) <= 0
      ) {
        alert("Giá bán theo đơn vị phải lớn hơn 0");
        return;
      }

      if (donVi.choPhepBan && !donVi.giaBanTheoDonVi) {
        alert("Đơn vị cho phép bán phải có giá lớn hơn 0");
        return;
      }
    }

    if (soDonViCoSoDangHoatDong !== 1) {
      alert("Phải có đúng một đơn vị cơ sở đang hoạt động");
      return;
    }

    const request: DonViSanPhamCapNhatRequest[] = danhSachDonVi.map(
      (donVi) => ({
        maDonViSanPham: donVi.maDonViSanPham,
        maDonViTinh: Number(donVi.maDonViTinh),
        giaBanTheoDonVi: donVi.giaBanTheoDonVi
          ? Number(donVi.giaBanTheoDonVi)
          : null,
        laDonViCoSo: donVi.laDonViCoSo,
        choPhepBan: donVi.choPhepBan,
        choPhepNhap: donVi.choPhepNhap,
        trangThai: donVi.trangThai,
      }),
    );

    try {
      setDangLuu(true);

      const response = await capNhatDanhSachDonViSanPham(
        sanPhamCanSua.maSanPham,
        request,
      );

      apDungChiTiet(response.data);
      await onSuccess(response.data, false);

      alert("Cập nhật đơn vị sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi cập nhật đơn vị sản phẩm:", error);

      alert("Cập nhật đơn vị sản phẩm thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  const doiTrangThaiDonVi = (index: number) => {
    setDanhSachDonVi((danhSachCu) =>
      danhSachCu.map((donVi, viTri) => {
        if (viTri !== index) {
          return donVi;
        }

        const trangThaiMoi = !donVi.trangThai;

        return {
          ...donVi,
          trangThai: trangThaiMoi,
          laDonViCoSo: trangThaiMoi ? donVi.laDonViCoSo : false,
        };
      }),
    );
  };

  const themDongQuyDoi = () => {
    if (donViSanPhamDaLuu.length < 2) {
      alert("Cần có ít nhất hai đơn vị đã lưu và đang hoạt động");
      return;
    }

    setDanhSachQuyDoi((danhSachCu) => [
      ...danhSachCu,
      {
        maQuyDoi: null,
        maDonViNguon: String(donViSanPhamDaLuu[0].maDonViSanPham),
        soLuongNguon: "1",
        maDonViDich: String(donViSanPhamDaLuu[1].maDonViSanPham),
        soLuongDich: "",
        trangThai: true,
      },
    ]);
  };

  const capNhatDongQuyDoi = (
    index: number,
    field: keyof QuyDoiForm,
    value: string,
  ) => {
    setDanhSachQuyDoi((danhSachCu) =>
      danhSachCu.map((quyDoi, viTri) =>
        viTri === index
          ? {
              ...quyDoi,
              [field]: value,
            }
          : quyDoi,
      ),
    );
  };

  const xoaDongQuyDoiMoi = (index: number) => {
    const quyDoi = danhSachQuyDoi[index];

    if (quyDoi.maQuyDoi !== null) {
      return;
    }

    setDanhSachQuyDoi((danhSachCu) =>
      danhSachCu.filter((_, viTri) => viTri !== index),
    );
  };
  const luuDanhSachQuyDoi = async () => {
    const capQuyDoiDaChon = new Set<string>();
    let soQuyDoiDangHoatDong = 0;

    for (const quyDoi of danhSachQuyDoi) {
      if (!quyDoi.maDonViNguon || !quyDoi.maDonViDich) {
        alert("Vui lòng chọn đầy đủ đơn vị nguồn và đích");
        return;
      }

      if (quyDoi.maDonViNguon === quyDoi.maDonViDich) {
        alert("Đơn vị nguồn và đơn vị đích không được giống nhau");
        return;
      }

      if (
        !quyDoi.soLuongNguon ||
        Number(quyDoi.soLuongNguon) <= 0 ||
        !quyDoi.soLuongDich ||
        Number(quyDoi.soLuongDich) <= 0
      ) {
        alert("Số lượng quy đổi phải lớn hơn 0");
        return;
      }

      const khoa = `${quyDoi.maDonViNguon}-${quyDoi.maDonViDich}`;

      if (capQuyDoiDaChon.has(khoa)) {
        alert("Không được khai báo trùng quy đổi");
        return;
      }

      capQuyDoiDaChon.add(khoa);

      if (quyDoi.trangThai) {
        soQuyDoiDangHoatDong++;
      }
    }

    if (
      donViSanPhamDaLuu.length >= 2 &&
      soQuyDoiDangHoatDong === 0
    ) {
      alert(
        "Sản phẩm có từ hai đơn vị hoạt động phải có quy đổi hoạt động",
      );
      return;
    }

    const request: QuyDoiDonViCapNhatRequest[] = danhSachQuyDoi.map(
      (quyDoi) => ({
        maQuyDoi: quyDoi.maQuyDoi,
        maDonViNguon: Number(quyDoi.maDonViNguon),
        soLuongNguon: Number(quyDoi.soLuongNguon),
        maDonViDich: Number(quyDoi.maDonViDich),
        soLuongDich: Number(quyDoi.soLuongDich),
        trangThai: quyDoi.trangThai,
      }),
    );

    try {
      setDangLuu(true);

      const response = await capNhatDanhSachQuyDoiDonVi(
        sanPhamCanSua.maSanPham,
        request,
      );

      apDungChiTiet(response.data);
      await onSuccess(response.data, false);

      alert("Cập nhật quy đổi đơn vị thành công");
    } catch (error) {
      console.error("Lỗi cập nhật quy đổi đơn vị:", error);
      alert("Cập nhật quy đổi đơn vị thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  const doiTrangThaiQuyDoi = (index: number) => {
    setDanhSachQuyDoi((danhSachCu) =>
      danhSachCu.map((quyDoi, viTri) =>
        viTri === index
          ? {
              ...quyDoi,
              trangThai: !quyDoi.trangThai,
            }
          : quyDoi,
      ),
    );
  };

  const capNhatDongThanhPhan = (
    index: number,
    field: keyof ThanhPhanForm,
    value: string,
  ) => {
    setDanhSachThanhPhan((danhSachCu) =>
      danhSachCu.map((thanhPhan, viTri) =>
        viTri === index
          ? {
              ...thanhPhan,
              [field]: value,
            }
          : thanhPhan,
      ),
    );
  };

  const luuThanhPhanHoatChat = async () => {
    const maHoatChatDaChon = new Set<string>();

    for (const thanhPhan of danhSachThanhPhan) {
      if (!thanhPhan.maHoatChat) {
        alert("Vui lòng chọn hoạt chất cho tất cả các dòng");
        return;
      }

      if (maHoatChatDaChon.has(thanhPhan.maHoatChat)) {
        alert("Không được chọn trùng hoạt chất");
        return;
      }

      maHoatChatDaChon.add(thanhPhan.maHoatChat);

      if (Number(thanhPhan.hamLuong) <= 0) {
        alert("Hàm lượng phải lớn hơn 0");
        return;
      }

      if (!thanhPhan.donViHamLuong.trim()) {
        alert("Đơn vị hàm lượng không được để trống");
        return;
      }
    }

    const request: ThanhPhanHoatChatTaoMoiRequest[] = danhSachThanhPhan.map(
      (thanhPhan) => ({
        maHoatChat: Number(thanhPhan.maHoatChat),
        hamLuong: Number(thanhPhan.hamLuong),
        donViHamLuong: thanhPhan.donViHamLuong.trim(),
        vaiTroHoatChat: thanhPhan.vaiTroHoatChat.trim() || null,
        ghiChu: thanhPhan.ghiChu.trim() || null,
      }),
    );

    try {
      setDangLuu(true);

      await capNhatThanhPhanHoatChat(sanPhamCanSua.maSanPham, request);

      await dongBoSauKhiLuu("Cập nhật thành phần hoạt chất thành công");
    } catch (error) {
      console.error("Lỗi cập nhật hoạt chất:", error);
      alert("Cập nhật thành phần hoạt chất thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  const luuDuLieuChuyenMon = async () => {
    if (!duLieuChuyenMon.dangBaoChe.trim()) {
      alert("Vui lòng nhập dạng bào chế");
      return;
    }

    if (!duLieuChuyenMon.phanLoaiThuoc.trim()) {
      alert("Vui lòng nhập phân loại thuốc");
      return;
    }

    if (!duLieuChuyenMon.congDungThamKhao.trim()) {
      alert("Vui lòng nhập công dụng tham khảo");
      return;
    }

    if (!duLieuChuyenMon.cachDungThamKhao.trim()) {
      alert("Vui lòng nhập cách dùng tham khảo");
      return;
    }

    if (!duLieuChuyenMon.canhBaoAnToan.trim()) {
      alert("Vui lòng nhập cảnh báo an toàn");
      return;
    }

    const request: DuLieuChuyenMonThuocRequest = {
      dangBaoChe: duLieuChuyenMon.dangBaoChe.trim(),
      phanLoaiThuoc: duLieuChuyenMon.phanLoaiThuoc.trim(),
      congDungThamKhao: duLieuChuyenMon.congDungThamKhao.trim(),
      cachDungThamKhao: duLieuChuyenMon.cachDungThamKhao.trim(),
      canhBaoAnToan: duLieuChuyenMon.canhBaoAnToan.trim(),
    };

    try {
      setDangLuu(true);

      await capNhatDuLieuChuyenMonThuoc(sanPhamCanSua.maSanPham, request);

      await dongBoSauKhiLuu("Cập nhật dữ liệu chuyên môn thành công");
    } catch (error) {
      console.error("Lỗi cập nhật dữ liệu chuyên môn:", error);
      alert("Cập nhật dữ liệu chuyên môn thất bại");
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card product-full-form-modal">
        <div className="modal-header">
          <div>
            <h2>Chỉnh sửa sản phẩm</h2>
            <p>{sanPhamChiTiet?.tenSanPham ?? sanPhamCanSua.tenSanPham}</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            disabled={dangLuu}
            aria-label="Đóng"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="product-edit-tabs">
          {danhSachTab.map((tab) => (
            <button
              key={tab.ma}
              type="button"
              className={
                tabHienTai === tab.ma
                  ? "product-edit-tab active"
                  : "product-edit-tab"
              }
              onClick={() => setTabHienTai(tab.ma)}
              disabled={dangLuu}
            >
              <i className={tab.icon} />
              {tab.nhan}
            </button>
          ))}
        </div>

        {dangTai ? (
          <AdminLoading noiDung="Đang tải dữ liệu sản phẩm..." />
        ) : (
          <>
            {tabHienTai === "thong-tin" && (
              <div>
                <div className="product-form-grid">
                  <div className="form-group">
                    <label>Danh mục</label>
                    <select
                      value={thongTinForm.maDanhMuc}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          maDanhMuc: event.target.value,
                        }))
                      }
                    >
                      <option value="">-- Chọn danh mục --</option>

                      {danhSachDanhMuc.map((danhMuc) => (
                        <option
                          key={danhMuc.maDanhMuc}
                          value={danhMuc.maDanhMuc}
                        >
                          {danhMuc.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nhà sản xuất</label>
                    <select
                      value={thongTinForm.maNhaSanXuat}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          maNhaSanXuat: event.target.value,
                        }))
                      }
                    >
                      <option value="">-- Chọn nhà sản xuất --</option>

                      {danhSachNhaSanXuat.map((nhaSanXuat) => (
                        <option
                          key={nhaSanXuat.maNhaSanXuat}
                          value={nhaSanXuat.maNhaSanXuat}
                        >
                          {nhaSanXuat.tenNhaSanXuat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Tên sản phẩm</label>
                    <input
                      value={thongTinForm.tenSanPham}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          tenSanPham: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Hình ảnh</label>
                    <input
                      value={thongTinForm.hinhAnh}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          hinhAnh: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Mô tả ngắn</label>
                    <textarea
                      rows={4}
                      value={thongTinForm.moTaNgan}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          moTaNgan: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <label className="product-inline-checkbox product-form-full-row">
                    <input
                      type="checkbox"
                      checked={thongTinForm.laThuocKeDon}
                      onChange={(event) =>
                        setThongTinForm((duLieuCu) => ({
                          ...duLieuCu,
                          laThuocKeDon: event.target.checked,
                        }))
                      }
                    />
                    Thuốc kê đơn
                  </label>
                </div>

                <div className="product-edit-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void luuThongTinSanPham()}
                    disabled={dangLuu}
                  >
                    <i className="bi bi-floppy" />
                    Lưu thông tin sản phẩm
                  </button>
                </div>
              </div>
            )}

            {tabHienTai === "don-vi" && (
              <div>
                <div className="product-step-title">
                  <div>
                    <h3>Đơn vị sản phẩm</h3>
                    <p>
                      Cập nhật giá bán, quyền bán, quyền nhập và đơn vị cơ sở.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={themDongDonVi}
                  >
                    <i className="bi bi-plus-lg" />
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
                        <th>Trạng thái</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {danhSachDonVi.map((donVi, index) => (
                        <tr key={`${donVi.maDonViSanPham ?? "moi"}-${index}`}>
                          <td>
                            <select
                              value={donVi.maDonViTinh}
                              disabled={donVi.maDonViSanPham !== null}
                              title={
                                donVi.maDonViSanPham !== null
                                  ? "Không thể đổi đơn vị tính của bản ghi đã tồn tại"
                                  : undefined
                              }
                              onChange={(event) =>
                                capNhatDongDonVi(
                                  index,
                                  "maDonViTinh",
                                  event.target.value,
                                )
                              }
                            >
                              <option value="">-- Chọn --</option>

                              {danhSachDonViTinh.map((donViTinh) => (
                                <option
                                  key={donViTinh.maDonViTinh}
                                  value={donViTinh.maDonViTinh}
                                  disabled={
                                    !donViTinh.trangThai &&
                                    donVi.maDonViTinh !==
                                      String(donViTinh.maDonViTinh)
                                  }
                                >
                                  {donViTinh.tenDonViTinh}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0"
                              value={donVi.giaBanTheoDonVi}
                              onChange={(event) =>
                                capNhatDongDonVi(
                                  index,
                                  "giaBanTheoDonVi",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td className="product-center-cell">
                            <input
                              type="radio"
                              name="donViCoSoSua"
                              checked={donVi.laDonViCoSo}
                              disabled={!donVi.trangThai}
                              onChange={() => chonDonViCoSo(index)}
                            />
                          </td>

                          <td className="product-center-cell">
                            <input
                              type="checkbox"
                              checked={donVi.choPhepBan}
                              onChange={(event) =>
                                capNhatDongDonVi(
                                  index,
                                  "choPhepBan",
                                  event.target.checked,
                                )
                              }
                            />
                          </td>

                          <td className="product-center-cell">
                            <input
                              type="checkbox"
                              checked={donVi.choPhepNhap}
                              onChange={(event) =>
                                capNhatDongDonVi(
                                  index,
                                  "choPhepNhap",
                                  event.target.checked,
                                )
                              }
                            />
                          </td>

                          <td>
                            {donVi.maDonViSanPham !== null ? (
                              <button
                                type="button"
                                className={
                                  donVi.trangThai
                                    ? "secondary-button"
                                    : "primary-button"
                                }
                                onClick={() => doiTrangThaiDonVi(index)}
                              >
                                {donVi.trangThai ? "Ẩn" : "Hiện"}
                              </button>
                            ) : (
                              "Chưa lưu"
                            )}
                          </td>

                          <td>
                            {donVi.maDonViSanPham === null && (
                              <button
                                type="button"
                                className="icon-button danger"
                                onClick={() => xoaDongDonViMoi(index)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="product-edit-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void luuDanhSachDonVi()}
                    disabled={dangLuu}
                  >
                    <i className="bi bi-floppy" />
                    Lưu đơn vị sản phẩm
                  </button>
                </div>
              </div>
            )}

            {tabHienTai === "quy-doi" && (
              <div>
                <div className="product-step-title">
                  <div>
                    <h3>Quy đổi đơn vị</h3>
                    <p>
                      Đơn vị mới phải được lưu trước khi dùng trong quy đổi.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={themDongQuyDoi}
                  >
                    <i className="bi bi-plus-lg" />
                    Thêm quy đổi
                  </button>
                </div>

                <div className="product-table-wrapper">
                  <table className="data-table product-entry-table">
                    <thead>
                      <tr>
                        <th>Đơn vị nguồn</th>
                        <th>Số lượng</th>
                        <th>Đơn vị đích</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {danhSachQuyDoi.map((quyDoi, index) => (
                        <tr key={`${quyDoi.maQuyDoi ?? "moi"}-${index}`}>
                          <td>
                            <select
                              value={quyDoi.maDonViNguon}
                              onChange={(event) =>
                                capNhatDongQuyDoi(
                                  index,
                                  "maDonViNguon",
                                  event.target.value,
                                )
                              }
                            >
                              <option value="">-- Chọn --</option>

                              {donViSanPhamDaLuu.map((donVi) => (
                                <option
                                  key={donVi.maDonViSanPham}
                                  value={donVi.maDonViSanPham ?? ""}
                                >
                                  {
                                    danhSachDonViTinh.find(
                                      (item) =>
                                        String(item.maDonViTinh) ===
                                        donVi.maDonViTinh,
                                    )?.tenDonViTinh
                                  }
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={quyDoi.soLuongNguon}
                              onChange={(event) =>
                                capNhatDongQuyDoi(
                                  index,
                                  "soLuongNguon",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <select
                              value={quyDoi.maDonViDich}
                              onChange={(event) =>
                                capNhatDongQuyDoi(
                                  index,
                                  "maDonViDich",
                                  event.target.value,
                                )
                              }
                            >
                              <option value="">-- Chọn --</option>

                              {donViSanPhamDaLuu.map((donVi) => (
                                <option
                                  key={donVi.maDonViSanPham}
                                  value={donVi.maDonViSanPham ?? ""}
                                >
                                  {
                                    danhSachDonViTinh.find(
                                      (item) =>
                                        String(item.maDonViTinh) ===
                                        donVi.maDonViTinh,
                                    )?.tenDonViTinh
                                  }
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={quyDoi.soLuongDich}
                              onChange={(event) =>
                                capNhatDongQuyDoi(
                                  index,
                                  "soLuongDich",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            {quyDoi.maQuyDoi !== null ? (
                              <button
                                type="button"
                                className={
                                  quyDoi.trangThai
                                    ? "secondary-button"
                                    : "primary-button"
                                }
                                onClick={() =>
                                  doiTrangThaiQuyDoi(index)
                                }
                              >
                                {quyDoi.trangThai ? "Ẩn" : "Hiện"}
                              </button>
                            ) : (
                              "Chưa lưu"
                            )}
                          </td>

                          <td>
                            {quyDoi.maQuyDoi === null && (
                              <button
                                type="button"
                                className="icon-button danger"
                                onClick={() => xoaDongQuyDoiMoi(index)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="product-edit-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void luuDanhSachQuyDoi()}
                    disabled={dangLuu}
                  >
                    <i className="bi bi-floppy" />
                    Lưu quy đổi đơn vị
                  </button>
                </div>
              </div>
            )}

            {tabHienTai === "hoat-chat" && (
              <div>
                <div className="product-step-title">
                  <div>
                    <h3>Thành phần hoạt chất</h3>
                    <p>
                      Danh sách mới sẽ thay thế toàn bộ thành phần hiện tại.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setDanhSachThanhPhan((danhSachCu) => [
                        ...danhSachCu,
                        taoThanhPhanRong(),
                      ])
                    }
                  >
                    <i className="bi bi-plus-lg" />
                    Thêm hoạt chất
                  </button>
                </div>

                <div className="product-table-wrapper">
                  <table className="data-table product-entry-table">
                    <thead>
                      <tr>
                        <th>Hoạt chất</th>
                        <th>Hàm lượng</th>
                        <th>Đơn vị</th>
                        <th>Vai trò</th>
                        <th>Ghi chú</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {danhSachThanhPhan.map((thanhPhan, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              value={thanhPhan.maHoatChat}
                              onChange={(event) => {
                                const maHoatChat = event.target.value;

                                capNhatDongThanhPhan(
                                  index,
                                  "maHoatChat",
                                  maHoatChat,
                                );

                                const hoatChat = danhSachHoatChat.find(
                                  (item) =>
                                    String(item.maHoatChat) === maHoatChat,
                                );

                                if (
                                  !thanhPhan.donViHamLuong &&
                                  hoatChat?.donVi
                                ) {
                                  capNhatDongThanhPhan(
                                    index,
                                    "donViHamLuong",
                                    hoatChat.donVi,
                                  );
                                }
                              }}
                            >
                              <option value="">-- Chọn hoạt chất --</option>

                              {danhSachHoatChat.map((hoatChat) => (
                                <option
                                  key={hoatChat.maHoatChat}
                                  value={hoatChat.maHoatChat}
                                  disabled={
                                    !hoatChat.trangThai &&
                                    thanhPhan.maHoatChat !==
                                      String(hoatChat.maHoatChat)
                                  }
                                >
                                  {hoatChat.tenHoatChat}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={thanhPhan.hamLuong}
                              onChange={(event) =>
                                capNhatDongThanhPhan(
                                  index,
                                  "hamLuong",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              value={thanhPhan.donViHamLuong}
                              onChange={(event) =>
                                capNhatDongThanhPhan(
                                  index,
                                  "donViHamLuong",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              value={thanhPhan.vaiTroHoatChat}
                              onChange={(event) =>
                                capNhatDongThanhPhan(
                                  index,
                                  "vaiTroHoatChat",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              value={thanhPhan.ghiChu}
                              onChange={(event) =>
                                capNhatDongThanhPhan(
                                  index,
                                  "ghiChu",
                                  event.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <button
                              type="button"
                              className="icon-button danger"
                              onClick={() => {
                                if (danhSachThanhPhan.length === 1) {
                                  alert("Phải có ít nhất một hoạt chất");
                                  return;
                                }

                                setDanhSachThanhPhan((danhSachCu) =>
                                  danhSachCu.filter(
                                    (_, viTri) => viTri !== index,
                                  ),
                                );
                              }}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="product-edit-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void luuThanhPhanHoatChat()}
                    disabled={dangLuu}
                  >
                    <i className="bi bi-floppy" />
                    Lưu thành phần hoạt chất
                  </button>
                </div>
              </div>
            )}

            {tabHienTai === "chuyen-mon" && (
              <div>
                <div className="product-step-title">
                  <div>
                    <h3>Dữ liệu chuyên môn thuốc</h3>
                    <p>
                      Sau khi Admin sửa, trạng thái xác nhận sẽ trở về chưa xác
                      nhận.
                    </p>
                  </div>

                  <span className="product-confirm-status">
                    {sanPhamChiTiet?.duLieuChuyenMonThuoc?.trangThaiXacNhan
                      ? "Đã xác nhận"
                      : "Chưa xác nhận"}
                  </span>
                </div>

                <div className="product-professional-grid">
                  <div className="form-group">
                    <label>Dạng bào chế</label>
                    <input
                      value={duLieuChuyenMon.dangBaoChe}
                      onChange={(event) =>
                        setDuLieuChuyenMon((duLieuCu) => ({
                          ...duLieuCu,
                          dangBaoChe: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Phân loại thuốc</label>
                    <input
                      value={duLieuChuyenMon.phanLoaiThuoc}
                      onChange={(event) =>
                        setDuLieuChuyenMon((duLieuCu) => ({
                          ...duLieuCu,
                          phanLoaiThuoc: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Công dụng tham khảo</label>
                    <textarea
                      rows={4}
                      value={duLieuChuyenMon.congDungThamKhao}
                      onChange={(event) =>
                        setDuLieuChuyenMon((duLieuCu) => ({
                          ...duLieuCu,
                          congDungThamKhao: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Cách dùng tham khảo</label>
                    <textarea
                      rows={4}
                      value={duLieuChuyenMon.cachDungThamKhao}
                      onChange={(event) =>
                        setDuLieuChuyenMon((duLieuCu) => ({
                          ...duLieuCu,
                          cachDungThamKhao: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form-group product-form-full-row">
                    <label>Cảnh báo an toàn</label>
                    <textarea
                      rows={4}
                      value={duLieuChuyenMon.canhBaoAnToan}
                      onChange={(event) =>
                        setDuLieuChuyenMon((duLieuCu) => ({
                          ...duLieuCu,
                          canhBaoAnToan: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="product-edit-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => void luuDuLieuChuyenMon()}
                    disabled={dangLuu}
                  >
                    <i className="bi bi-floppy" />
                    Lưu dữ liệu chuyên môn
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SanPhamChinhSuaModal;
