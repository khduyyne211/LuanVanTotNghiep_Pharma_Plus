package com.pharma.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharma.backend.entity.ChiTietPhieuNhap;
import com.pharma.backend.enums.nhapkho.TrangThaiLo;
import com.pharma.backend.enums.nhapkho.TrangThaiPhieuNhap;
import com.pharma.backend.repository.projection.LoSapHetHanProjection;
import com.pharma.backend.repository.projection.TonKhoThapProjection;

import jakarta.persistence.LockModeType;

@Repository
public interface ChiTietPhieuNhapRepository
        extends JpaRepository<ChiTietPhieuNhap, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT ctpn
            FROM ChiTietPhieuNhap ctpn
            JOIN FETCH ctpn.phieuNhapKho pn
            WHERE ctpn.sanPham.maSanPham = :maSanPham
              AND ctpn.soLuongConLaiTheoQuyDoi > 0
              AND (
                    ctpn.hanSuDung IS NULL
                    OR ctpn.hanSuDung >= CURRENT_DATE
              )
              AND ctpn.trangThaiLo = 'DANG_SU_DUNG'
              AND pn.trangThaiPhieuNhap = 'DA_NHAP'
            ORDER BY
              CASE
                    WHEN ctpn.hanSuDung IS NULL THEN 1
                    ELSE 0
              END,
              ctpn.hanSuDung ASC,
              pn.ngayNhap ASC,
              ctpn.maChiTietPhieuNhap ASC
            """)
    List<ChiTietPhieuNhap> layDanhSachLoTheoFefoDeCapNhat(
            @Param("maSanPham") Long maSanPham
    );

    @Query("""
            SELECT COALESCE(SUM(ctpn.soLuongConLaiTheoQuyDoi), 0)
            FROM ChiTietPhieuNhap ctpn
            JOIN ctpn.phieuNhapKho pn
            WHERE ctpn.sanPham.maSanPham = :maSanPham
              AND ctpn.soLuongConLaiTheoQuyDoi > 0
              AND (
                    ctpn.hanSuDung IS NULL
                    OR ctpn.hanSuDung >= CURRENT_DATE
              )
              AND ctpn.trangThaiLo = 'DANG_SU_DUNG'
              AND pn.trangThaiPhieuNhap = 'DA_NHAP'
            """)
    BigDecimal tinhTongTonKhaDungTheoQuyDoi(
            @Param("maSanPham") Long maSanPham
    );

    @Query("""
            SELECT
                ctpn.sanPham.maSanPham AS maSanPham,
                SUM(ctpn.soLuongConLaiTheoQuyDoi)
                    AS tonKhaDungTheoQuyDoi
            FROM ChiTietPhieuNhap ctpn
            JOIN ctpn.phieuNhapKho pnk
            WHERE ctpn.sanPham.maSanPham IN :danhSachMaSanPham
              AND ctpn.soLuongConLaiTheoQuyDoi > 0
              AND (
                    ctpn.hanSuDung IS NULL
                    OR ctpn.hanSuDung >= CURRENT_DATE
              )
              AND ctpn.trangThaiLo = :trangThaiLo
              AND pnk.trangThaiPhieuNhap = :trangThaiPhieuNhap
            GROUP BY ctpn.sanPham.maSanPham
            """)
    List<TonKhaDungTheoSanPhamProjection>
            tinhTongTonKhaDungTheoDanhSachSanPham(
                    @Param("danhSachMaSanPham")
                    List<Long> danhSachMaSanPham,

                    @Param("trangThaiLo")
                    TrangThaiLo trangThaiLo,

                    @Param("trangThaiPhieuNhap")
                    TrangThaiPhieuNhap trangThaiPhieuNhap
            );

    @Query(
            value = """
                    SELECT
                        sp.ma_san_pham AS maSanPham,
                        sp.ten_san_pham AS tenSanPham,
                        SUM(
                            ctpn.so_luong_con_lai_theo_quy_doi
                        ) AS tongSoLuongTon
                    FROM chi_tiet_phieu_nhap ctpn
                    JOIN phieu_nhap_kho pn
                        ON pn.ma_phieu_nhap = ctpn.ma_phieu_nhap
                    JOIN san_pham sp
                        ON sp.ma_san_pham = ctpn.ma_san_pham
                    WHERE pn.trang_thai_phieu_nhap = 'DA_NHAP'
                      AND ctpn.trang_thai_lo = 'DANG_SU_DUNG'
                      AND ctpn.so_luong_con_lai_theo_quy_doi > 0
                      AND ctpn.han_su_dung >= :homNay
                      AND sp.trang_thai_san_pham = 1
                    GROUP BY
                        sp.ma_san_pham,
                        sp.ten_san_pham
                    HAVING SUM(
                        ctpn.so_luong_con_lai_theo_quy_doi
                    ) <= :nguongTon
                    ORDER BY
                        tongSoLuongTon ASC,
                        sp.ten_san_pham ASC
                    """,
            nativeQuery = true
    )
    List<TonKhoThapProjection> timSanPhamTonKhoThap(
            @Param("homNay")
            LocalDate homNay,

            @Param("nguongTon")
            BigDecimal nguongTon
    );

    @Query(
            value = """
                    SELECT
                        ctpn.ma_chi_tiet_phieu_nhap
                            AS maChiTietPhieuNhap,
                        pn.ma_phieu_nhap
                            AS maPhieuNhap,
                        sp.ma_san_pham
                            AS maSanPham,
                        sp.ten_san_pham
                            AS tenSanPham,
                        dvsp.ma_don_vi_san_pham
                            AS maDonViSanPham,
                        dvt.ten_don_vi_tinh
                            AS tenDonViTinh,
                        ctpn.so_luong_con_lai_theo_quy_doi
                            AS soLuongConLai,
                        ctpn.han_su_dung
                            AS hanSuDung
                    FROM chi_tiet_phieu_nhap ctpn
                    JOIN phieu_nhap_kho pn
                        ON pn.ma_phieu_nhap = ctpn.ma_phieu_nhap
                    JOIN san_pham sp
                        ON sp.ma_san_pham = ctpn.ma_san_pham
                    JOIN don_vi_san_pham dvsp
                        ON dvsp.ma_don_vi_san_pham =
                           ctpn.ma_don_vi_san_pham
                    JOIN don_vi_tinh dvt
                        ON dvt.ma_don_vi_tinh =
                           dvsp.ma_don_vi_tinh
                    WHERE pn.trang_thai_phieu_nhap = 'DA_NHAP'
                      AND ctpn.trang_thai_lo = 'DANG_SU_DUNG'
                      AND ctpn.so_luong_con_lai_theo_quy_doi > 0
                      AND ctpn.han_su_dung >= :homNay
                      AND ctpn.han_su_dung <= :denNgay
                    ORDER BY
                        ctpn.han_su_dung ASC,
                        sp.ten_san_pham ASC
                    """,
            nativeQuery = true
    )
    List<LoSapHetHanProjection> timLoSapHetHan(
            @Param("homNay")
            LocalDate homNay,

            @Param("denNgay")
            LocalDate denNgay
    );

    interface TonKhaDungTheoSanPhamProjection {

        Long getMaSanPham();

        BigDecimal getTonKhaDungTheoQuyDoi();
    }
}