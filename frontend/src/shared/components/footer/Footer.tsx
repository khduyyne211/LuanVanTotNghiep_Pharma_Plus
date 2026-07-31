import "./Footer.css";

function Footer() {
  return (
    <footer className="customer-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Về chúng tôi</h3>
          <p>Giới thiệu Pharma+</p>
          <p>Hệ thống nhà thuốc</p>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản sử dụng</p>
        </div>

        <div className="footer-column">
          <h3>Danh mục</h3>
          <p>Thuốc</p>
          <p>Thực phẩm chức năng</p>
          <p>Dược mỹ phẩm</p>
          <p>Chăm sóc cá nhân</p>
          <p>Thiết bị y tế</p>
        </div>

        <div className="footer-column">
          <h3>Tìm hiểu thêm</h3>
          <p>Hướng dẫn mua hàng</p>
          <p>Chính sách giao hàng</p>
          <p>Chính sách đổi trả</p>
          <p>Câu hỏi thường gặp</p>
        </div>

        <div className="footer-column">
          <h3>Liên hệ</h3>
          <p>Tư vấn mua hàng: 1800 6928</p>
          <p>Hỗ trợ đơn hàng: 1800 1234</p>
          <p>Email: hotro@pharmaplus.vn</p>
          <p>Thời gian hỗ trợ: 7:00 - 22:00</p>
        </div>

        <div className="footer-column">
          <h3>Kết nối với chúng tôi</h3>
          <p>Facebook</p>
          <p>Zalo</p>
          <p>YouTube</p>
          <p>TikTok</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Pharma+. Website nhà thuốc trực tuyến phục vụ đồ án tốt nghiệp.
      </div>
    </footer>
  );
}

export default Footer;