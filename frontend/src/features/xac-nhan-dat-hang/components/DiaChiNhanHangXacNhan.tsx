import { Link } from "react-router-dom";
import type { DiaChiGiaoHang } from "../../dia-chi-giao-hang/types/DiaChiGiaoHang";

interface DiaChiNhanHangXacNhanProps {
  danhSachDiaChi: DiaChiGiaoHang[];
  diaChiDangChon?: DiaChiGiaoHang;
  dangMoDanhSachDiaChi: boolean;
  ghiChu: string;
  moDanhSachDiaChi: () => void;
  dongDanhSachDiaChi: () => void;
  chonDiaChi: (maDiaChi: number) => void;
  thayDoiGhiChu: (ghiChu: string) => void;
}

function taoDiaChiKhuVuc(diaChi: DiaChiGiaoHang) {
  return [
    diaChi.phuongKhuVuc,
    diaChi.thanhPho,
  ]
    .filter(Boolean)
    .join(", ");
}

function taoDiaChiDayDu(diaChi: DiaChiGiaoHang) {
  return [
    diaChi.diaChiChiTiet,
    diaChi.phuongKhuVuc,
    diaChi.thanhPho,
  ]
    .filter(Boolean)
    .join(", ");
}

function DiaChiNhanHangXacNhan({
  danhSachDiaChi,
  diaChiDangChon,
  dangMoDanhSachDiaChi,
  ghiChu,
  moDanhSachDiaChi,
  dongDanhSachDiaChi,
  chonDiaChi,
  thayDoiGhiChu,
}: DiaChiNhanHangXacNhanProps) {
  return (
    <section className="xac-nhan-dia-chi-card">
      <div className="xac-nhan-dia-chi-tieu-de">
        <div>
          <i className="bi bi-geo-alt-fill"></i>
          <h2>Địa chỉ nhận hàng</h2>
        </div>

        {danhSachDiaChi.length > 0 && (
          <button
            type="button"
            onClick={moDanhSachDiaChi}
          >
            {diaChiDangChon ? "Thay đổi" : "Chọn địa chỉ"}
          </button>
        )}
      </div>

      {danhSachDiaChi.length === 0 && (
        <div className="xac-nhan-dia-chi-chua-co">
          <div>
            <strong>Bạn chưa có địa chỉ nhận hàng</strong>

            <p>
              Vui lòng thêm địa chỉ trước khi hoàn tất mua hàng.
            </p>
          </div>

          <Link to="/tai-khoan/so-dia-chi">
            Thêm địa chỉ
          </Link>
        </div>
      )}

      {danhSachDiaChi.length > 0 && !diaChiDangChon && (
        <div className="xac-nhan-dia-chi-chua-co">
          <div>
            <strong>Chưa chọn địa chỉ nhận hàng</strong>

            <p>
              Vui lòng chọn địa chỉ sẽ sử dụng cho đơn hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={moDanhSachDiaChi}
          >
            Chọn địa chỉ
          </button>
        </div>
      )}

      {diaChiDangChon && (
        <>
          <div className="xac-nhan-dia-chi-thong-tin">
            <div className="xac-nhan-dia-chi-noi-dung">
              <strong className="xac-nhan-dia-chi-chi-tiet">
                {diaChiDangChon.diaChiChiTiet ||
                  "Chưa có địa chỉ chi tiết"}
              </strong>

              <p className="xac-nhan-dia-chi-khu-vuc">
                {taoDiaChiKhuVuc(diaChiDangChon)}
              </p>
            </div>

            <div className="xac-nhan-dia-chi-nguoi-nhan">
              <i className="bi bi-person-fill"></i>

              <strong>
                {diaChiDangChon.tenNguoiNhan}
              </strong>

              <span>•</span>

              <span>
                {diaChiDangChon.soDienThoaiNhan}
              </span>
            </div>
          </div>

          <textarea
            className="xac-nhan-dia-chi-ghi-chu"
            value={ghiChu}
            maxLength={255}
            onChange={(event) =>
              thayDoiGhiChu(event.target.value)
            }
            placeholder={
              "Ghi chú (không bắt buộc)\nVí dụ: Hãy gọi cho tôi 15 phút trước khi giao"
            }
          />
        </>
      )}

      {dangMoDanhSachDiaChi && (
        <div
          className="xac-nhan-dia-chi-overlay"
          onMouseDown={dongDanhSachDiaChi}
        >
          <div
            className="xac-nhan-dia-chi-hop-thoai"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="xac-nhan-dia-chi-nut-dong"
              onClick={dongDanhSachDiaChi}
            >
              ×
            </button>

            <h2>Chọn địa chỉ nhận hàng</h2>

            <div className="xac-nhan-dia-chi-lua-chon">
              {danhSachDiaChi.map((diaChi) => (
                <label
                  key={diaChi.maDiaChi}
                  className={
                    diaChi.maDiaChi ===
                    diaChiDangChon?.maDiaChi
                      ? "xac-nhan-dia-chi-lua-chon-muc dang-chon"
                      : "xac-nhan-dia-chi-lua-chon-muc"
                  }
                >
                  <input
                    type="radio"
                    name="diaChiNhanHang"
                    checked={
                      diaChi.maDiaChi ===
                      diaChiDangChon?.maDiaChi
                    }
                    onChange={() =>
                      chonDiaChi(diaChi.maDiaChi)
                    }
                  />

                  <div>
                    <div className="xac-nhan-dia-chi-lua-chon-nguoi">
                      <strong>
                        {diaChi.tenNguoiNhan}
                      </strong>

                      <span>
                        {diaChi.soDienThoaiNhan}
                      </span>

                      {diaChi.laMacDinh && (
                        <small>Mặc định</small>
                      )}
                    </div>

                    <p>{taoDiaChiDayDu(diaChi)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DiaChiNhanHangXacNhan;