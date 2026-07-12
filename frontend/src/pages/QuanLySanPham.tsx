import { useCallback, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { SanPham, DonViSanPham, QuyDoiDonVi } from "../types/SanPham";
import type { PhanTrangResponse } from "../types/PhanTrangResponse";
import SanPhamFormModal from "../components/SanPhamFormModal";
import DonViSanPhamFormModal from "../components/DonViSanPhamFormModal";
import QuyDoiDonViFormModal from "../components/QuyDoiDonViFormModal";
import SanPhamBoLoc from "../features/san-pham/components/SanPhamBoLoc";
type DanhMucSanPham = {
  maDanhMuc: number;
  tenDanhMuc: string;
  trangThaiHienThi: boolean;
};

type NhaSanXuat = {
  maNhaSanXuat: number;
  tenNhaSanXuat: string;
  trangThai: boolean;
};

function QuanLySanPham() {
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [laThuocKeDonFilter, setLaThuocKeDonFilter] = useState("");
  const [trangThaiSanPhamFilter, setTrangThaiSanPhamFilter] = useState("");
  const [maDanhMucFilter, setMaDanhMucFilter] = useState("");
  const [maNhaSanXuatFilter, setMaNhaSanXuatFilter] = useState("");

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMucSanPham[]>([]);
  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<NhaSanXuat[]>([]);

  const [sanPhamChiTiet, setSanPhamChiTiet] = useState<SanPham | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [hienForm, setHienForm] = useState(false);
  const [sanPhamCanSua, setSanPhamCanSua] = useState<SanPham | null>(null);

  const [hienFormDonVi, setHienFormDonVi] = useState(false);
  const [donViCanSua, setDonViCanSua] = useState<DonViSanPham | null>(null);

  const [hienFormQuyDoi, setHienFormQuyDoi] = useState(false);
  const [quyDoiCanSua, setQuyDoiCanSua] = useState<QuyDoiDonVi | null>(null);

  const layDanhSachSanPham = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get<PhanTrangResponse<SanPham>>(
        "/san-pham/phan-trang",
        {
          params: {
            page,
            size,
            keyword: keyword || undefined,
            laThuocKeDon: laThuocKeDonFilter || undefined,
            trangThaiSanPham: trangThaiSanPhamFilter || undefined,
            maDanhMuc: maDanhMucFilter || undefined,
            maNhaSanXuat: maNhaSanXuatFilter || undefined,
          },
        }
      );

      setDanhSachSanPham(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
      setFirst(response.data.first);
      setLast(response.data.last);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    size,
    keyword,
    laThuocKeDonFilter,
    trangThaiSanPhamFilter,
    maDanhMucFilter,
    maNhaSanXuatFilter,
  ]);

  const layDuLieuBoLoc = useCallback(async () => {
    try {
      const [danhMucResponse, nhaSanXuatResponse] = await Promise.all([
        axiosClient.get<DanhMucSanPham[]>("/danh-muc-san-pham"),
        axiosClient.get<NhaSanXuat[]>("/nha-san-xuat"),
      ]);

      setDanhSachDanhMuc(danhMucResponse.data);
      setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
      alert("Không thể tải dữ liệu bộ lọc sản phẩm");
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDanhSachSanPham();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDanhSachSanPham]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDuLieuBoLoc();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDuLieuBoLoc]);

  const timKiemSanPham = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  const xoaTatCaBoLoc = () => {
    setKeywordInput("");
    setKeyword("");
    setLaThuocKeDonFilter("");
    setTrangThaiSanPhamFilter("");
    setMaDanhMucFilter("");
    setMaNhaSanXuatFilter("");
    setPage(0);
  };


  const moFormThem = () => {
    setSanPhamCanSua(null);
    setHienForm(true);
  };

  const moFormSua = (sanPham: SanPham) => {
    setSanPhamCanSua(sanPham);
    setHienForm(true);
  };

  const dongForm = () => {
    setHienForm(false);
    setSanPhamCanSua(null);
  };

  const xuLyLuuThanhCong = async () => {
    await layDanhSachSanPham();
  };

  const xemChiTietSanPham = async (maSanPham: number) => {
    try {
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);

      const response = await axiosClient.get<SanPham>(
        `/san-pham/${maSanPham}/chi-tiet-day-du`
      );

      setSanPhamChiTiet(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không thể tải chi tiết sản phẩm");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTietSanPham = () => {
    setSanPhamChiTiet(null);

    setHienFormDonVi(false);
    setDonViCanSua(null);

    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const napLaiChiTietSanPham = async (maSanPham: number) => {
    const response = await axiosClient.get<SanPham>(
      `/san-pham/${maSanPham}/chi-tiet-day-du`
    );

    setSanPhamChiTiet(response.data);
  };

  const moFormThemDonVi = () => {
    if (!sanPhamChiTiet) return;

    setDonViCanSua(null);
    setHienFormDonVi(true);
  };

  const moFormSuaDonVi = (donVi: DonViSanPham) => {
    setDonViCanSua(donVi);
    setHienFormDonVi(true);
  };

  const dongFormDonVi = () => {
    setHienFormDonVi(false);
    setDonViCanSua(null);
  };

  const xuLyLuuDonViThanhCong = async () => {
    if (!sanPhamChiTiet) return;

    await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
  };

  const anDonViSanPham = async (maDonViSanPham: number) => {
    if (!sanPhamChiTiet) return;

    const dongY = confirm("Bạn có chắc muốn ẩn đơn vị sản phẩm này không?");
    if (!dongY) return;

    try {
      await axiosClient.put(`/don-vi-san-pham/${maDonViSanPham}/an`);
      await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
    } catch (error) {
      console.error("Lỗi khi ẩn đơn vị sản phẩm:", error);
      alert("Ẩn đơn vị sản phẩm thất bại");
    }
  };

  const hienDonViSanPham = async (maDonViSanPham: number) => {
    if (!sanPhamChiTiet) return;

    try {
      await axiosClient.put(`/don-vi-san-pham/${maDonViSanPham}/hien`);
      await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
    } catch (error) {
      console.error("Lỗi khi hiện đơn vị sản phẩm:", error);
      alert("Hiện đơn vị sản phẩm thất bại");
    }
  };

  const moFormThemQuyDoi = () => {
    if (!sanPhamChiTiet) return;

    setQuyDoiCanSua(null);
    setHienFormQuyDoi(true);
  };

  const moFormSuaQuyDoi = (quyDoi: QuyDoiDonVi) => {
    setQuyDoiCanSua(quyDoi);
    setHienFormQuyDoi(true);
  };

  const dongFormQuyDoi = () => {
    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const xuLyLuuQuyDoiThanhCong = async () => {
    if (!sanPhamChiTiet) return;

    await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
  };

  const anQuyDoiDonVi = async (maQuyDoi: number) => {
    if (!sanPhamChiTiet) return;

    const dongY = confirm("Bạn có chắc muốn ẩn quy đổi đơn vị này không?");
    if (!dongY) return;

    try {
      await axiosClient.put(`/quy-doi-don-vi/${maQuyDoi}/an`);
      await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
    } catch (error) {
      console.error("Lỗi khi ẩn quy đổi đơn vị:", error);
      alert("Ẩn quy đổi đơn vị thất bại");
    }
  };

  const hienQuyDoiDonVi = async (maQuyDoi: number) => {
    if (!sanPhamChiTiet) return;

    try {
      await axiosClient.put(`/quy-doi-don-vi/${maQuyDoi}/hien`);
      await napLaiChiTietSanPham(sanPhamChiTiet.maSanPham);
    } catch (error) {
      console.error("Lỗi khi hiện quy đổi đơn vị:", error);
      alert("Hiện quy đổi đơn vị thất bại");
    }
  };

  const anSanPham = async (maSanPham: number) => {
    const dongY = confirm("Bạn có chắc muốn ẩn sản phẩm này không?");
    if (!dongY) return;

    try {
      await axiosClient.put(`/san-pham/${maSanPham}/an`);
      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi ẩn sản phẩm:", error);
      alert("Ẩn sản phẩm thất bại");
    }
  };

  const hienSanPham = async (maSanPham: number) => {
    try {
      await axiosClient.put(`/san-pham/${maSanPham}/hien`);
      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi hiện sản phẩm:", error);
      alert("Hiện sản phẩm thất bại");
    }
  };

  const dinhDangTien = (giaTri: number) => {
    return giaTri.toLocaleString("vi-VN") + " đ";
  };

  const dinhDangNgay = (ngay: string) => {
    return new Date(ngay).toLocaleDateString("vi-VN");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>
            Dược sĩ theo dõi thông tin sản phẩm, trạng thái kinh doanh, đơn vị
            bán và quy đổi đơn vị.
          </p>
        </div>

        <button className="primary-button" onClick={moFormThem}>
          + Thêm sản phẩm
        </button>
      </div>

      <SanPhamFormModal
        isOpen={hienForm}
        sanPhamCanSua={sanPhamCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <SanPhamBoLoc
        keyWordInput={keywordInput}
        laThuocKeDonFilter={laThuocKeDonFilter}
        trangThaiSanPhamFilter={trangThaiSanPhamFilter}
        maDanhMucFilter={maDanhMucFilter}
        maNhaSanXuatFilter={maNhaSanXuatFilter}
        size={size}
        dsDanhmuc={danhSachDanhMuc}
        dsNSX={danhSachNhaSanXuat}
        onKeywordInputChange={setKeywordInput}
        onTimKiem={timKiemSanPham}
        onXoaBoLoc={xoaTatCaBoLoc}
        onLaThuocKeDonChange={(giaTri) => {
          setLaThuocKeDonFilter(giaTri);
          setPage(0);
        }}
        onTrangThaiSanPhamChange={(giaTri) => {
          setTrangThaiSanPhamFilter(giaTri);
          setPage(0);
        }}
        onMaDanhMucChange={(giaTri) => {
          setMaDanhMucFilter(giaTri);
          setPage(0);
        }}
        onMaNhaSanXuatChange={(giaTri) => {
          setMaNhaSanXuatFilter(giaTri);
          setPage(0);
        }}
        onSizeChange={(giaTri) => {
          setSize(giaTri);
          setPage(0);
        }}
      />

      <div className="table-card">
        {loading ? (
          <p style={{ padding: "16px" }}>Đang tải danh sách sản phẩm...</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Nhà sản xuất</th>
                  <th>Giá bán</th>
                  <th>Kê đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSachSanPham.map((sp) => (
                  <tr key={sp.maSanPham}>
                    <td>{sp.maSanPham}</td>

                    <td>
                      <strong>{sp.tenSanPham}</strong>
                      <div className="muted-text">{sp.moTaNgan}</div>
                    </td>

                    <td>{sp.tenDanhMuc}</td>

                    <td>{sp.tenNhaSanXuat || "Chưa cập nhật"}</td>

                    <td>{dinhDangTien(sp.giaBan)}</td>

                    <td>{sp.laThuocKeDon ? "Có" : "Không"}</td>

                    <td>
                      <span
                        className={
                          sp.trangThaiSanPham
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {sp.trangThaiSanPham ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </td>

                    <td>{dinhDangNgay(sp.ngayTao)}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="small-button"
                          onClick={() => moFormSua(sp)}
                        >
                          Sửa
                        </button>

                        <button
                          className="small-button"
                          onClick={() => xemChiTietSanPham(sp.maSanPham)}
                        >
                          Xem chi tiết
                        </button>

                        {sp.trangThaiSanPham ? (
                          <button
                            className="small-button warning-button"
                            onClick={() => anSanPham(sp.maSanPham)}
                          >
                            Ẩn
                          </button>
                        ) : (
                          <button
                            className="small-button success-button"
                            onClick={() => hienSanPham(sp.maSanPham)}
                          >
                            Hiện
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {danhSachSanPham.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty-cell">
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination-row" style={{ padding: "0 16px 16px" }}>
              <div>
                Tổng cộng <strong>{totalElements}</strong> sản phẩm
              </div>

              <div className="pagination-actions">
                <button
                  className="small-button"
                  disabled={first}
                  onClick={() => setPage(page - 1)}
                >
                  Trang trước
                </button>

                <span>
                  Trang <strong>{totalPages === 0 ? 0 : page + 1}</strong> /{" "}
                  <strong>{totalPages}</strong>
                </span>

                <button
                  className="small-button"
                  disabled={last}
                  onClick={() => setPage(page + 1)}
                >
                  Trang sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {dangTaiChiTiet && (
        <div className="modal-overlay">
          <div className="modal-card product-detail-modal">
            <p>Đang tải chi tiết sản phẩm...</p>
          </div>
        </div>
      )}

      {sanPhamChiTiet && !dangTaiChiTiet && (
        <>
          <div className="modal-overlay">
            <div className="modal-card product-detail-modal">
              <div className="modal-header">
                <div>
                  <h2>Chi tiết sản phẩm</h2>
                  <p>{sanPhamChiTiet.tenSanPham}</p>
                </div>

                <button
                  className="modal-close-button"
                  onClick={dongChiTietSanPham}
                >
                  ×
                </button>
              </div>

              <div className="detail-section">
                <h3>Thông tin chung</h3>

                <div className="detail-grid">
                  <div>
                    <span>Mã sản phẩm</span>
                    <strong>{sanPhamChiTiet.maSanPham}</strong>
                  </div>

                  <div>
                    <span>Danh mục</span>
                    <strong>{sanPhamChiTiet.tenDanhMuc}</strong>
                  </div>

                  <div>
                    <span>Nhà sản xuất</span>
                    <strong>
                      {sanPhamChiTiet.tenNhaSanXuat || "Chưa cập nhật"}
                    </strong>
                  </div>

                  <div>
                    <span>Giá bán mặc định</span>
                    <strong>{dinhDangTien(sanPhamChiTiet.giaBan)}</strong>
                  </div>

                  <div>
                    <span>Thuốc kê đơn</span>
                    <strong>
                      {sanPhamChiTiet.laThuocKeDon ? "Có" : "Không"}
                    </strong>
                  </div>

                  <div>
                    <span>Trạng thái</span>
                    <strong>
                      {sanPhamChiTiet.trangThaiSanPham
                        ? "Đang bán"
                        : "Ngừng bán"}
                    </strong>
                  </div>
                </div>

                <div className="detail-description">
                  <span>Mô tả ngắn</span>
                  <p>{sanPhamChiTiet.moTaNgan || "Chưa có mô tả"}</p>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-header">
                  <h3>Đơn vị sản phẩm</h3>

                  <button className="small-button" onClick={moFormThemDonVi}>
                    + Thêm đơn vị
                  </button>
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã đơn vị SP</th>
                      <th>Đơn vị</th>
                      <th>Giá theo đơn vị</th>
                      <th>Đơn vị cơ sở</th>
                      <th>Cho phép bán</th>
                      <th>Cho phép nhập</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sanPhamChiTiet.danhSachDonViSanPham?.map((dv) => (
                      <tr key={dv.maDonViSanPham}>
                        <td>{dv.maDonViSanPham}</td>

                        <td>
                          {dv.tenDonViTinh} ({dv.kyHieu})
                        </td>

                        <td>
                          {dv.giaBanTheoDonVi !== null
                            ? dinhDangTien(dv.giaBanTheoDonVi)
                            : "Không có"}
                        </td>

                        <td>{dv.laDonViCoSo ? "Có" : "Không"}</td>
                        <td>{dv.choPhepBan ? "Có" : "Không"}</td>
                        <td>{dv.choPhepNhap ? "Có" : "Không"}</td>
                        <td>{dv.trangThai ? "Đang dùng" : "Đã ẩn"}</td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="small-button"
                              onClick={() => moFormSuaDonVi(dv)}
                            >
                              Sửa
                            </button>

                            {dv.trangThai ? (
                              <button
                                className="small-button warning-button"
                                onClick={() =>
                                  anDonViSanPham(dv.maDonViSanPham)
                                }
                              >
                                Ẩn
                              </button>
                            ) : (
                              <button
                                className="small-button success-button"
                                onClick={() =>
                                  hienDonViSanPham(dv.maDonViSanPham)
                                }
                              >
                                Hiện
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {(sanPhamChiTiet.danhSachDonViSanPham?.length ?? 0) ===
                      0 && (
                      <tr>
                        <td colSpan={8} className="empty-cell">
                          Sản phẩm chưa có đơn vị.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="detail-section">
                <div className="detail-section-header">
                  <h3>Quy đổi đơn vị</h3>

                  <button className="small-button" onClick={moFormThemQuyDoi}>
                    + Thêm quy đổi
                  </button>
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã quy đổi</th>
                      <th>Đơn vị nguồn</th>
                      <th>Số lượng nguồn</th>
                      <th>Đơn vị đích</th>
                      <th>Số lượng đích</th>
                      <th>Diễn giải</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sanPhamChiTiet.danhSachQuyDoiDonVi?.map((qd) => (
                      <tr key={qd.maQuyDoi}>
                        <td>{qd.maQuyDoi}</td>
                        <td>{qd.tenDonViNguon}</td>
                        <td>{qd.soLuongNguon}</td>
                        <td>{qd.tenDonViDich}</td>
                        <td>{qd.soLuongDich}</td>

                        <td>
                          {qd.soLuongNguon} {qd.tenDonViNguon} ={" "}
                          {qd.soLuongDich} {qd.tenDonViDich}
                        </td>

                        <td>{qd.trangThai ? "Đang dùng" : "Đã ẩn"}</td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="small-button"
                              onClick={() => moFormSuaQuyDoi(qd)}
                            >
                              Sửa
                            </button>

                            {qd.trangThai ? (
                              <button
                                className="small-button warning-button"
                                onClick={() => anQuyDoiDonVi(qd.maQuyDoi)}
                              >
                                Ẩn
                              </button>
                            ) : (
                              <button
                                className="small-button success-button"
                                onClick={() => hienQuyDoiDonVi(qd.maQuyDoi)}
                              >
                                Hiện
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {(sanPhamChiTiet.danhSachQuyDoiDonVi?.length ?? 0) ===
                      0 && (
                      <tr>
                        <td colSpan={8} className="empty-cell">
                          Sản phẩm chưa có quy đổi đơn vị.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DonViSanPhamFormModal
            isOpen={hienFormDonVi}
            maSanPham={sanPhamChiTiet.maSanPham}
            donViCanSua={donViCanSua}
            onClose={dongFormDonVi}
            onSuccess={xuLyLuuDonViThanhCong}
          />

          <QuyDoiDonViFormModal
            isOpen={hienFormQuyDoi}
            maSanPham={sanPhamChiTiet.maSanPham}
            danhSachDonViSanPham={sanPhamChiTiet.danhSachDonViSanPham || []}
            quyDoiCanSua={quyDoiCanSua}
            onClose={dongFormQuyDoi}
            onSuccess={xuLyLuuQuyDoiThanhCong}
          />
        </>
      )}
    </div>
  );
}

export default QuanLySanPham;