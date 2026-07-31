package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.pharma.backend.dto.sanpham.DonViSanPhamTaoMoiRequest;
import com.pharma.backend.dto.sanpham.QuyDoiDonViTaoMoiRequest;
import com.pharma.backend.dto.sanpham.SanPhamRequest;
import com.pharma.backend.dto.sanpham.SanPhamTaoDayDuRequest;

@Component
public class SanPhamTaoDayDuValidator {

    public void kiemTra(SanPhamTaoDayDuRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Dữ liệu tạo sản phẩm không được để trống"
            );
        }

        kiemTraThongTinSanPham(request.getThongTinSanPham());
        Set<Long> maDonViTinhDaChon =
                kiemTraDanhSachDonVi(request.getDanhSachDonVi());

        kiemTraDanhSachQuyDoi(
                request.getDanhSachDonVi(),
                request.getDanhSachQuyDoi(),
                maDonViTinhDaChon
        );
    }

    private void kiemTraThongTinSanPham(
            SanPhamRequest thongTinSanPham
    ) {
        if (thongTinSanPham == null) {
            throw new IllegalArgumentException(
                    "Thông tin sản phẩm không được để trống"
            );
        }

        if (thongTinSanPham.getMaDanhMuc() == null) {
            throw new IllegalArgumentException(
                    "Danh mục sản phẩm không được để trống"
            );
        }

        if (
            thongTinSanPham.getTenSanPham() == null
            || thongTinSanPham.getTenSanPham().trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Tên sản phẩm không được để trống"
            );
        }
    }

    private Set<Long> kiemTraDanhSachDonVi(
            List<DonViSanPhamTaoMoiRequest> danhSachDonVi
    ) {
        if (danhSachDonVi == null || danhSachDonVi.isEmpty()) {
            throw new IllegalArgumentException(
                    "Sản phẩm phải có ít nhất một đơn vị"
            );
        }

        Set<Long> maDonViTinhDaChon = new HashSet<>();
        int soDonViCoSo = 0;

        for (DonViSanPhamTaoMoiRequest donVi : danhSachDonVi) {
            if (donVi == null || donVi.getMaDonViTinh() == null) {
                throw new IllegalArgumentException(
                        "Đơn vị tính không được để trống"
                );
            }

            if (!maDonViTinhDaChon.add(donVi.getMaDonViTinh())) {
                throw new IllegalArgumentException(
                        "Không được chọn trùng đơn vị tính"
                );
            }

            if (Boolean.TRUE.equals(donVi.getLaDonViCoSo())) {
                soDonViCoSo++;
            }

            if (
                Boolean.TRUE.equals(donVi.getChoPhepBan())
                && (
                    donVi.getGiaBanTheoDonVi() == null
                    || donVi.getGiaBanTheoDonVi()
                            .compareTo(BigDecimal.ZERO) <= 0
                )
            ) {
                throw new IllegalArgumentException(
                        "Đơn vị được phép bán phải có giá bán lớn hơn 0"
                );
            }
        }

        if (soDonViCoSo != 1) {
            throw new IllegalArgumentException(
                    "Sản phẩm phải có đúng một đơn vị cơ sở"
            );
        }

        return maDonViTinhDaChon;
    }

    private void kiemTraDanhSachQuyDoi(
            List<DonViSanPhamTaoMoiRequest> danhSachDonVi,
            List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi,
            Set<Long> maDonViTinhDaChon
    ) {
        if (
            danhSachDonVi.size() >= 2
            && (danhSachQuyDoi == null || danhSachQuyDoi.isEmpty())
        ) {
            throw new IllegalArgumentException(
                    "Sản phẩm có từ hai đơn vị phải có quy đổi"
            );
        }

        if (danhSachQuyDoi == null || danhSachQuyDoi.isEmpty()) {
            return;
        }

        Set<String> capQuyDoiDaChon = new HashSet<>();

        for (QuyDoiDonViTaoMoiRequest quyDoi : danhSachQuyDoi) {
            if (
                quyDoi == null
                || quyDoi.getMaDonViTinhNguon() == null
                || quyDoi.getMaDonViTinhDich() == null
            ) {
                throw new IllegalArgumentException(
                        "Đơn vị nguồn và đơn vị đích không được để trống"
                );
            }

            if (
                quyDoi.getMaDonViTinhNguon()
                        .equals(quyDoi.getMaDonViTinhDich())
            ) {
                throw new IllegalArgumentException(
                        "Đơn vị nguồn và đơn vị đích không được giống nhau"
                );
            }

            if (
                !maDonViTinhDaChon.contains(
                        quyDoi.getMaDonViTinhNguon()
                )
                || !maDonViTinhDaChon.contains(
                        quyDoi.getMaDonViTinhDich()
                )
            ) {
                throw new IllegalArgumentException(
                        "Quy đổi chỉ được sử dụng các đơn vị đã khai báo"
                );
            }

            if (
                quyDoi.getSoLuongNguon() == null
                || quyDoi.getSoLuongNguon()
                        .compareTo(BigDecimal.ZERO) <= 0
            ) {
                throw new IllegalArgumentException(
                        "Số lượng nguồn phải lớn hơn 0"
                );
            }

            if (
                quyDoi.getSoLuongDich() == null
                || quyDoi.getSoLuongDich()
                        .compareTo(BigDecimal.ZERO) <= 0
            ) {
                throw new IllegalArgumentException(
                        "Số lượng đích phải lớn hơn 0"
                );
            }

            String capQuyDoi =
                    quyDoi.getMaDonViTinhNguon()
                    + "-"
                    + quyDoi.getMaDonViTinhDich();

            if (!capQuyDoiDaChon.add(capQuyDoi)) {
                throw new IllegalArgumentException(
                        "Không được khai báo trùng cùng một quy đổi"
                );
            }
        }
    }
}