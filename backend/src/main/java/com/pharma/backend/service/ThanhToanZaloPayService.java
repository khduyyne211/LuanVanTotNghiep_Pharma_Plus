package com.pharma.backend.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharma.backend.config.ZaloPayProperties;
import com.pharma.backend.dto.thanhtoan.TaoDonHangZaloPayResponseDto;
import com.pharma.backend.dto.thanhtoan.TaoThanhToanZaloPayResponseDto;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.DonHangRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ThanhToanZaloPayService {

    private static final ZoneId MUI_GIO_VIET_NAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DINH_DANG_NGAY_GIAO_DICH =
            DateTimeFormatter.ofPattern("yyMMdd").withZone(MUI_GIO_VIET_NAM);
    private static final String THUAT_TOAN_HMAC = "HmacSHA256";
    private static final int LOAI_CALLBACK_DON_HANG = 1;

    /*
     * Ví dụ app_trans_id:
     * 260801_DH13_376080c8
     *
     * Nhóm thứ nhất là mã đơn hàng.
     */
    private static final Pattern MAU_APP_TRANS_ID =
            Pattern.compile("^\\d{6}_DH(\\d+)_[a-fA-F0-9]{8}$");

    private final DonHangRepository donHangRepository;
    private final ChuanBiThanhToanZaloPayService chuanBiThanhToanZaloPayService;
    private final ZaloPayClientService zaloPayClientService;
    private final ZaloPayProperties zaloPayProperties;
    private final ObjectMapper objectMapper;

    public TaoThanhToanZaloPayResponseDto taoThanhToan(
            Long maDonHang,
            Long maKhachHang
    ) {
        /*
        * Service chuẩn bị sẽ:
        * - Khóa đơn hàng.
        * - Kiểm tra quyền sở hữu.
        * - Kiểm tra phương thức và trạng thái.
        * - Kiểm tra thời hạn thanh toán.
        * - Cập nhật hủy đơn nếu đã quá hạn.
        */
        DuLieuChuanBiThanhToanZaloPay duLieu =
                chuanBiThanhToanZaloPayService
                        .chuanBiThanhToan(
                                maDonHang,
                                maKhachHang
                        );

        /*
        * Trạng thái hết hạn đã được commit trong transaction
        * của ChuanBiThanhToanZaloPayService.
        *
        * Ném lỗi tại đây sẽ không rollback việc hủy đơn.
        */
        if (duLieu.isDaHetHan()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã hết thời hạn thanh toán "
                            + "và không thể tạo mã QR mới."
            );
        }

        Long soTien = chuyenTongTienSangLong(
                duLieu.getTongThanhToan()
        );

        String appTransId = taoAppTransId(
                duLieu.getMaDonHang()
        );

        String appUser = taoAppUser(
                maKhachHang
        );

        String moTa = taoMoTaThanhToan(
                duLieu.getMaDonHang()
        );

        TaoDonHangZaloPayResponseDto responseZaloPay =
                zaloPayClientService
                        .taoDonHangThanhToan(
                                appTransId,
                                appUser,
                                soTien,
                                moTa,
                                duLieu.getThoiGianHieuLucGiay()
                        );

        return new TaoThanhToanZaloPayResponseDto(
                duLieu.getMaDonHang(),
                appTransId,
                soTien,
                responseZaloPay.getOrderUrl(),
                duLieu.getThoiGianHieuLucGiay(),
                TrangThaiThanhToan
                        .CHO_THANH_TOAN
                        .name()
        );
    }

    @Transactional
    public Map<String, Object> xuLyCallback(
            Map<String, Object> callbackPayload
    ) {
        if (callbackPayload == null || callbackPayload.isEmpty()) {
            return taoPhanHoiCallback(2, "invalid payload");
        }

        String data = chuyenSangChuoi(callbackPayload.get("data"));
        String macNhanDuoc = chuyenSangChuoi(callbackPayload.get("mac"));
        Integer type = chuyenSangInteger(callbackPayload.get("type"));

        if (data == null || data.isBlank()
                || macNhanDuoc == null || macNhanDuoc.isBlank()) {
            return taoPhanHoiCallback(2, "invalid payload");
        }

        if (type == null || type != LOAI_CALLBACK_DON_HANG) {
            log.warn("Bỏ qua callback ZaloPay không phải đơn hàng: type={}", type);
            return taoPhanHoiCallback(2, "invalid callback type");
        }

        /*
         * Chỉ cần kiểm tra cấu hình sau khi payload
         * đã có đủ cấu trúc callback cần thiết.
         */
        kiemTraCauHinhCallback();

        /*
         * Phải xác minh MAC bằng Key 2 trước khi tin tưởng
         * nội dung JSON do callback gửi đến.
         */
        if (!macCallbackHopLe(data, macNhanDuoc)) {
            log.warn("Callback ZaloPay có MAC không hợp lệ.");
            return taoPhanHoiCallback(2, "invalid mac");
        }

        DuLieuCallbackZaloPay duLieu = docDuLieuCallback(data);

        if (duLieu == null) {
            return taoPhanHoiCallback(2, "invalid data");
        }

        if (!zaloPayProperties.getAppId().equals(duLieu.appId())) {
            log.warn(
                    "Callback ZaloPay sai AppID: appId={}, appTransId={}",
                    duLieu.appId(),
                    duLieu.appTransId()
            );

            return taoPhanHoiCallback(2, "invalid app id");
        }

        Long maDonHang = layMaDonHangTuAppTransId(duLieu.appTransId());

        if (maDonHang == null) {
            log.warn("app_trans_id không thuộc Pharma+: {}", duLieu.appTransId());
            return taoPhanHoiCallback(2, "invalid app trans id");
        }

        /*
         * Khóa bi quan đơn hàng để tránh hai callback
         * đồng thời cùng cập nhật một giao dịch.
         */
        DonHang donHang = donHangRepository.timTheoMaDeCapNhat(maDonHang)
.orElse(null);

        if (donHang == null) {
            log.warn(
                    "Callback ZaloPay không tìm thấy đơn hàng: maDonHang={}, appTransId={}",
                    maDonHang,
                    duLieu.appTransId()
            );

            return taoPhanHoiCallback(2, "order not found");
        }

        if (!callbackKhopVoiDonHang(duLieu, donHang)) {
            log.warn(
                    "Callback ZaloPay không khớp đơn hàng: maDonHang={}, appTransId={}, amount={}, appUser={}",
                    maDonHang,
                    duLieu.appTransId(),
                    duLieu.soTien(),
                    duLieu.appUser()
            );

            return taoPhanHoiCallback(2, "order data invalid");
        }

        /*
         * Callback có thể được gửi lại nhiều lần.
         * Đơn đã thanh toán thì chỉ xác nhận thành công,
         * không cập nhật lại.
         */
        if (donHang.getTrangThaiThanhToan() == TrangThaiThanhToan.DA_THANH_TOAN) {
            log.info(
                    "Đơn hàng đã được xử lý callback ZaloPay trước đó: maDonHang={}, appTransId={}",
                    maDonHang,
                    duLieu.appTransId()
            );

            return taoPhanHoiCallback(1, "success");
        }

        /*
         * Không kích hoạt lại đơn đã hủy.
         */
        if (donHang.getTrangThaiDonHang() == TrangThaiDonHang.DA_HUY) {
            log.warn(
                    "Bỏ qua callback ZaloPay của đơn đã hủy: maDonHang={}, appTransId={}",
                    maDonHang,
                    duLieu.appTransId()
            );

            return taoPhanHoiCallback(1, "success");
        }

        /*
         * Callback chỉ xử lý đơn ZaloPay đang chờ thanh toán:
         * - Thanh toán: CHO_THANH_TOAN
         * - Đơn hàng: CHO_THANH_TOAN
         */
        if (donHang.getTrangThaiThanhToan() != TrangThaiThanhToan.CHO_THANH_TOAN
                || donHang.getTrangThaiDonHang() != TrangThaiDonHang.CHO_THANH_TOAN) {
            log.warn(
                    "Đơn không còn chờ thanh toán ZaloPay: maDonHang={}, trangThaiThanhToan={}, trangThaiDonHang={}",
                    maDonHang,
                    donHang.getTrangThaiThanhToan(),
                    donHang.getTrangThaiDonHang()
            );

            return taoPhanHoiCallback(1, "success");
        }

        donHang.setTrangThaiThanhToan(
                TrangThaiThanhToan.DA_THANH_TOAN
        );

        donHang.setTrangThaiDonHang(
                TrangThaiDonHang.CHO_XU_LY
        );

        donHangRepository.save(donHang);

        log.info(
                "Cập nhật thanh toán ZaloPay thành công: maDonHang={}, appTransId={}, zpTransId={}, amount={}",
                maDonHang,
                duLieu.appTransId(),
                duLieu.zpTransId(),
                duLieu.soTien()
        );

        return taoPhanHoiCallback(1, "success");
    }

    public Map<String, Object> layTrangThaiThanhToan(
            Long maDonHang,
Long maKhachHang
    ) {
        kiemTraMaDonHang(maDonHang);
        kiemTraMaKhachHang(maKhachHang);

        DonHang donHang = donHangRepository.findById(maDonHang)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy đơn hàng."
                ));

        if (donHang.getKhachHang() == null
                || !maKhachHang.equals(
                        donHang.getKhachHang().getMaKhachHang()
                )) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn không có quyền xem trạng thái đơn hàng này."
            );
        }

        return Map.of(
                "maDonHang", donHang.getMaDonHang(),
                "trangThaiThanhToan", donHang.getTrangThaiThanhToan().name(),
                "trangThaiDonHang", donHang.getTrangThaiDonHang().name()
        );
    }

    private void kiemTraMaDonHang(Long maDonHang) {
        if (maDonHang == null || maDonHang <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn hàng không hợp lệ."
            );
        }
    }

    private void kiemTraMaKhachHang(Long maKhachHang) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }

    private Long chuyenTongTienSangLong(BigDecimal tongThanhToan) {
        if (tongThanhToan == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng chưa có tổng tiền thanh toán."
            );
        }

        try {
            long soTien = tongThanhToan.longValueExact();

            if (soTien <= 0) {
                throw new ArithmeticException();
            }

            return soTien;
        } catch (ArithmeticException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tổng tiền đơn hàng không hợp lệ để thanh toán ZaloPay."
            );
        }
    }

    private String taoAppTransId(Long maDonHang) {
        String ngayHienTai = DINH_DANG_NGAY_GIAO_DICH.format(Instant.now());

        String maNgauNhien = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8);

        String appTransId =
                ngayHienTai + "_DH" + maDonHang + "_" + maNgauNhien;

        if (appTransId.length() > 40) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Không thể tạo mã giao dịch ZaloPay cho đơn hàng."
            );
        }

        return appTransId;
    }

    private String taoAppUser(Long maKhachHang) {
        return "KH" + maKhachHang;
    }

    private String taoMoTaThanhToan(Long maDonHang) {
        return "Thanh toan don hang DH" + maDonHang;
    }

    private DuLieuCallbackZaloPay docDuLieuCallback(String data) {
        try {
            JsonNode json = objectMapper.readTree(data);

            JsonNode appIdNode = json.get("app_id");
            JsonNode appTransIdNode = json.get("app_trans_id");
            JsonNode amountNode = json.get("amount");
            JsonNode appUserNode = json.get("app_user");
            JsonNode zpTransIdNode = json.get("zp_trans_id");

            if (appIdNode == null || !appIdNode.canConvertToInt()
                    || appTransIdNode == null || !appTransIdNode.isTextual()
                    || amountNode == null || !amountNode.canConvertToLong()
                    || appUserNode == null || !appUserNode.isTextual()) {
                return null;
            }

            Long zpTransId = zpTransIdNode != null
                    && zpTransIdNode.canConvertToLong()
                            ? zpTransIdNode.asLong()
                            : null;

            return new DuLieuCallbackZaloPay(
                    appIdNode.asInt(),
                    appTransIdNode.asText(),
amountNode.asLong(),
                    appUserNode.asText(),
                    zpTransId
            );
        } catch (JsonProcessingException exception) {
            log.warn(
                    "Không thể đọc data callback ZaloPay: {}",
                    exception.getMessage()
            );

            return null;
        }
    }

    private boolean callbackKhopVoiDonHang(
            DuLieuCallbackZaloPay duLieu,
            DonHang donHang
    ) {
        if (duLieu.soTien() == null
                || donHang.getTongThanhToan() == null) {
            return false;
        }

        if (donHang.getPhuongThucThanhToan()
                != PhuongThucThanhToan.ZALOPAY) {
            return false;
        }

        if (donHang.getKhachHang() == null
                || donHang.getKhachHang().getMaKhachHang() == null) {
            return false;
        }

        String appUserMongDoi = taoAppUser(
                donHang.getKhachHang().getMaKhachHang()
        );

        if (!appUserMongDoi.equals(duLieu.appUser())) {
            return false;
        }

        BigDecimal soTienCallback = BigDecimal.valueOf(duLieu.soTien());

        return soTienCallback.compareTo(
                donHang.getTongThanhToan()
        ) == 0;
    }

    private boolean macCallbackHopLe(
            String data,
            String macNhanDuoc
    ) {
        String macDaTinh = taoHmacSha256(
                data,
                zaloPayProperties.getKey2()
        );

        byte[] macDaTinhBytes = macDaTinh.getBytes(
                StandardCharsets.US_ASCII
        );

        byte[] macNhanDuocBytes = macNhanDuoc
                .trim()
                .toLowerCase(Locale.ROOT)
                .getBytes(StandardCharsets.US_ASCII);

        return MessageDigest.isEqual(
                macDaTinhBytes,
                macNhanDuocBytes
        );
    }

    private String taoHmacSha256(String duLieu, String khoa) {
        try {
            Mac hmac = Mac.getInstance(THUAT_TOAN_HMAC);

            SecretKeySpec secretKey = new SecretKeySpec(
                    khoa.getBytes(StandardCharsets.UTF_8),
                    THUAT_TOAN_HMAC
            );

            hmac.init(secretKey);

            byte[] ketQua = hmac.doFinal(
                    duLieu.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(ketQua);
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể xác minh chữ ký callback ZaloPay.",
                    exception
            );
        }
    }

    private Long layMaDonHangTuAppTransId(String appTransId) {
        if (appTransId == null || appTransId.isBlank()) {
            return null;
        }

        Matcher matcher = MAU_APP_TRANS_ID.matcher(appTransId);

        if (!matcher.matches()) {
            return null;
        }

        try {
long maDonHang = Long.parseLong(matcher.group(1));
            return maDonHang > 0 ? maDonHang : null;
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private Map<String, Object> taoPhanHoiCallback(
            int returnCode,
            String returnMessage
    ) {
        return Map.of(
                "return_code", returnCode,
                "return_message", returnMessage
        );
    }

    private String chuyenSangChuoi(Object giaTri) {
        return giaTri == null ? null : giaTri.toString();
    }

    private Integer chuyenSangInteger(Object giaTri) {
        if (giaTri == null) {
            return null;
        }

        if (giaTri instanceof Number number) {
            return number.intValue();
        }

        try {
            return Integer.valueOf(giaTri.toString());
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private void kiemTraCauHinhCallback() {
        if (zaloPayProperties.getAppId() == null
                || zaloPayProperties.getAppId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay AppID chưa được cấu hình."
            );
        }

        if (zaloPayProperties.getKey2() == null
                || zaloPayProperties.getKey2().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay Key 2 chưa được cấu hình."
            );
        }
    }

    private record DuLieuCallbackZaloPay(
            Integer appId,
            String appTransId,
            Long soTien,
            String appUser,
            Long zpTransId
    ) {
    }
}
