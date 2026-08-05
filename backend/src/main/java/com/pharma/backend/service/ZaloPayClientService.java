package com.pharma.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharma.backend.config.ZaloPayProperties;
import com.pharma.backend.dto.thanhtoan.TaoDonHangZaloPayResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZaloPayClientService {

    private static final String THUAT_TOAN_HMAC = "HmacSHA256";
    private static final int MA_THANH_CONG = 1;
    private static final long THOI_GIAN_TOI_THIEU = 300L;
    private static final long THOI_GIAN_TOI_DA = 2_592_000L;

    private final ZaloPayProperties zaloPayProperties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.create();

    public TaoDonHangZaloPayResponseDto taoDonHangThanhToan(
            String appTransId,
            String appUser,
            Long soTien,
            String moTa,
            Long thoiGianHieuLucGiay
    ) {
        kiemTraCauHinh();

        kiemTraDuLieu(
                appTransId,
                appUser,
                soTien,
                moTa,
                thoiGianHieuLucGiay
        );

        long appTime = System.currentTimeMillis();
        String item = "[]";
        String embedData = taoEmbedData();

        String duLieuTaoMac = String.join(
                "|",
                String.valueOf(zaloPayProperties.getAppId()),
                appTransId,
                appUser,
                String.valueOf(soTien),
                String.valueOf(appTime),
                embedData,
                item
        );

        String mac = taoHmacSha256(duLieuTaoMac, zaloPayProperties.getKey1());

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("app_id", zaloPayProperties.getAppId());
        request.put("app_user", appUser);
        request.put("app_trans_id", appTransId);
        request.put("app_time", appTime);
        request.put("expire_duration_seconds", thoiGianHieuLucGiay);
        request.put("amount", soTien);
        request.put("description", moTa);
        request.put("callback_url", zaloPayProperties.getCallbackUrl());
        request.put("item", item);
        request.put("embed_data", embedData);
        request.put("mac", mac);
        request.put("bank_code", "");

        TaoDonHangZaloPayResponseDto response;

        try {
            response = restClient.post()
.uri(zaloPayProperties.getCreateEndpoint())
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(TaoDonHangZaloPayResponseDto.class);
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Không thể kết nối đến ZaloPay Sandbox.",
                    exception
            );
        }

        kiemTraPhanHoi(response);
        return response;
    }

    private String taoEmbedData() {
        Map<String, Object> embedData = new LinkedHashMap<>();
        embedData.put("redirecturl", zaloPayProperties.getRedirectUrl());
        embedData.put("preferred_payment_method", List.of("zalopay_wallet"));

        try {
            return objectMapper.writeValueAsString(embedData);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tạo dữ liệu thanh toán ZaloPay.",
                    exception
            );
        }
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
                    "Không thể tạo chữ ký thanh toán ZaloPay.",
                    exception
            );
        }
    }

    private void kiemTraPhanHoi(TaoDonHangZaloPayResponseDto response) {
        if (response == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "ZaloPay không trả về dữ liệu."
            );
        }

        if (response.getReturnCode() == null
                || response.getReturnCode() != MA_THANH_CONG) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Không thể tạo thanh toán ZaloPay: "
                            + layThongBaoLoiZaloPay(response)
            );
        }

        if (response.getOrderUrl() == null
                || response.getOrderUrl().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "ZaloPay không trả về đường dẫn thanh toán."
            );
        }
    }
private String layThongBaoLoiZaloPay(
            TaoDonHangZaloPayResponseDto response
    ) {
        if (response.getSubReturnMessage() != null
                && !response.getSubReturnMessage().isBlank()) {
            return response.getSubReturnMessage();
        }

        if (response.getReturnMessage() != null
                && !response.getReturnMessage().isBlank()) {
            return response.getReturnMessage();
        }

        return "Phản hồi không xác định.";
    }

    private void kiemTraCauHinh() {
        if (zaloPayProperties.getAppId() == null
                || zaloPayProperties.getAppId() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay AppID chưa được cấu hình."
            );
        }

        if (zaloPayProperties.getKey1() == null
                || zaloPayProperties.getKey1().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay Key 1 chưa được cấu hình."
            );
        }

        if (zaloPayProperties.getCreateEndpoint() == null
                || zaloPayProperties.getCreateEndpoint().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay Create Endpoint chưa được cấu hình."
            );
        }

        if (zaloPayProperties.getCallbackUrl() == null
                || zaloPayProperties.getCallbackUrl().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay Callback URL chưa được cấu hình."
            );
        }

        if (zaloPayProperties.getRedirectUrl() == null
                || zaloPayProperties.getRedirectUrl().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZaloPay Redirect URL chưa được cấu hình."
            );
        }

        Long thoiGianHetHan = zaloPayProperties.getExpireDurationSeconds();

        if (thoiGianHetHan == null
                || thoiGianHetHan < THOI_GIAN_TOI_THIEU
                || thoiGianHetHan > THOI_GIAN_TOI_DA) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời gian hết hạn thanh toán ZaloPay không hợp lệ."
            );
        }
    }

    private void kiemTraDuLieu(
            String appTransId,
            String appUser,
            Long soTien,
            String moTa,
            Long thoiGianHieuLucGiay
    ) {
        if (appTransId == null
                || appTransId.isBlank()
                || appTransId.length() > 40
                || !appTransId.matches("^\\d{6}_.+")) {
            throw new IllegalArgumentException(
                    "app_trans_id ZaloPay không hợp lệ."
            );
}

        if (appUser == null
                || appUser.isBlank()
                || appUser.length() > 50) {
            throw new IllegalArgumentException(
                    "app_user ZaloPay không hợp lệ."
            );
        }

        if (soTien == null || soTien <= 0) {
            throw new IllegalArgumentException(
                    "Số tiền thanh toán ZaloPay không hợp lệ."
            );
        }

        if (moTa == null
                || moTa.isBlank()
                || moTa.length() > 256) {
            throw new IllegalArgumentException(
                    "Mô tả thanh toán ZaloPay không hợp lệ."
            );
        }

        if (thoiGianHieuLucGiay == null
                || thoiGianHieuLucGiay < THOI_GIAN_TOI_THIEU
                || thoiGianHieuLucGiay > THOI_GIAN_TOI_DA) {
            throw new IllegalArgumentException(
                    "Thời gian hiệu lực mã QR ZaloPay không hợp lệ."
            );
        }
    }
}
