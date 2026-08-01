package com.pharma.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharma.backend.entity.SanPham;

public interface SanPhamRepository
        extends JpaRepository<SanPham, Long>, JpaSpecificationExecutor<SanPham> {

    List<SanPham> findAllByOrderByNgayTaoDesc();

    Page<SanPham> findAllByOrderByNgayTaoDesc(Pageable pageable);

    boolean existsByTenSanPham(String tenSanPham);

    boolean existsByTenSanPhamAndMaSanPhamNot(String tenSanPham, Long maSanPham);

    @Query("""
            SELECT sp
            FROM SanPham sp
            WHERE (:keyword IS NULL
                   OR LOWER(sp.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:laThuocKeDon IS NULL
                   OR sp.laThuocKeDon = :laThuocKeDon)
              AND (:trangThaiSanPham IS NULL
                   OR sp.trangThaiSanPham = :trangThaiSanPham)
              AND (:maDanhMuc IS NULL
                   OR sp.danhMuc.maDanhMuc = :maDanhMuc)
              AND (:maNhaSanXuat IS NULL
                   OR sp.nhaSanXuat.maNhaSanXuat = :maNhaSanXuat)
            """)
    Page<SanPham> timKiemVaLocSanPham(
            @Param("keyword") String keyword,
            @Param("laThuocKeDon") Boolean laThuocKeDon,
            @Param("trangThaiSanPham") Boolean trangThaiSanPham,
            @Param("maDanhMuc") Long maDanhMuc,
            @Param("maNhaSanXuat") Long maNhaSanXuat,
            Pageable pageable
    );

    @Override
    @EntityGraph(attributePaths = {"nhaSanXuat", "danhMuc"})
    Page<SanPham> findAll(
            Specification<SanPham> specification,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"nhaSanXuat", "danhMuc"})
    @Query("""
            SELECT sp
            FROM SanPham sp
            WHERE sp.maSanPham IN :danhSachMaSanPham
              AND sp.trangThaiSanPham = :trangThaiSanPham
            """)
    List<SanPham> timSanPhamTheoDanhSachMa(
            @Param("danhSachMaSanPham") List<Long> danhSachMaSanPham,
            @Param("trangThaiSanPham") Boolean trangThaiSanPham
    );
}
