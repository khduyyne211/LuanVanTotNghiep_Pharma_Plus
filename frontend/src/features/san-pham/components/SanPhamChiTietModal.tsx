import type {
  DonViSanPham,
  QuyDoiDonVi,
  SanPham,
} from "../types/SanPham";

type SanPhamChiTietModalProps = {
  sanPhamChiTiet: SanPham | null;
  dangTaiChiTiet: boolean;

  onClose: () => void;

  onThemDonVi: () => void;
  onSuaDonVi: (donVi: DonViSanPham) => void;
  onAnDonVi: (maDonViSanPham: number) => void;
  onHienDonVi: (maDonViSanPham: number) => void;

  onThemQuyDoi: () => void;
  onSuaQuyDoi: (quyDoi: QuyDoiDonVi) => void;
  onAnQuyDoi: (maQuyDoi: number) => void;
  onHienQuyDoi: (maQuyDoi: number) => void;
};

function SanPhamChiTietModal({
  sanPhamChiTiet,
  dangTaiChiTiet,
  onClose,
  onThemDonVi,
  onSuaDonVi,
  onAnDonVi,
  onHienDonVi,
  onThemQuyDoi,
  onSuaQuyDoi,
  onAnQuyDoi,
  onHienQuyDoi,
}: SanPhamChiTietModalProps) {
  const dinhDangTien = (giaTri: number) => {
    return giaTri.toLocaleString("vi-VN") + " đ";
  };

  if (dangTaiChiTiet) {
    return (
      <div className="modal-overlay">
        <div className="modal-card product-detail-modal">
          <p>Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!sanPhamChiTiet) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card product-detail-modal">
        <div className="modal-header">
          <div>
            <h2>Chi tiết sản phẩm</h2>
            <p>{sanPhamChiTiet.tenSanPham}</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Đóng chi tiết sản phẩm"
          >
            ×
          </button>
        </div>

        <div className="detail-section">
          <h3>Thông tin chung</h3>

          <div className="detail-grid">
            <div>
              <span>Mã sản phẩm</span>
              <strong>{sanPhamChiTiet.maSanPham}</strong>
            </div>

            <div>
              <span>Danh mục</span>
              <strong>{sanPhamChiTiet.tenDanhMuc}</strong>
            </div>

            <div>
              <span>Nhà sản xuất</span>
              <strong>
                {sanPhamChiTiet.tenNhaSanXuat || "Chưa cập nhật"}
              </strong>
            </div>

            <div>
              <span>Giá bán mặc định</span>
              <strong>{dinhDangTien(sanPhamChiTiet.giaBan)}</strong>
            </div>

            <div>
              <span>Thuốc kê đơn</span>
              <strong>
                {sanPhamChiTiet.laThuocKeDon ? "Có" : "Không"}
              </strong>
            </div>

            <div>
              <span>Trạng thái</span>
              <strong>
                {sanPhamChiTiet.trangThaiSanPham
                  ? "Đang bán"
                  : "Ngừng bán"}
              </strong>
            </div>
          </div>

          <div className="detail-description">
            <span>Mô tả ngắn</span>
            <p>{sanPhamChiTiet.moTaNgan || "Chưa có mô tả"}</p>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Đơn vị sản phẩm</h3>

            <button
              type="button"
              className="small-button"
              onClick={onThemDonVi}
            >
              + Thêm đơn vị
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn vị SP</th>
                <th>Đơn vị</th>
                <th>Giá theo đơn vị</th>
                <th>Đơn vị cơ sở</th>
                <th>Cho phép bán</th>
                <th>Cho phép nhập</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {sanPhamChiTiet.danhSachDonViSanPham?.map((donVi) => (
                <tr key={donVi.maDonViSanPham}>
                  <td>{donVi.maDonViSanPham}</td>

                  <td>
                    {donVi.tenDonViTinh} ({donVi.kyHieu})
                  </td>

                  <td>
                    {donVi.giaBanTheoDonVi !== null
                      ? dinhDangTien(donVi.giaBanTheoDonVi)
                      : "Không có"}
                  </td>

                  <td>{donVi.laDonViCoSo ? "Có" : "Không"}</td>
                  <td>{donVi.choPhepBan ? "Có" : "Không"}</td>
                  <td>{donVi.choPhepNhap ? "Có" : "Không"}</td>
                  <td>{donVi.trangThai ? "Đang dùng" : "Đã ẩn"}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => onSuaDonVi(donVi)}
                      >
                        Sửa
                      </button>

                      {donVi.trangThai ? (
                        <button
                          type="button"
                          className="small-button warning-button"
                          onClick={() =>
                            onAnDonVi(donVi.maDonViSanPham)
                          }
                        >
                          Ẩn
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="small-button success-button"
                          onClick={() =>
                            onHienDonVi(donVi.maDonViSanPham)
                          }
                        >
                          Hiện
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {(sanPhamChiTiet.danhSachDonViSanPham?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Sản phẩm chưa có đơn vị.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <div className="detail-section-header">
            <h3>Quy đổi đơn vị</h3>

            <button
              type="button"
              className="small-button"
              onClick={onThemQuyDoi}
            >
              + Thêm quy đổi
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mã quy đổi</th>
                <th>Đơn vị nguồn</th>
                <th>Số lượng nguồn</th>
                <th>Đơn vị đích</th>
                <th>Số lượng đích</th>
                <th>Diễn giải</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {sanPhamChiTiet.danhSachQuyDoiDonVi?.map((quyDoi) => (
                <tr key={quyDoi.maQuyDoi}>
                  <td>{quyDoi.maQuyDoi}</td>
                  <td>{quyDoi.tenDonViNguon}</td>
                  <td>{quyDoi.soLuongNguon}</td>
                  <td>{quyDoi.tenDonViDich}</td>
                  <td>{quyDoi.soLuongDich}</td>

                  <td>
                    {quyDoi.soLuongNguon} {quyDoi.tenDonViNguon} ={" "}
                    {quyDoi.soLuongDich} {quyDoi.tenDonViDich}
                  </td>

                  <td>
                    {quyDoi.trangThai ? "Đang dùng" : "Đã ẩn"}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => onSuaQuyDoi(quyDoi)}
                      >
                        Sửa
                      </button>

                      {quyDoi.trangThai ? (
                        <button
                          type="button"
                          className="small-button warning-button"
                          onClick={() =>
                            onAnQuyDoi(quyDoi.maQuyDoi)
                          }
                        >
                          Ẩn
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="small-button success-button"
                          onClick={() =>
                            onHienQuyDoi(quyDoi.maQuyDoi)
                          }
                        >
                          Hiện
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {(sanPhamChiTiet.danhSachQuyDoiDonVi?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Sản phẩm chưa có quy đổi đơn vị.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SanPhamChiTietModal;