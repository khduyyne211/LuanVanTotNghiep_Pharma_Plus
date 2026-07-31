import type { SanPham } from "../types/SanPham";
import TheSanPham from "./TheSanPham";

interface BangSanPhamProps {
  danhSachSanPham: SanPham[];
}

function BangSanPham({ danhSachSanPham }: BangSanPhamProps) {
  const soCotMoiHang = 4;

  const danhSachHang: SanPham[][] = [];

  for (let i = 0; i < danhSachSanPham.length; i += soCotMoiHang) {
    danhSachHang.push(danhSachSanPham.slice(i, i + soCotMoiHang));
  }

  return (
    <table className="bang-san-pham">
      <tbody>
        {danhSachHang.map((hang, indexHang) => {
          const soCotConThieu = soCotMoiHang - hang.length;

          return (
            <tr key={indexHang}>
              {hang.map((sanPham) => (
                <td className="o-san-pham" key={sanPham.maSanPham}>
                  <TheSanPham sanPham={sanPham} />
                </td>
              ))}

              {Array.from({ length: soCotConThieu }).map((_, indexCotTrong) => (
                <td
                  className="o-san-pham o-san-pham-trong"
                  key={`cot-trong-${indexHang}-${indexCotTrong}`}
                ></td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default BangSanPham;