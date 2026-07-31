package com.pharma.backend.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.TaiKhoan;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    public String taoAccessToken(
        TaiKhoan taiKhoan,
        KhachHang khachHang
    ) {
        Date thoiGianTao = new Date();

        Date thoiGianHetHan = new Date(
            thoiGianTao.getTime() + accessTokenExpirationMs
        );

        return Jwts.builder()
            .subject(String.valueOf(taiKhoan.getMaTaiKhoan()))
            .claim(
                "maTaiKhoan",
                taiKhoan.getMaTaiKhoan()
            )
            .claim(
                "maKhachHang",
                khachHang.getMaKhachHang()
            )
            .claim(
                "soDienThoai",
                taiKhoan.getSoDienThoai()
            )
            .claim(
                "vaiTro",
                "KHACH_HANG"
            )
            .issuedAt(thoiGianTao)
            .expiration(thoiGianHetHan)
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
        Number maTaiKhoan = docClaims(token).get(
            "maTaiKhoan",
            Number.class
        );

        return maTaiKhoan.longValue();
    }

    public Long layMaKhachHang(String token) {
        Number maKhachHang = docClaims(token).get(
            "maKhachHang",
            Number.class
        );

        return maKhachHang.longValue();
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

    private SecretKey layKhoaBiMat() {
        byte[] khoaDaGiaiMa = Decoders.BASE64.decode(jwtSecret);

        return Keys.hmacShaKeyFor(khoaDaGiaiMa);
    }
}