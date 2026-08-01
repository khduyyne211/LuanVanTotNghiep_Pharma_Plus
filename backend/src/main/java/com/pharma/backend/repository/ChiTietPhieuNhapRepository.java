package com.pharma.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharma.backend.entity.ChiTietPhieuNhap;

import jakarta.persistence.LockModeType;

@Repository
public interface ChiTietPhieuNhapRepository extends JpaRepository<ChiTietPhieuNhap, Long> {

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
    List<ChiTietPhieuNhap> layDanhSachLoTheoFefoDeCapNhat(@Param("maSanPham") Long maSanPham);

    //Lấy toàn bộ số lượng tồn còn lại của sản phẩm từ chi tiết phiếu nhập
    //COALESCE(SUM(...), 0): Nếu sản phẩm chưa có dòng nhập hợp lệ, SUM thường trả về null, COALESCE chuyển kết quả đó thành 0
    @Query("""
        SELECT COALESCE(SUM(ctpn.soLuongConLaiTheoQuyDoi), 0)
        FROM ChiTietPhieuNhap ctpn
        JOIN ctpn.phieuNhapKho pn
        WHERE ctpn.sanPham.maSanPham = :maSanPham
        AND ctpn.soLuongConLaiTheoQuyDoi > 0
        AND (ctpn.hanSuDung IS NULL OR ctpn.hanSuDung >= CURRENT_DATE)
        AND ctpn.trangThaiLo = 'DANG_SU_DUNG'
        AND pn.trangThaiPhieuNhap = 'DA_NHAP'
        """)
    BigDecimal tinhTongTonKhaDungTheoQuyDoi(@Param("maSanPham") Long maSanPham);
}