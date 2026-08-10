import TheSanPham from "./TheSanPham";
import type { SanPham } from "../types/SanPham";

interface BangSanPhamProps {
  danhSachSanPham: SanPham[];
}

function BangSanPham({
  danhSachSanPham,
}: BangSanPhamProps) {
  return (
    <div className="bang-san-pham">
      {danhSachSanPham.map((sanPham) => (
        <div
          className="o-san-pham"
          key={sanPham.maSanPham}
        >
          <TheSanPham sanPham={sanPham} />
        </div>
      ))}
    </div>
  );
}

export default BangSanPham;