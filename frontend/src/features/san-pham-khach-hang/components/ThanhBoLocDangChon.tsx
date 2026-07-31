interface BoLocDangChon {
  id: string;
  ten: string;
  xoaBoLoc: () => void;
}

interface ThanhBoLocDangChonProps {
  danhSachBoLocDangChon: BoLocDangChon[];
  xoaTatCaBoLoc: () => void;
}

function ThanhBoLocDangChon({
  danhSachBoLocDangChon,
  xoaTatCaBoLoc,
}: ThanhBoLocDangChonProps) {
  if (danhSachBoLocDangChon.length === 0) {
    return null;
  }

  return (
    <div className="thanh-bo-loc-dang-chon">
      <span className="bo-loc-dang-chon-nhan">
        Lọc theo ({danhSachBoLocDangChon.length})
      </span>

      {danhSachBoLocDangChon.map((boLoc) => (
        <button
          className="bo-loc-dang-chon-the"
          key={boLoc.id}
          onClick={boLoc.xoaBoLoc}
        >
          {boLoc.ten} ×
        </button>
      ))}

      <button className="bo-loc-xoa-tat-ca" onClick={xoaTatCaBoLoc}>
        Xóa tất cả
      </button>
    </div>
  );
}

export default ThanhBoLocDangChon;