import { useEffect } from "react";

import DanhSachDiaChiGiaoHang from "../../dia-chi-giao-hang/components/DanhSachDiaChiGiaoHang";
import FormDiaChiGiaoHang from "../../dia-chi-giao-hang/components/FormDiaChiGiaoHang";
import { useDiaChiGiaoHang } from "../../dia-chi-giao-hang/hooks/useDiaChiGiaoHang";
import type { DiaChiGiaoHang } from "../../dia-chi-giao-hang/types/DiaChiGiaoHang";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

function SoDiaChiNhanHangPage() {
  const thongBao = useThongBaoHeThong();

  const {
    danhSachDiaChi,
    duLieuForm,
    diaChiDangSua,
    loiTruong,
    dangTaiDuLieu,
    dangMoForm,
    dangLuu,
    maDiaChiDangXoa,
    thongBaoLoi,
    loiHeThong,
    thongBaoThanhCong,
    layDanhSachDiaChi,
    moFormThemDiaChi,
    moFormSuaDiaChi,
    dongFormDiaChi,
    thayDoiDuLieuForm,
    luuDiaChi,
    xoaDiaChi,
    xoaThongBaoHeThong,
  } = useDiaChiGiaoHang();

  useEffect(() => {
    if (thongBaoThanhCong) {
      thongBao.hienThongBao(thongBaoThanhCong, "THANH_CONG", "Thành công");

      xoaThongBaoHeThong();
      return;
    }

    if (loiHeThong) {
      thongBao.hienThongBao(loiHeThong, "LOI", "Không thể xử lý địa chỉ");

      xoaThongBaoHeThong();
    }
  }, [
    loiHeThong,
    thongBaoThanhCong,
    thongBao.hienThongBao,
    xoaThongBaoHeThong,
  ]);

  const xuLyXoaDiaChi = async (diaChi: DiaChiGiaoHang) => {
    const daXacNhan = window.confirm(
      `Bạn có chắc muốn xóa địa chỉ của ${diaChi.tenNguoiNhan}?`,
    );

    if (!daXacNhan) {
      return;
    }

    await xoaDiaChi(diaChi.maDiaChi);
  };

  return (
    <>
      <DanhSachDiaChiGiaoHang
        danhSachDiaChi={danhSachDiaChi}
        dangTaiDuLieu={dangTaiDuLieu}
        thongBaoLoi={thongBaoLoi}
        maDiaChiDangXoa={maDiaChiDangXoa}
        themDiaChi={moFormThemDiaChi}
        suaDiaChi={moFormSuaDiaChi}
        xoaDiaChi={(diaChi) => {
          void xuLyXoaDiaChi(diaChi);
        }}
        taiLaiDanhSach={() => {
          void layDanhSachDiaChi();
        }}
      />

      <FormDiaChiGiaoHang
        dangMoForm={dangMoForm}
        diaChiDangSua={diaChiDangSua}
        duLieuForm={duLieuForm}
        loiTruong={loiTruong}
        dangLuu={dangLuu}
        thayDoiDuLieuForm={thayDoiDuLieuForm}
        dongForm={dongFormDiaChi}
        luuDiaChi={() => {
          void luuDiaChi();
        }}
      />

      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />
    </>
  );
}

export default SoDiaChiNhanHangPage;
