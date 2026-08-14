import { useState } from "react";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import KhuyenMaiFormModal from "../components/KhuyenMaiFormModal";
import KhuyenMaiSanPhamModal from "../components/KhuyenMaiSanPhamModal";
import KhuyenMaiTable from "../components/KhuyenMaiTable";

import { useDanhSachKhuyenMai } from "../hooks/useDanhSachKhuyenMai";
import useFormKhuyenMai from "../hooks/useFormKhuyenMai";

import type { KhuyenMai } from "../types/KhuyenMai";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyKhuyenMaiPage() {
  const thongBao = useThongBaoHeThong();

  const [khuyenMaiQuanLySanPham, setKhuyenMaiQuanLySanPham] =
    useState<KhuyenMai | null>(null);

  const { danhSachKhuyenMai, dangTai, loi, taiDanhSachKhuyenMai } =
    useDanhSachKhuyenMai();

  const {
    hienForm,
    khuyenMaiCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormKhuyenMai({
    onTaiLaiDanhSach: taiDanhSachKhuyenMai,
  });

  const moQuanLySanPham = (khuyenMai: KhuyenMai) => {
    setKhuyenMaiQuanLySanPham(khuyenMai);
  };

  const dongQuanLySanPham = () => {
    setKhuyenMaiQuanLySanPham(null);
  };

  const xuLyLuuSanPhamThanhCong = () => {
    setKhuyenMaiQuanLySanPham(null);

    void taiDanhSachKhuyenMai();
  };

  return (
    <div className="ql-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        noiDung={thongBao.noiDung}
        tieuDe={thongBao.tieuDe}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <TieuDeTrangQuanLy
        tieuDe="Quản lý khuyến mãi"
        moTa="Theo dõi các chương trình giảm giá và sản phẩm được áp dụng trong từng khoảng thời gian"
      >
        <NutThaoTacChinh nhan="Thêm khuyến mãi" onClick={moFormThem} />
      </TieuDeTrangQuanLy>

      <KhuyenMaiFormModal
        isOpen={hienForm}
        khuyenMaiCanSua={khuyenMaiCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
        onThongBao={thongBao.hienThongBao}
      />

      <KhuyenMaiSanPhamModal
        isOpen={khuyenMaiQuanLySanPham !== null}
        khuyenMai={khuyenMaiQuanLySanPham}
        onClose={dongQuanLySanPham}
        onSuccess={xuLyLuuSanPhamThanhCong}
        onThongBao={thongBao.hienThongBao}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi || undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng <strong>{danhSachKhuyenMai.length}</strong> chương trình
            khuyến mãi
          </div>
        }
      >
        {!loi && (
          <KhuyenMaiTable
            danhSachKhuyenMai={danhSachKhuyenMai}
            loading={dangTai}
            onSua={moFormSua}
            onQuanLySanPham={moQuanLySanPham}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyKhuyenMaiPage;
