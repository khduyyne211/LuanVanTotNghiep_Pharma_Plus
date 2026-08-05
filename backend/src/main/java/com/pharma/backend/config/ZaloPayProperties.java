package com.pharma.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "zalopay")
public class ZaloPayProperties {

    private Integer appId;
    private String key1;
    private String key2;
    private String createEndpoint;
    private String queryEndpoint;
    private String callbackUrl;
    private String redirectUrl;
    /*
     * Thời gian hiệu lực tối đa của một mã QR.
     * Mặc định: 15 phút.
     */
    private Long expireDurationSeconds = 900L;

    /*
     * Thời hạn tối đa được phép thanh toán đơn hàng,
     * tính từ ngày đặt hàng.
     * Mặc định: 30 phút.
     */
    private Long orderPaymentDeadlineSeconds = 1800L;

    /*
     * Thời gian tiếp tục chờ callback sau khi hết hạn
     * tạo thanh toán mới.
     * Mặc định: 2 phút.
     */
    private Long callbackGracePeriodSeconds = 120L;

}
