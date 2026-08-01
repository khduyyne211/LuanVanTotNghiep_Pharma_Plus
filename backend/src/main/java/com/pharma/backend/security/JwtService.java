package com.pharma.backend.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.TaiKhoan;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String VAI_TRO_KHACH_HANG = "KHACH_HANG";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    /*
     * Giữ lại hàm cũ để luồng khách hàng hiện tại vẫn hoạt động
     * trong lúc đang chuẩn hóa đăng nhập dùng chung.
     */
    public String taoAccessToken(
            TaiKhoan taiKhoan,
            KhachHang khachHang
    ) {
        return taoAccessToken(
                taiKhoan,
                khachHang.getMaKhachHang(),
                null,
                VAI_TRO_KHACH_HANG
        );
    }

    public String taoAccessToken(
            TaiKhoan taiKhoan,
            Long maKhachHang,
            Long maNhanVien,
            String vaiTro
    ) {
        if (taiKhoan == null || taiKhoan.getMaTaiKhoan() == null) {
            throw new IllegalArgumentException(
                    "Tài khoản tạo token không hợp lệ."
            );
        }

        if (vaiTro == null || vaiTro.isBlank()) {
            throw new IllegalArgumentException(
                    "Vai trò tạo token không hợp lệ."
            );
        }

        Date thoiGianTao = new Date();
        Date thoiGianHetHan = new Date(
                thoiGianTao.getTime() + accessTokenExpirationMs
        );

        JwtBuilder tokenBuilder = Jwts.builder()
                .subject(String.valueOf(taiKhoan.getMaTaiKhoan()))
                .claim("maTaiKhoan", taiKhoan.getMaTaiKhoan())
                .claim("soDienThoai", taiKhoan.getSoDienThoai())
                .claim("vaiTro", vaiTro)
                .issuedAt(thoiGianTao)
                .expiration(thoiGianHetHan);

        if (maKhachHang != null) {
            tokenBuilder.claim("maKhachHang", maKhachHang);
        }

        if (maNhanVien != null) {
            tokenBuilder.claim("maNhanVien", maNhanVien);
        }

        return tokenBuilder
                .signWith(layKhoaBiMat())
                .compact();
    }

    public Claims docClaims(String token) {
        return Jwts.parser()
                .verifyWith(layKhoaBiMat())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long layMaTaiKhoan(String token) {
        return layGiaTriLong(
docClaims(token),
                "maTaiKhoan"
        );
    }

    public Long layMaKhachHang(String token) {
        return layGiaTriLong(
                docClaims(token),
                "maKhachHang"
        );
    }

    public Long layMaNhanVien(String token) {
        return layGiaTriLong(
                docClaims(token),
                "maNhanVien"
        );
    }

    public String layVaiTro(String token) {
        return docClaims(token).get(
                "vaiTro",
                String.class
        );
    }

    public boolean tokenHopLe(String token) {
        try {
            docClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
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

    private SecretKey layKhoaBiMat() {
        byte[] khoaDaGiaiMa = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(khoaDaGiaiMa);
    }
}
