interface BoLocSanPhamProps {
  boLocDuoi100: () => void;
  boLocTu100Den300: () => void;
  boLocTu300Den500: () => void;
  boLocTren500: () => void;
  chonNhaSanXuat: (maNhaSanXuat: number, tenNhaSanXuat: string) => void;
}

function BoLocSanPham({
  boLocDuoi100,
  boLocTu100Den300,
  boLocTu300Den500,
  boLocTren500,
  chonNhaSanXuat,
}: BoLocSanPhamProps) {
  return (
    <aside className="bo-loc-san-pham">
      <div className="bo-loc-tieu-de">Bộ lọc nâng cao</div>

      <div className="bo-loc-nhom">
        <h3 className="bo-loc-nhom-tieu-de">Giá bán</h3>

        <div className="bo-loc-danh-sach">
          <button className="bo-loc-nut" onClick={boLocDuoi100}>
            Dưới 100.000đ
          </button>

          <button className="bo-loc-nut" onClick={boLocTu100Den300}>
            100.000đ đến 300.000đ
          </button>

          <button className="bo-loc-nut" onClick={boLocTu300Den500}>
            300.000đ đến 500.000đ
          </button>

          <button className="bo-loc-nut" onClick={boLocTren500}>
            Trên 500.000đ
          </button>

        </div>
      </div>

      <div className="bo-loc-nhom">
        <h3 className="bo-loc-nhom-tieu-de">Nhà sản xuất</h3>

        <div className="bo-loc-danh-sach">
          <button
            className="bo-loc-nut"
            onClick={() =>
              chonNhaSanXuat(1, "Abbott")
            }
          >
            Abbott
          </button>

          <button
            className="bo-loc-nut"
            onClick={() => chonNhaSanXuat(5, "Sanofi")}
          >
            Sanofi
          </button>

          <button
            className="bo-loc-nut"
            onClick={() => chonNhaSanXuat(7, "Omron Healthcare")}
          >
            Omron Healthcare
          </button>

          <button
            className="bo-loc-nut"
            onClick={() => chonNhaSanXuat(15, "CVI Pharma")}
          >
            CVI Pharma
          </button>
        </div>
      </div>
    </aside>
  );
}

export default BoLocSanPham;