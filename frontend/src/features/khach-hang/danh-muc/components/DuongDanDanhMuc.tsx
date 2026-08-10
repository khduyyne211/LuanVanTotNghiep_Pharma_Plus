import { useNavigate } from "react-router-dom";
import { useDanhMucSanPham } from "../hooks/useDanhMucSanPham";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";
import { taoSlug } from "../../../../shared/utils/taoSlug";
import "../styles/DuongDanDanhMuc.css";

interface DuongDanDanhMucProps {
  maDanhMuc?: number | null;
  tenMucHienTai?: string;
}

function DuongDanDanhMuc({
  maDanhMuc,
  tenMucHienTai,
}: DuongDanDanhMucProps) {
  const { danhSachDanhMuc } = useDanhMucSanPham();

  const navigate = useNavigate();

  const timDuongDanDanhMuc = (
    danhSach: DanhMucSanPham[],
    maDanhMucCanTim: number,
    duongDanHienTai: DanhMucSanPham[] = []
  ): DanhMucSanPham[] | null => {
    for (const danhMuc of danhSach) {
      const duongDanMoi = [...duongDanHienTai, danhMuc];

      if (danhMuc.maDanhMuc === maDanhMucCanTim) {
        return duongDanMoi;
      }

      const ketQua = timDuongDanDanhMuc(
        danhMuc.danhSachDanhMucCon,
        maDanhMucCanTim,
        duongDanMoi
      );

      if (ketQua !== null) {
        return ketQua;
      }
    }

    return null;
  };

  const chuyenDenDanhMuc = (danhMuc: DanhMucSanPham) => {
    navigate(`/danh-muc/${danhMuc.maDanhMuc}/${taoSlug(danhMuc.tenDanhMuc)}`);
  };

  const duongDanDanhMuc =
    maDanhMuc !== undefined && maDanhMuc !== null
      ? timDuongDanDanhMuc(danhSachDanhMuc, maDanhMuc)
      : null;

  return (
    <div className="duong-dan-danh-muc">
      <button type="button" onClick={() => navigate("/")}>
        Trang chủ
      </button>

      {duongDanDanhMuc?.map((danhMuc) => (
        <span className="duong-dan-muc" key={danhMuc.maDanhMuc}>
          <span className="duong-dan-phan-cach">/</span>

          <button type="button" onClick={() => chuyenDenDanhMuc(danhMuc)}>
            {danhMuc.tenDanhMuc}
          </button>
        </span>
      ))}

      {tenMucHienTai && (
        <span className="duong-dan-muc">
          <span className="duong-dan-phan-cach">/</span>
          <span className="duong-dan-hien-tai">{tenMucHienTai}</span>
        </span>
      )}
    </div>
  );
}

export default DuongDanDanhMuc;