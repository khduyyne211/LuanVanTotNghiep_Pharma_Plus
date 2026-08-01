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
    private Long expireDurationSeconds = 900L;
}
