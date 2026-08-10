package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.ChiTietPhieuNhap;
import com.pharma.backend.enums.nhapkho.TrangThaiLo;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class XuatKhoService {

    private final ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;

    @Transactional(propagation = Propagation.MANDATORY)
    public void truTonTheoFefo(
            Map<Long, BigDecimal> soLuongCanXuatTheoSanPham
    ) {
        if (soLuongCanXuatTheoSanPham == null
                || soLuongCanXuatTheoSanPham.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không có dữ liệu sản phẩm để xuất kho."
            );
        }

        for (Map.Entry<Long, BigDecimal> dongCanXuat
                : soLuongCanXuatTheoSanPham.entrySet()) {
            truTonMotSanPham(
                    dongCanXuat.getKey(),
                    dongCanXuat.getValue()
            );
        }
    }

    private void truTonMotSanPham(
            Long maSanPham,
            BigDecimal soLuongCanXuat
    ) {
        kiemTraSoLuongCanXuat(maSanPham, soLuongCanXuat);

        List<ChiTietPhieuNhap> danhSachLo =
                chiTietPhieuNhapRepository
                        .layDanhSachLoTheoFefoDeCapNhat(maSanPham);

        BigDecimal tongSoLuongConLai =
                tinhTongSoLuongConLai(
                        maSanPham,
                        danhSachLo
                );

        if (tongSoLuongConLai.compareTo(soLuongCanXuat) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Sản phẩm mã " + maSanPham
                            + " không đủ tồn kho. Cần "
                            + hienThiSoLuong(soLuongCanXuat)
                            + ", hiện còn "
                            + hienThiSoLuong(tongSoLuongConLai)
                            + "."
            );
        }

        BigDecimal soLuongConCanTru = soLuongCanXuat;

        for (ChiTietPhieuNhap loHang : danhSachLo) {
            if (soLuongConCanTru.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal soLuongConLai =
                    loHang.getSoLuongConLaiTheoQuyDoi();

            BigDecimal soLuongTruTaiLo =
soLuongConLai.min(soLuongConCanTru);

            BigDecimal soLuongSauKhiTru =
                    soLuongConLai.subtract(soLuongTruTaiLo);

            loHang.setSoLuongConLaiTheoQuyDoi(
                    soLuongSauKhiTru
            );

            if (soLuongSauKhiTru.compareTo(BigDecimal.ZERO) == 0) {
                loHang.setTrangThaiLo(TrangThaiLo.HET_HANG);
            }

            soLuongConCanTru =
                    soLuongConCanTru.subtract(soLuongTruTaiLo);
        }
    }

    private BigDecimal tinhTongSoLuongConLai(
            Long maSanPham,
            List<ChiTietPhieuNhap> danhSachLo
    ) {
        BigDecimal tongSoLuongConLai = BigDecimal.ZERO;

        for (ChiTietPhieuNhap loHang : danhSachLo) {
            BigDecimal soLuongConLai =
                    loHang.getSoLuongConLaiTheoQuyDoi();

            if (soLuongConLai == null
                    || soLuongConLai.compareTo(BigDecimal.ZERO) < 0) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Dữ liệu tồn kho của sản phẩm mã "
                                + maSanPham
                                + " không hợp lệ."
                );
            }

            tongSoLuongConLai =
                    tongSoLuongConLai.add(soLuongConLai);
        }

        return tongSoLuongConLai;
    }

    private void kiemTraSoLuongCanXuat(
            Long maSanPham,
            BigDecimal soLuongCanXuat
    ) {
        if (maSanPham == null
                || soLuongCanXuat == null
                || soLuongCanXuat.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Dữ liệu số lượng cần xuất kho không hợp lệ."
            );
        }
    }

    private String hienThiSoLuong(BigDecimal soLuong) {
        return soLuong.stripTrailingZeros().toPlainString();
    }
}
