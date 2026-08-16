package com.pharma.backend.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.pharma.backend.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                /*
                 * Hệ thống dùng JWT trong Authorization header,
                 * không dùng phiên đăng nhập bằng cookie.
                 */
                .csrf(
                        AbstractHttpConfigurer::disable)

                /*
                 * Sử dụng CorsConfigurationSource
                 * trong CorsConfig.
                 */
                .cors(
                        Customizer.withDefaults())

                /*
                 * Không lưu SecurityContext
                 * trong HTTP Session.
                 */
                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                /*
                 * Tắt màn hình đăng nhập mặc định.
                 */
                .formLogin(
                        AbstractHttpConfigurer::disable)

                /*
                 * Không dùng HTTP Basic
                 * cho xác thực người dùng Pharma+.
                 */
                .httpBasic(
                        AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(authorize -> authorize

                        /*
                         * Cho phép request kiểm tra CORS.
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**")
                        .permitAll()

                        /*
                         * API đăng nhập.
                         */
                        .requestMatchers(
                                "/api/xac-thuc/**")
                        .permitAll()

                        /*
                         * ZaloPay callback không có JWT.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/thanh-toan/zalopay/callback")
                        .permitAll()

                        /*
                         * API dành cho DƯỢC SĨ.
                         */
                        .requestMatchers(
                                "/api/duoc-si/**")
                        .hasRole(
                                "DUOC_SI")

                        /*
                         * API chỉ dành cho KHÁCH HÀNG.
                         */
                        .requestMatchers(
                                "/api/gio-hang/**",
                                "/api/thong-tin-ca-nhan/**",
                                "/api/dia-chi-giao-hang/**",
                                "/api/don-hang/khach-hang/**",
                                "/api/yeu-cau-tu-van/khach-hang/**",
                                "/api/don-thuoc/khach-hang/**",
                                "/api/thanh-toan/zalopay/**")
                        .hasRole(
                                "KHACH_HANG")

                        /*
                         * Các API còn lại giữ nguyên theo
                         * cấu hình hiện tại của hệ thống.
                         */
                        .anyRequest()
                        .permitAll())

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                (
                                        request,
                                        response,
                                        authException) -> traVeChuaDangNhap(
                                                response))

                        .accessDeniedHandler(
                                (
                                        request,
                                        response,
                                        accessDeniedException) -> traVeKhongCoQuyen(
                                                response)))

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void traVeChuaDangNhap(
            HttpServletResponse response) throws IOException {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED);

        response.setCharacterEncoding(
                StandardCharsets.UTF_8.name());

        response.setContentType(
                MediaType.APPLICATION_JSON_VALUE);

        response.getWriter().write(
                """
                        {
                          "trangThai": 401,
                          "thongBao": "Bạn cần đăng nhập để sử dụng chức năng này."
                        }
                        """);
    }

    private void traVeKhongCoQuyen(
            HttpServletResponse response) throws IOException {

        response.setStatus(
                HttpServletResponse.SC_FORBIDDEN);

        response.setCharacterEncoding(
                StandardCharsets.UTF_8.name());

        response.setContentType(
                MediaType.APPLICATION_JSON_VALUE);

        response.getWriter().write(
                """
                        {
                          "trangThai": 403,
                          "thongBao": "Tài khoản không có quyền thực hiện chức năng này."
                        }
                        """);
    }
}