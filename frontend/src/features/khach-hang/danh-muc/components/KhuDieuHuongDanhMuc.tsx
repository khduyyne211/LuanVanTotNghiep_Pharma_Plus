import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDanhMucSanPham } from "../hooks/useDanhMucSanPham";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";
import DuongDanDanhMuc from "./DuongDanDanhMuc";
import { taoSlug } from "../../../../shared/utils/taoSlug";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { layIconDanhMuc } from "../constants/IconDanhMuc";
import "../styles/KhuDieuHuongDanhMuc.css"

interface KhuDieuHuongDanhMucProps {
  maDanhMucDangChon?: number;
}

function KhuDieuHuongDanhMuc({maDanhMucDangChon,}: KhuDieuHuongDanhMucProps) {
  const { danhSachDanhMuc } = useDanhMucSanPham();

  const navigate = useNavigate();

  const [trangDanhMucCon, setTrangDanhMucCon] = useState(0);

  const soDanhMucMoiTrang = 6;

  useEffect(() => {
    setTrangDanhMucCon(0);
  }, [maDanhMucDangChon]);

  if (maDanhMucDangChon === undefined) {
    return null;
  }

  const timDuongDanDanhMuc = (
    danhSach: DanhMucSanPham[],
    maDanhMuc: number,
    duongDanHienTai: DanhMucSanPham[] = []
  ): DanhMucSanPham[] | null => {
    for (const danhMuc of danhSach) {
      const duongDanMoi = [...duongDanHienTai, danhMuc];

      if (danhMuc.maDanhMuc === maDanhMuc) {
        return duongDanMoi;
      }

      const ketQua = timDuongDanDanhMuc(
        danhMuc.danhSachDanhMucCon,
        maDanhMuc,
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

  const duongDanDanhMuc = timDuongDanDanhMuc(
    danhSachDanhMuc,
    maDanhMucDangChon
  );

  if (duongDanDanhMuc === null) {
    return null;
  }

  const danhMucHienTai = duongDanDanhMuc[duongDanDanhMuc.length - 1];

  const tongSoTrangDanhMucCon = Math.ceil(
    danhMucHienTai.danhSachDanhMucCon.length / soDanhMucMoiTrang
  );

  const viTriBatDau = trangDanhMucCon * soDanhMucMoiTrang;

  const danhSachDanhMucConDangHienThi =
    danhMucHienTai.danhSachDanhMucCon.slice(
      viTriBatDau,
      viTriBatDau + soDanhMucMoiTrang
    );

  const coTheLui = trangDanhMucCon > 0;

  const coTheTien = trangDanhMucCon < tongSoTrangDanhMucCon - 1;

  const luiDanhMucCon = () => {
    if (coTheLui) {
      setTrangDanhMucCon(trangDanhMucCon - 1);
    }
  };

  const tienDanhMucCon = () => {
    if (coTheTien) {
      setTrangDanhMucCon(trangDanhMucCon + 1);
    }
  };

  return (
    <section className="khu-dieu-huong-danh-muc">
      <DuongDanDanhMuc maDanhMuc={maDanhMucDangChon} />

      <h1 className="tieu-de-danh-muc-hien-tai">
        {danhMucHienTai.tenDanhMuc}
      </h1>

      {danhMucHienTai.danhSachDanhMucCon.length > 0 && (
        <div className="khu-vuc-truot-danh-muc-con">
          {tongSoTrangDanhMucCon > 1 && coTheLui && (
            <button
              className="nut-truot-danh-muc nut-truot-trai"
              onClick={luiDanhMucCon}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}

          <div className="danh-sach-danh-muc-con-hien-tai">
            {danhSachDanhMucConDangHienThi.map((danhMucCon) => (
              <button
                className="the-danh-muc-con"
                key={danhMucCon.maDanhMuc}
                onClick={() => chuyenDenDanhMuc(danhMucCon)}
              >
                <div className="the-danh-muc-con-icon">
                  <FontAwesomeIcon icon={layIconDanhMuc(danhMucCon.maDanhMuc)} />
                </div>

                <span>{danhMucCon.tenDanhMuc}</span>
              </button>
            ))}
          </div>

          {tongSoTrangDanhMucCon > 1 && coTheTien && (
            <button
              className="nut-truot-danh-muc nut-truot-phai"
              onClick={tienDanhMucCon}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default KhuDieuHuongDanhMuc;