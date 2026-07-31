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
        HttpSecurity http
    ) throws Exception {

        http
            /*
             * Hệ thống dùng JWT trong Authorization header,
             * không dùng phiên đăng nhập bằng cookie.
             */
            .csrf(AbstractHttpConfigurer::disable)

            /*
             * Sử dụng CorsConfigurationSource trong CorsConfig.
             */
            .cors(Customizer.withDefaults())

            /*
             * Không lưu SecurityContext trong HTTP Session.
             * Mỗi request phải tự gửi JWT.
             */
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            /*
             * Tắt màn hình đăng nhập mặc định của Spring Security.
             */
            .formLogin(AbstractHttpConfigurer::disable)

            /*
             * Không dùng HTTP Basic Authentication.
             */
            .httpBasic(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(authorize ->
                authorize
                    /*
                     * Cho phép request kiểm tra CORS.
                     */
                    .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                    )
                    .permitAll()

                    /*
                     * API đăng nhập phải được gọi khi chưa có token.
                     */
                    .requestMatchers(
                        "/api/xac-thuc/**"
                    )
                    .permitAll()

                    /*
                    * Máy chủ ZaloPay gọi callback nên không có
                    * JWT của khách hàng.
                    *
                    * Payload được xác minh bằng Key 2.
                    */
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/thanh-toan/zalopay/callback"
                    )
                    .permitAll()

                    /*
                     * Chỉ khách hàng đã đăng nhập mới được gọi
                     * các API giỏ hàng và thanh toán.
                     */
                    .requestMatchers(
                        "/api/gio-hang/**",
                        "/api/dia-chi-giao-hang/**",
                        "/api/don-hang/khach-hang/**",
                        "/api/thanh-toan/zalopay/**"
                    )
                    .hasRole("KHACH_HANG")

                    /*
                     * Giai đoạn hiện tại, các API còn lại vẫn công khai.
                     */
                    .anyRequest()
                    .permitAll()
            )

            .exceptionHandling(exception ->
                exception
                    .authenticationEntryPoint(
                        (request, response, authException) ->
                            traVeChuaDangNhap(response)
                    )
                    .accessDeniedHandler(
                        (request, response, accessDeniedException) ->
                            traVeKhongCoQuyen(response)
                    )
            )

            /*
             * JwtAuthenticationFilter phải chạy trước filter đăng nhập
             * mặc định của Spring Security.
             */
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    private void traVeChuaDangNhap(
        HttpServletResponse response
    ) throws IOException {
        response.setStatus(
            HttpServletResponse.SC_UNAUTHORIZED
        );

        response.setCharacterEncoding(
            StandardCharsets.UTF_8.name()
        );

        response.setContentType(
            MediaType.APPLICATION_JSON_VALUE
        );

        response.getWriter().write(
            """
            {
              "trangThai": 401,
              "thongBao": "Bạn cần đăng nhập để sử dụng chức năng này."
            }
            """
        );
    }

    private void traVeKhongCoQuyen(
        HttpServletResponse response
    ) throws IOException {
        response.setStatus(
            HttpServletResponse.SC_FORBIDDEN
        );

        response.setCharacterEncoding(
            StandardCharsets.UTF_8.name()
        );

        response.setContentType(
            MediaType.APPLICATION_JSON_VALUE
        );

        response.getWriter().write(
            """
            {
              "trangThai": 403,
              "thongBao": "Tài khoản không có quyền thực hiện chức năng này."
            }
            """
        );
    }
}