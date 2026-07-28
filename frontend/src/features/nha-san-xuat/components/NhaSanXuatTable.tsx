import type { NhaSanXuat } from "../types/NhaSanXuat";

type NhaSanXuatTableProps = {
  danhSachNhaSanXuat: NhaSanXuat[];
  loading: boolean;
  loi: string | null;
};

function NhaSanXuatTable({
  danhSachNhaSanXuat,
  loading,
  loi,
}: NhaSanXuatTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách nhà sản xuất...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên nhà sản xuất</th>
                <th>Quốc gia</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {danhSachNhaSanXuat.map((nhaSanXuat) => (
                <tr key={nhaSanXuat.maNhaSanXuat}>
                  <td>{nhaSanXuat.maNhaSanXuat}</td>

                  <td>
                    <strong>
                      {nhaSanXuat.tenNhaSanXuat}
                    </strong>
                  </td>

                  <td>
                    {nhaSanXuat.quocGia ||
                      "Chưa cập nhật"}
                  </td>

                  <td>
                    <div className="muted-text">
                      {nhaSanXuat.diaChi ||
                        "Chưa cập nhật"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        nhaSanXuat.trangThai
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {nhaSanXuat.trangThai
                        ? "Hiện"
                        : "Ẩn"}
                    </span>
                  </td>
                </tr>
              ))}

              {danhSachNhaSanXuat.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    Chưa có nhà sản xuất.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            className="pagination-row"
            style={{ padding: "0 16px 16px" }}
          >
            <div>
              Tổng cộng{" "}
              <strong>
                {danhSachNhaSanXuat.length}
              </strong>{" "}
              nhà sản xuất
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NhaSanXuatTable;