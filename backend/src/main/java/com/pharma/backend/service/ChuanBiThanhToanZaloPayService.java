package com.pharma.backend.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.config.ZaloPayProperties;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.DonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChuanBiThanhToanZaloPayService {

    private static final ZoneId MUI_GIO_VIET_NAM =
            ZoneId.of("Asia/Ho_Chi_Minh");

    private static final long THOI_GIAN_QR_TOI_THIEU_GIAY =
            300L;

    private final DonHangRepository donHangRepository;

    private final ZaloPayProperties zaloPayProperties;

    @Transactional
    public DuLieuChuanBiThanhToanZaloPay chuanBiThanhToan(
            Long maDonHang,
            Long maKhachHang
    ) {
        kiemTraMaDonHang(maDonHang);
        kiemTraMaKhachHang(maKhachHang);

        /*
         * Khóa đơn để tránh:
         * - Hai yêu cầu thanh toán lại chạy đồng thời.
         * - Thanh toán lại và tác vụ hết hạn cùng cập nhật đơn.
         * - Callback và yêu cầu tạo QR thay đổi trạng thái đồng thời.
         */
        DonHang donHang =
                donHangRepository
                        .timTheoMaDeCapNhat(maDonHang)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Không tìm thấy đơn hàng."
                                )
                        );

        kiemTraQuyenThanhToan(
                donHang,
                maKhachHang
        );

        kiemTraTrangThaiDuocThanhToan(
                donHang
        );

        long thoiHanThanhToanGiay =
                layThoiHanThanhToanDonHang();

        long thoiGianQrToiDaGiay =
                layThoiGianQrToiDa();

        long thoiGianChoCallbackGiay =
                layThoiGianChoCallback();

        LocalDateTime thoiDiemHienTai =
                LocalDateTime.now(
                        MUI_GIO_VIET_NAM
                );

        LocalDateTime thoiDiemHetHanThanhToan =
                donHang.getNgayDatHang()
                        .plusSeconds(
                                thoiHanThanhToanGiay
                        );

        LocalDateTime thoiDiemHuyDon =
                thoiDiemHetHanThanhToan
                        .plusSeconds(
                                thoiGianChoCallbackGiay
                        );

        /*
        * Đã hết cả thời hạn thanh toán và thời gian
        * chờ callback:
        *
        * CHO_THANH_TOAN + CHO_THANH_TOAN
        * → DA_HUY + THANH_TOAN_THAT_BAI
        */
        if (!thoiDiemHienTai.isBefore(
                thoiDiemHuyDon
        )) {
            donHang.setTrangThaiDonHang(
                    TrangThaiDonHang.DA_HUY
            );

            donHang.setTrangThaiThanhToan(
                    TrangThaiThanhToan
                            .THANH_TOAN_THAT_BAI
            );

            donHangRepository.save(donHang);

            return new DuLieuChuanBiThanhToanZaloPay(
                    donHang.getMaDonHang(),
                    donHang.getTongThanhToan(),
                    null,
                    true
            );
        }

        /*
        * Đã hết 30 phút nhưng vẫn còn trong khoảng
        * chờ callback.
        *
        * Không tạo QR mới và cũng chưa hủy đơn.
        */
        if (!thoiDiemHienTai.isBefore(
                thoiDiemHetHanThanhToan
        )) {
            return new DuLieuChuanBiThanhToanZaloPay(
                    donHang.getMaDonHang(),
                    donHang.getTongThanhToan(),
                    null,
                    true
            );
        }

        long thoiGianConLaiGiay =
                Duration.between(
                        thoiDiemHienTai,
                        thoiDiemHetHanThanhToan
                ).getSeconds();
        if (thoiGianConLaiGiay
                < THOI_GIAN_QR_TOI_THIEU_GIAY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Thời gian còn lại không đủ để tạo mã QR mới. "
                            + "Đơn hàng sẽ tự hủy khi hết thời hạn thanh toán."
            );
        }

        long thoiGianHieuLucQrGiay =
                Math.min(
                        thoiGianQrToiDaGiay,
                        thoiGianConLaiGiay
                );

        return new DuLieuChuanBiThanhToanZaloPay(
                donHang.getMaDonHang(),
                donHang.getTongThanhToan(),
                thoiGianHieuLucQrGiay,
                false
        );
    }

    private void kiemTraMaDonHang(
            Long maDonHang
    ) {
        if (maDonHang == null
                || maDonHang <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn hàng không hợp lệ."
            );
        }
    }

    private void kiemTraMaKhachHang(
            Long maKhachHang
    ) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }

    private void kiemTraQuyenThanhToan(
            DonHang donHang,
            Long maKhachHang
    ) {
        if (donHang.getKhachHang() == null
                || !maKhachHang.equals(
                        donHang.getKhachHang()
                                .getMaKhachHang()
                )) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn không có quyền thanh toán đơn hàng này."
            );
        }

        if (donHang.getPhuongThucThanhToan()
                != PhuongThucThanhToan.ZALOPAY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng không sử dụng phương thức thanh toán ZaloPay."
            );
        }
    }

    private void kiemTraTrangThaiDuocThanhToan(
            DonHang donHang
    ) {
        if (donHang.getTrangThaiThanhToan()
                == TrangThaiThanhToan.DA_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã được thanh toán."
            );
        }

        if (donHang.getTrangThaiDonHang()
                == TrangThaiDonHang.DA_HUY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã bị hủy."
            );
        }

        if (donHang.getTrangThaiThanhToan()
                != TrangThaiThanhToan.CHO_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Trạng thái thanh toán của đơn hàng không hợp lệ."
            );
        }

        if (donHang.getTrangThaiDonHang()
                != TrangThaiDonHang.CHO_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng không còn ở trạng thái chờ thanh toán."
            );
        }

        if (donHang.getNgayDatHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Đơn hàng không có thời điểm đặt hàng."
            );
        }
    }

    private long layThoiHanThanhToanDonHang() {
        Long thoiHanThanhToan =
                zaloPayProperties
                        .getOrderPaymentDeadlineSeconds();

        if (thoiHanThanhToan == null
                || thoiHanThanhToan <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời hạn thanh toán đơn hàng ZaloPay không hợp lệ."
            );
        }

        return thoiHanThanhToan;
    }

    private long layThoiGianQrToiDa() {
        Long thoiGianQrToiDa =
                zaloPayProperties
                        .getExpireDurationSeconds();

        if (thoiGianQrToiDa == null
                || thoiGianQrToiDa
                < THOI_GIAN_QR_TOI_THIEU_GIAY) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời gian hiệu lực mã QR ZaloPay không hợp lệ."
            );
        }

        return thoiGianQrToiDa;
    }

    private long layThoiGianChoCallback() {
        Long thoiGianChoCallback =
                zaloPayProperties
                        .getCallbackGracePeriodSeconds();

        if (thoiGianChoCallback == null
                || thoiGianChoCallback < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời gian chờ callback ZaloPay không hợp lệ."
            );
        }

        return thoiGianChoCallback;
    }
}