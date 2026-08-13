import AdminLoading from "../../shared/components/loading/AdminLoading";
import type { NhaSanXuat } from "../types/NhaSanXuat";

type NhaSanXuatTableProps = {
  danhSachNhaSanXuat: NhaSanXuat[];
  loading: boolean;
  maNhaSanXuatDangXuLy: number | null;
  onSua: (nhaSanXuat: NhaSanXuat) => void;
  onDoiTrangThai: (nhaSanXuat: NhaSanXuat) => void;
};

function NhaSanXuatTable({
  danhSachNhaSanXuat,
  loading,
  maNhaSanXuatDangXuLy,
  onSua,
  onDoiTrangThai,
}: NhaSanXuatTableProps) {
  if (loading) {
    return <AdminLoading noiDung="Đang tải danh sách nhà sản xuất..." />;
  }

  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên nhà sản xuất</th>
            <th>Quốc gia</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {danhSachNhaSanXuat.length === 0 ? (
            <tr>
              <td colSpan={6} className="ql-table-message">
                Chưa có nhà sản xuất
              </td>
            </tr>
          ) : (
            danhSachNhaSanXuat.map((nhaSanXuat) => {
              const dangXuLy = maNhaSanXuatDangXuLy === nhaSanXuat.maNhaSanXuat;

              return (
                <tr key={nhaSanXuat.maNhaSanXuat}>
                  <td>
                    <strong>#{nhaSanXuat.maNhaSanXuat}</strong>
                  </td>

                  <td>
                    <strong>{nhaSanXuat.tenNhaSanXuat}</strong>
                  </td>

                  <td>{nhaSanXuat.quocGia || "Chưa cập nhật"}</td>

                  <td>
                    <span className="ql-muted-text">
                      {nhaSanXuat.diaChi || "Chưa cập nhật"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        nhaSanXuat.trangThai
                          ? "ql-status ql-status-active"
                          : "ql-status ql-status-inactive"
                      }
                    >
                      {nhaSanXuat.trangThai ? "Hiện" : "Ẩn"}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(nhaSanXuat)}
                        disabled={dangXuLy}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onDoiTrangThai(nhaSanXuat)}
                        disabled={dangXuLy}
                      >
                        <i
                          className={
                            nhaSanXuat.trangThai
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />

                        {dangXuLy
                          ? "Đang xử lý..."
                          : nhaSanXuat.trangThai
                            ? "Ẩn"
                            : "Hiện"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NhaSanXuatTable;
