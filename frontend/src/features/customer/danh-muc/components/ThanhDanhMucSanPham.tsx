import { useDanhMucSanPham } from "../hooks/useDanhMucSanPham";
import { taoSlug } from "../../../../shared/utils/taoSlug";
import "../styles/ThanhDanhMucSanPham.css";
import { useNavigate } from "react-router-dom";

function ThanhDanhMucSanPham(){
  const { danhSachDanhMuc } = useDanhMucSanPham();

  const navigate = useNavigate();


  const chuyenDenDanhMuc = (maDanhMuc: number, tenDanhMuc: string) => {
    navigate(`/danh-muc/${maDanhMuc}/${taoSlug(tenDanhMuc)}`);
  };

  return(
    <nav className="thanh-danh-muc-san-pham">
      <div className="thanh-danh-muc-noi-dung">
        {danhSachDanhMuc.map((danhMuc) => (
          <div className="danh-muc-cha" key={danhMuc.maDanhMuc}>
            <button
              className="danh-muc-cha-nut"
              onClick={() => chuyenDenDanhMuc(danhMuc.maDanhMuc, danhMuc.tenDanhMuc)}
            >
              <span>{danhMuc.tenDanhMuc}</span>

              {danhMuc.danhSachDanhMucCon.length > 0 && (
                <i className="bi bi-chevron-down danh-muc-icon"></i>
              )}
            </button>

            {danhMuc.danhSachDanhMucCon.length > 0 && (
              <div className="danh-muc-con-hop">
                {danhMuc.danhSachDanhMucCon.map((danhMucCon) => (
                  <button
                    className="danh-muc-con-nut"
                    key={danhMucCon.maDanhMuc}
                    onClick={() =>
                      chuyenDenDanhMuc(danhMucCon.maDanhMuc, danhMucCon.tenDanhMuc)
                    }
                  >
                    {danhMucCon.tenDanhMuc}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default ThanhDanhMucSanPham;