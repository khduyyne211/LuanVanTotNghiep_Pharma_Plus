import type { HoatChat } from "../../../hoat-chat/types/HoatChat";

export type SanPhamThanhPhanHoatChatFormData = {
  maHoatChat: string;
  hamLuong: string;
  donViHamLuong: string;
  vaiTroHoatChat: string;
  ghiChu: string;
};

type SanPhamThanhPhanHoatChatStepProps = {
  danhSachThanhPhan: SanPhamThanhPhanHoatChatFormData[];
  danhSachHoatChat: HoatChat[];
  onCapNhatThanhPhan: (
    index: number,
    field: keyof SanPhamThanhPhanHoatChatFormData,
    value: string,
  ) => void;
  onThemDong: () => void;
  onXoaDong: (index: number) => void;
  onQuayLai: () => void;
  onTiepTuc: () => void;
};

function SanPhamThanhPhanHoatChatStep({
  danhSachThanhPhan,
  danhSachHoatChat,
  onCapNhatThanhPhan,
  onThemDong,
  onXoaDong,
  onQuayLai,
  onTiepTuc,
}: SanPhamThanhPhanHoatChatStepProps) {
  const danhSachHoatChatDangDung = danhSachHoatChat.filter(
    (hoatChat) => hoatChat.trangThai,
  );

  return (
    <div>
      <div className="product-step-title">
        <div>
          <h3>Thành phần hoạt chất</h3>
          <p>
            Khai báo ít nhất một hoạt chất, hàm lượng và
            đơn vị hàm lượng.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onThemDong}
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

                      onCapNhatThanhPhan(
                        index,
                        "maHoatChat",
                        maHoatChat,
                      );

                      const hoatChatDaChon =
                        danhSachHoatChatDangDung.find(
                          (hoatChat) =>
                            String(hoatChat.maHoatChat) ===
                            maHoatChat,
                        );

                      if (
                        !thanhPhan.donViHamLuong.trim() &&
                        hoatChatDaChon?.donVi
                      ) {
                        onCapNhatThanhPhan(
                          index,
                          "donViHamLuong",
                          hoatChatDaChon.donVi,
                        );
                      }
                    }}
                  >
                    <option value="">
                      -- Chọn hoạt chất --
                    </option>

                    {danhSachHoatChatDangDung.map(
                      (hoatChat) => {
                        const daDuocChon =
                          danhSachThanhPhan.some(
                            (item, viTri) =>
                              viTri !== index &&
                              item.maHoatChat ===
                                String(hoatChat.maHoatChat),
                          );

                        return (
                          <option
                            key={hoatChat.maHoatChat}
                            value={hoatChat.maHoatChat}
                            disabled={daDuocChon}
                          >
                            {hoatChat.tenHoatChat}
                          </option>
                        );
                      },
                    )}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={thanhPhan.hamLuong}
                    onChange={(event) =>
                      onCapNhatThanhPhan(
                        index,
                        "hamLuong",
                        event.target.value,
                      )
                    }
                    placeholder="500"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={thanhPhan.donViHamLuong}
                    onChange={(event) =>
                      onCapNhatThanhPhan(
                        index,
                        "donViHamLuong",
                        event.target.value,
                      )
                    }
                    placeholder="mg"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={thanhPhan.vaiTroHoatChat}
                    onChange={(event) =>
                      onCapNhatThanhPhan(
                        index,
                        "vaiTroHoatChat",
                        event.target.value,
                      )
                    }
                    placeholder="Hoạt chất chính"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={thanhPhan.ghiChu}
                    onChange={(event) =>
                      onCapNhatThanhPhan(
                        index,
                        "ghiChu",
                        event.target.value,
                      )
                    }
                    placeholder="Ghi chú"
                  />
                </td>

                <td className="product-center-cell">
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() => onXoaDong(index)}
                    title="Xóa hoạt chất"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="product-step-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onQuayLai}
        >
          <i className="bi bi-arrow-left" />
          Quay lại
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={onTiepTuc}
        >
          Tiếp tục
          <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

export default SanPhamThanhPhanHoatChatStep;