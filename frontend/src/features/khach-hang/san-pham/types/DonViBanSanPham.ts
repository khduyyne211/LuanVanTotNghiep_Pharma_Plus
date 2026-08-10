export interface DonViBanSanPham {
  maDonViSanPham: number;
  maDonViTinh: number;
  tenDonViTinh: string;
  kyHieu: string | null;

  /**
   * Giá bán gốc theo đơn vị trước khuyến mãi.
   *
   * Tạm giữ kiểu null để tương thích với dữ liệu giỏ hàng cũ
   * đang lưu trong localStorage.
   */
  giaBanTheoDonVi: number | null;

  /**
   * Tổng số tiền được giảm trên một đơn vị.
   */
  soTienGiamMoiDonVi: number;

  /**
   * Giá khách thực trả trên một đơn vị.
   */
  giaSauKhuyenMai: number;

  coKhuyenMai: boolean;

  /**
   * Số lượng nguyên tối đa khách có thể mua theo đơn vị này.
   */
  soLuongToiDaCoTheBan: number;

  laDonViCoSo: boolean;
}