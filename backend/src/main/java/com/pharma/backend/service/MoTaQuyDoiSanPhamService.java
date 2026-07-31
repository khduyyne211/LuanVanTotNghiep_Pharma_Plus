package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;

@Service
public class MoTaQuyDoiSanPhamService {

    public String taoMoTaQuyDoi(List<QuyDoiDonVi> danhSachQuyDoiDonVi) {
            if (danhSachQuyDoiDonVi == null || danhSachQuyDoiDonVi.isEmpty()) {
                    return null;
            }

            List<QuyDoiDonVi> danhSachQuyDoiHopLe = danhSachQuyDoiDonVi.stream()
                    .filter(quyDoi -> Boolean.TRUE.equals(quyDoi.getTrangThai()))
                    .filter(quyDoi -> laDonViDuocPhepBan(quyDoi.getDonViNguon()))
                    .filter(quyDoi -> laDonViDuocPhepBan(quyDoi.getDonViDich()))
                    .toList();

            if (danhSachQuyDoiHopLe.isEmpty()) {
                    return null;
            }

            Map<Long, QuyDoiDonVi> quyDoiTheoDonViNguon =
                    danhSachQuyDoiHopLe.stream()
                            .collect(Collectors.toMap(
                                    quyDoi -> quyDoi.getDonViNguon().getMaDonViSanPham(),
                                    quyDoi -> quyDoi,
                                    (quyDoiCu, quyDoiMoi) -> quyDoiCu
                            ));

            Set<Long> danhSachMaDonViDich = danhSachQuyDoiHopLe.stream()
                    .map(quyDoi -> quyDoi.getDonViDich().getMaDonViSanPham())
                    .collect(Collectors.toSet());

            Optional<QuyDoiDonVi> quyDoiDauTienOptional = danhSachQuyDoiHopLe.stream()
                    .filter(quyDoi -> !danhSachMaDonViDich.contains(
                            quyDoi.getDonViNguon().getMaDonViSanPham()
                    ))
                    .findFirst();

            QuyDoiDonVi quyDoiHienTai =
                    quyDoiDauTienOptional.orElse(danhSachQuyDoiHopLe.get(0));

            StringBuilder moTaQuyDoi = new StringBuilder();

            moTaQuyDoi.append(layTenDonViTinh(quyDoiHienTai.getDonViNguon()));

            Set<Long> donViDaDuyet = new HashSet<>();

            while (quyDoiHienTai != null) {
                    Long maDonViNguon = quyDoiHienTai.getDonViNguon().getMaDonViSanPham();

                    if (donViDaDuyet.contains(maDonViNguon)) {
                            break;
                    }

                    donViDaDuyet.add(maDonViNguon);

                    moTaQuyDoi
                            .append(" ")
                            .append(dinhDangSoLuongQuyDoi(quyDoiHienTai.getSoLuongDich()))
                            .append(" ")
                            .append(layTenDonViTinh(quyDoiHienTai.getDonViDich()));

                    Long maDonViTiepTheo = quyDoiHienTai.getDonViDich().getMaDonViSanPham();

                    quyDoiHienTai = quyDoiTheoDonViNguon.get(maDonViTiepTheo);

                    if (quyDoiHienTai != null) {
                    moTaQuyDoi.append(" x");
                    }
            }

            return moTaQuyDoi.toString();
    }

    private String layTenDonViTinh(DonViSanPham donViSanPham) {
            if (donViSanPham == null || donViSanPham.getDonViTinh() == null) {
                    return "";
            }

            return donViSanPham.getDonViTinh().getTenDonViTinh();
    }

    private String dinhDangSoLuongQuyDoi(BigDecimal soLuong) {
            if (soLuong == null) {
                    return "";
            }

            return soLuong.stripTrailingZeros().toPlainString();
    }

    private boolean laDonViDuocPhepBan(DonViSanPham donViSanPham) {
            return donViSanPham != null
                    && Boolean.TRUE.equals(donViSanPham.getChoPhepBan())
                    && Boolean.TRUE.equals(donViSanPham.getTrangThai());
    }

}
