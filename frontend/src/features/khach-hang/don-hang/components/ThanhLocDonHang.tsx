import {
  DANH_SACH_BO_LOC_DON_HANG,
  type BoLocTrangThaiDonHang,
} from "../constants/TrangThaiDonHang";

interface ThanhLocDonHangProps {
  boLocDangChon: BoLocTrangThaiDonHang;
  onThayDoiBoLoc: (boLoc: BoLocTrangThaiDonHang) => void;
}

export default function ThanhLocDonHang({
  boLocDangChon,
  onThayDoiBoLoc,
}: ThanhLocDonHangProps) {
  return (
    <div className="don-hang-bo-loc" role="tablist" aria-label="Trạng thái đơn hàng">
      {DANH_SACH_BO_LOC_DON_HANG.map((luaChon) => {
        const dangDuocChon = luaChon.giaTri === boLocDangChon;

        return (
          <button
            key={luaChon.giaTri}
            type="button"
            role="tab"
            aria-selected={dangDuocChon}
            className={`don-hang-bo-loc-nut ${
              dangDuocChon ? "don-hang-bo-loc-nut--dang-chon" : ""
            }`}
            onClick={() => onThayDoiBoLoc(luaChon.giaTri)}
          >
            {luaChon.nhan}
          </button>
        );
      })}
    </div>
  );
}