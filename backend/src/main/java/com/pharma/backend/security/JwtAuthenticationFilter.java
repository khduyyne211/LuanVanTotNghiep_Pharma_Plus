package com.pharma.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String TIEN_TO_BEARER = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader = request.getHeader(
            HttpHeaders.AUTHORIZATION
        );

        /*
         * Không có Authorization hoặc không bắt đầu bằng Bearer:
         * chưa xác thực người dùng, tiếp tục chuyển request đi.
         *
         * Nếu endpoint là public thì request vẫn được xử lý.
         * Nếu endpoint yêu cầu đăng nhập thì SecurityConfig sẽ trả 401.
         */
        if (
            authorizationHeader == null ||
            !authorizationHeader.startsWith(TIEN_TO_BEARER)
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Nếu request đã được xác thực ở filter trước đó thì không cần
         * đọc token lại.
         */
        if (
            SecurityContextHolder
                .getContext()
                .getAuthentication() != null
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader
            .substring(TIEN_TO_BEARER.length())
            .trim();

        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.docClaims(token);

            Long maTaiKhoan = layGiaTriLong(
                claims,
                "maTaiKhoan"
            );

            Long maKhachHang = layGiaTriLong(
                claims,
                "maKhachHang"
            );

            String soDienThoai = claims.get(
                "soDienThoai",
                String.class
            );

            String vaiTro = claims.get(
                "vaiTro",
                String.class
            );

            if (
                maTaiKhoan != null &&
                maKhachHang != null &&
                vaiTro != null &&
                !vaiTro.isBlank()
            ) {
                NguoiDungDangNhap nguoiDungDangNhap =
                    new NguoiDungDangNhap(
                        maTaiKhoan,
                        maKhachHang,
                        soDienThoai,
                        vaiTro
                    );

                SimpleGrantedAuthority quyenHan =
                    new SimpleGrantedAuthority(
                        "ROLE_" + vaiTro
                    );

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        nguoiDungDangNhap,
                        null,
                        List.of(quyenHan)
                    );

                authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );

                SecurityContext securityContext =
                    SecurityContextHolder.createEmptyContext();

                securityContext.setAuthentication(authentication);

                SecurityContextHolder.setContext(securityContext);
            }

        } catch (JwtException | IllegalArgumentException exception) {
            /*
             * Token sai chữ ký, hết hạn hoặc sai định dạng:
             * xóa xác thực và để SecurityConfig trả 401 nếu endpoint
             * yêu cầu đăng nhập.
             */
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private Long layGiaTriLong(
        Claims claims,
        String tenClaim
    ) {
        Object giaTri = claims.get(tenClaim);

        if (giaTri == null) {
            return null;
        }

        if (giaTri instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(giaTri.toString());
    }
}