package com.pharma.backend.security;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

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
    private static final String VAI_TRO_KHACH_HANG = "KHACH_HANG";
    private static final String VAI_TRO_ADMIN = "ADMIN";
    private static final String VAI_TRO_DUOC_SI = "DUOC_SI";

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

        if (authorizationHeader == null
                || !authorizationHeader.startsWith(TIEN_TO_BEARER)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
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

            Long maNhanVien = layGiaTriLong(
                    claims,
                    "maNhanVien"
            );

            String soDienThoai = claims.get(
                    "soDienThoai",
                    String.class
            );

            String vaiTro = claims.get(
                    "vaiTro",
String.class
            );

            if (vaiTro != null) {
                vaiTro = vaiTro
                        .trim()
                        .toUpperCase(Locale.ROOT);
            }

            if (maTaiKhoan != null
                    && vaiTro != null
                    && !vaiTro.isBlank()
                    && danhTinhPhuHopVaiTro(
                            vaiTro,
                            maKhachHang,
                            maNhanVien
                    )) {
                NguoiDungDangNhap nguoiDungDangNhap =
                        new NguoiDungDangNhap(
                                maTaiKhoan,
                                maKhachHang,
                                maNhanVien,
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
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private boolean danhTinhPhuHopVaiTro(
            String vaiTro,
            Long maKhachHang,
            Long maNhanVien
    ) {
        return switch (vaiTro) {
            case VAI_TRO_KHACH_HANG ->
                    maKhachHang != null && maNhanVien == null;

            case VAI_TRO_ADMIN, VAI_TRO_DUOC_SI ->
                    maNhanVien != null && maKhachHang == null;

            default -> false;
        };
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
