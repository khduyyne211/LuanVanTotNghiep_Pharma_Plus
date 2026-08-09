import type { DiaChiGiaoHang } from "../types/DiaChiGiaoHang";
import "../styles/DiaChiGiaoHang.css";

interface DanhSachDiaChiGiaoHangProps {
  danhSachDiaChi: DiaChiGiaoHang[];
  dangTaiDuLieu: boolean;
  thongBaoLoi: string;
  maDiaChiDangXoa: number | null;
  themDiaChi: () => void;
  suaDiaChi: (diaChi: DiaChiGiaoHang) => void;
  xoaDiaChi: (diaChi: DiaChiGiaoHang) => void;
  taiLaiDanhSach: () => void;
}

function taoDiaChiDayDu(
  diaChi: DiaChiGiaoHang,
): string {
  return [
    diaChi.diaChiChiTiet,
    diaChi.phuongKhuVuc,
    diaChi.thanhPho,
  ]
    .filter(Boolean)
    .join(", ");
}

function DanhSachDiaChiGiaoHang({
  danhSachDiaChi,
  dangTaiDuLieu,
  thongBaoLoi,
  maDiaChiDangXoa,
  themDiaChi,
  suaDiaChi,
  xoaDiaChi,
  taiLaiDanhSach,
}: DanhSachDiaChiGiaoHangProps) {
  return (
    <section className="dia-chi-trang-noi-dung">
      <div className="dia-chi-tieu-de-khu-vuc">
        <div className="dia-chi-tieu-de-noi-dung">
          <h1>Quản lý sổ địa chỉ</h1>

          <p>
            Quản lý các địa chỉ được sử dụng để
            nhận hàng.
          </p>
        </div>

        <button
          type="button"
          className="dia-chi-nut-them-moi"
          onClick={themDiaChi}
        >
          <i className="bi bi-plus-lg"></i>
          Thêm địa chỉ mới
        </button>
      </div>

      {dangTaiDuLieu && (
        <div className="dia-chi-thong-bao">
          Đang tải danh sách địa chỉ...
        </div>
      )}

      {!dangTaiDuLieu && thongBaoLoi && (
        <div className="dia-chi-thong-bao dia-chi-thong-bao-loi">
          <p>{thongBaoLoi}</p>

          <button
            type="button"
            onClick={taiLaiDanhSach}
          >
            Thử lại
          </button>
        </div>
      )}

      {!dangTaiDuLieu &&
        !thongBaoLoi &&
        danhSachDiaChi.length === 0 && (
          <div className="dia-chi-danh-sach-rong">
            <div className="dia-chi-rong-icon">
              <i className="bi bi-geo-alt"></i>
            </div>

            <h2>Chưa có địa chỉ nhận hàng</h2>

            <p>
              Hãy thêm địa chỉ để sử dụng khi đặt
              hàng.
            </p>

            <button
              type="button"
              className="dia-chi-nut-them-moi"
              onClick={themDiaChi}
            >
              Thêm địa chỉ
            </button>
          </div>
        )}

      {!dangTaiDuLieu &&
        !thongBaoLoi &&
        danhSachDiaChi.length > 0 && (
          <div className="dia-chi-danh-sach">
            {danhSachDiaChi.map((diaChi) => {
              const dangXoa =
                maDiaChiDangXoa ===
                diaChi.maDiaChi;

              return (
                <article
                  key={diaChi.maDiaChi}
                  className={
                    diaChi.laMacDinh
                      ? "dia-chi-the dia-chi-the-mac-dinh"
                      : "dia-chi-the"
                  }
                >
                  <div className="dia-chi-the-noi-dung">
                    <div className="dia-chi-thong-tin-chinh">
                      <div className="dia-chi-nguoi-nhan">
                        <strong>
                          {diaChi.tenNguoiNhan}
                        </strong>

                        {diaChi.laMacDinh && (
                          <span className="dia-chi-nhan-mac-dinh">
                            Mặc định
                          </span>
                        )}
                      </div>

                      <div className="dia-chi-so-dien-thoai">
                        <i className="bi bi-telephone"></i>

                        <span>
                          {
                            diaChi.soDienThoaiNhan
                          }
                        </span>
                      </div>

                      <div className="dia-chi-day-du">
                        <i className="bi bi-geo-alt"></i>

                        <span>
                          {taoDiaChiDayDu(
                            diaChi,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="dia-chi-hanh-dong-phu">
                      <button
                        type="button"
                        className="dia-chi-nut-sua"
                        disabled={dangXoa}
                        onClick={() =>
                          suaDiaChi(diaChi)
                        }
                      >
                        Sửa
                      </button>

                      <span className="dia-chi-hanh-dong-ngan-cach">
                        |
                      </span>

                      <button
                        type="button"
                        className="dia-chi-nut-xoa"
                        disabled={dangXoa}
                        onClick={() =>
                          xoaDiaChi(diaChi)
                        }
                      >
                        {dangXoa
                          ? "Đang xóa..."
                          : "Xóa"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </section>
  );
}

export default DanhSachDiaChiGiaoHang;