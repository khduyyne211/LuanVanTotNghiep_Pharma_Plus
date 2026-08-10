interface NutXemThemProps {
  conSanPhamDeXemThem: boolean;
  xemThemSanPham: () => void;
  dangTaiThem: boolean;
}

function NutXemThem({
  conSanPhamDeXemThem,
  xemThemSanPham,
  dangTaiThem,
}: NutXemThemProps) {
  if (!conSanPhamDeXemThem) {
    return null;
  }

  return (
    <div className="khu-vuc-xem-them">
      <button
        className="nut-xem-them"
        onClick={xemThemSanPham}
        disabled={dangTaiThem}
      >
        {dangTaiThem ? "Đang tải thêm..." : "Xem thêm"}
      </button>
    </div>
  );
}

export default NutXemThem;