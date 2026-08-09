export type NhomBoLocResponsive =
  | "TAT_CA"
  | "GIA_BAN"
  | "NHA_SAN_XUAT";

interface BoLocSanPhamProps {
  boLocDuoi100: () => void;
  boLocTu100Den300: () => void;
  boLocTu300Den500: () => void;
  boLocTren500: () => void;

  chonNhaSanXuat: (
    maNhaSanXuat: number,
    tenNhaSanXuat: string,
  ) => void;

  dangMoResponsive: boolean;
  nhomDangMoResponsive: NhomBoLocResponsive;
  dongBoLocResponsive: () => void;
}

function BoLocSanPham({
  boLocDuoi100,
  boLocTu100Den300,
  boLocTu300Den500,
  boLocTren500,
  chonNhaSanXuat,
  dangMoResponsive,
  nhomDangMoResponsive,
  dongBoLocResponsive,
}: BoLocSanPhamProps) {
  const layTieuDeResponsive = () => {
    if (nhomDangMoResponsive === "GIA_BAN") {
      return "Giá bán";
    }

    if (
      nhomDangMoResponsive ===
      "NHA_SAN_XUAT"
    ) {
      return "Nhà sản xuất";
    }

    return "Bộ lọc nâng cao";
  };

  const layClassBoLoc = () => {
    let className = "bo-loc-san-pham";

    if (dangMoResponsive) {
      className += " bo-loc-san-pham--mo";
    }

    if (
      nhomDangMoResponsive === "GIA_BAN"
    ) {
      className +=
        " bo-loc-san-pham--chi-gia";
    }

    if (
      nhomDangMoResponsive ===
      "NHA_SAN_XUAT"
    ) {
      className +=
        " bo-loc-san-pham--chi-nha-san-xuat";
    }

    return className;
  };

  return (
    <>
      <div
        className={
          dangMoResponsive
            ? "bo-loc-responsive-overlay bo-loc-responsive-overlay--mo"
            : "bo-loc-responsive-overlay"
        }
        onMouseDown={dongBoLocResponsive}
      ></div>

      <aside className={layClassBoLoc()}>
        <div className="bo-loc-tieu-de">
          <span className="bo-loc-tieu-de-desktop">
            Bộ lọc nâng cao
          </span>

          <span className="bo-loc-tieu-de-responsive">
            {layTieuDeResponsive()}
          </span>

          <button
            type="button"
            className="bo-loc-dong-responsive"
            onClick={dongBoLocResponsive}
            aria-label="Đóng bộ lọc"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="bo-loc-nhom bo-loc-nhom--gia">
          <h3 className="bo-loc-nhom-tieu-de">
            Giá bán
          </h3>

          <div className="bo-loc-danh-sach">
            <button
              type="button"
              className="bo-loc-nut"
              onClick={boLocDuoi100}
            >
              Dưới 100.000đ
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={boLocTu100Den300}
            >
              100.000đ đến 300.000đ
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={boLocTu300Den500}
            >
              300.000đ đến 500.000đ
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={boLocTren500}
            >
              Trên 500.000đ
            </button>
          </div>
        </div>

        <div className="bo-loc-nhom bo-loc-nhom--nha-san-xuat">
          <h3 className="bo-loc-nhom-tieu-de">
            Nhà sản xuất
          </h3>

          <div className="bo-loc-danh-sach">
            <button
              type="button"
              className="bo-loc-nut"
              onClick={() =>
                chonNhaSanXuat(
                  1,
                  "DHG Pharma",
                )
              }
            >
              DHG Pharma
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={() =>
                chonNhaSanXuat(
                  5,
                  "Sanofi",
                )
              }
            >
              Sanofi
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={() =>
                chonNhaSanXuat(
                  7,
                  "Omron Healthcare",
                )
              }
            >
              Omron Healthcare
            </button>

            <button
              type="button"
              className="bo-loc-nut"
              onClick={() =>
                chonNhaSanXuat(
                  9,
                  "L'Oréal",
                )
              }
            >
              L'Oréal
            </button>
          </div>
        </div>

        <div className="bo-loc-responsive-hanh-dong">
          <button
            type="button"
            onClick={dongBoLocResponsive}
          >
            Xong
          </button>
        </div>
      </aside>
    </>
  );
}

export default BoLocSanPham;