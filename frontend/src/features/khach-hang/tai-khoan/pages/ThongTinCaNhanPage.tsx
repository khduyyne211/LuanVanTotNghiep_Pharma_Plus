import {
  useEffect,
  useState,
} from "react";

import ThongTinCaNhanForm from "../../tai-khoan/components/ThongTinCaNhanForm";
import { useThongTinCaNhan } from "../../tai-khoan/hooks/useThongTinCaNhan";
import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

function ThongTinCaNhanPage() {
  const thongBao = useThongBaoHeThong();

  const [
    dangChinhSua,
    setDangChinhSua,
  ] = useState(false);

  const {
    thongTinCaNhan,
    duLieuCapNhat,
    loiTruong,
    dangTai,
    dangLuu,
    loiHeThong,
    thayDoiDuLieu,
    luuThongTinCaNhan,
    huyThayDoi,
    taiThongTinCaNhan,
    xoaLoiHeThong,
  } = useThongTinCaNhan();

  useEffect(() => {
    if (!loiHeThong) return;

    thongBao.hienThongBao(
      loiHeThong,
      "LOI",
      "Không thể xử lý thông tin",
    );

    xoaLoiHeThong();
  }, [
    loiHeThong,
    thongBao.hienThongBao,
    xoaLoiHeThong,
  ]);

  const xuLyLuu = async () => {
    const thanhCong =
      await luuThongTinCaNhan();

    if (!thanhCong) return;

    setDangChinhSua(false);

    thongBao.hienThongBao(
      "Thông tin cá nhân đã được cập nhật.",
      "THANH_CONG",
      "Cập nhật thành công",
    );
  };

  const xuLyHuy = () => {
    huyThayDoi();
    setDangChinhSua(false);
  };

  return (
    <section className="tai-khoan-noi-dung-card">
      <div className="tai-khoan-noi-dung-tieu-de">
        <h1>Thông tin cá nhân</h1>
      </div>

      {dangTai && (
        <div className="thong-tin-ca-nhan-trang-thai">
          Đang tải thông tin...
        </div>
      )}

      {!dangTai && thongTinCaNhan && (
        <ThongTinCaNhanForm
          thongTin={thongTinCaNhan}
          duLieu={duLieuCapNhat}
          loiTruong={loiTruong}
          dangChinhSua={dangChinhSua}
          dangLuu={dangLuu}
          thayDoiDuLieu={thayDoiDuLieu}
          batDauChinhSua={() =>
            setDangChinhSua(true)
          }
          huyThayDoi={xuLyHuy}
          luuThongTin={() => {
            void xuLyLuu();
          }}
        />
      )}

      {!dangTai && !thongTinCaNhan && (
        <div className="thong-tin-ca-nhan-trang-thai">
          <p>
            Không thể tải thông tin cá nhân.
          </p>

          <button
            type="button"
            onClick={() => {
              void taiThongTinCaNhan();
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={
          thongBao.dongThongBao
        }
      />
    </section>
  );
}

export default ThongTinCaNhanPage;