package com.pharma.backend.config;

import org.springframework.boot.autoconfigure.web.servlet.MultipartProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import jakarta.servlet.MultipartConfigElement;

@Configuration
public class DonThuocMultipartConfig {

    /*
     * Giới hạn file upload ở tầng Servlet.
     *
     * Phía Service vẫn kiểm tra lại dung lượng
     * để đảm bảo đúng nghiệp vụ ảnh đơn thuốc.
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartProperties properties =
                new MultipartProperties();

        properties.setMaxFileSize(
                DataSize.ofMegabytes(5)
        );

        properties.setMaxRequestSize(
                DataSize.ofMegabytes(6)
        );

        return properties.createMultipartConfig();
    }
}