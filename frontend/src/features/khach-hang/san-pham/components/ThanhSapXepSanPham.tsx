interface ThanhSapXepSanPhamProps {
  sapXep: string;
  setSapXep: (sapXep: string) => void;
}

function ThanhSapXepSanPham({
  sapXep,
  setSapXep,
}: ThanhSapXepSanPhamProps) {
  const layClassNutSapXep = (giaTriSapXep: string) => {
    if (sapXep === giaTriSapXep) {
      return "sap-xep-nut sap-xep-nut-dang-chon";
    }

    return "sap-xep-nut";
  };

  return (
    <div className="thanh-sap-xep">
      <span className="sap-xep-nhan">Sắp xếp theo:</span>

      <button
        className={layClassNutSapXep("GIA_TANG_DAN")}
        onClick={() => setSapXep("GIA_TANG_DAN")}
      >
        Giá tăng dần
      </button>

      <button
        className={layClassNutSapXep("GIA_GIAM_DAN")}
        onClick={() => setSapXep("GIA_GIAM_DAN")}
      >
        Giá giảm dần
      </button>

      <button
        className={layClassNutSapXep("")}
        onClick={() => setSapXep("")}
      >
        Mặc định
      </button>
    </div>
  );
}

export default ThanhSapXepSanPham;