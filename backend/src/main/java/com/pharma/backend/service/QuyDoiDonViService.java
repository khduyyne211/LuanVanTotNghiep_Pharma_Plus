package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViResponse;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuyDoiDonViService {

    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;

    @Transactional(readOnly = true)
    public List<QuyDoiDonViResponse> layDanhSachQuyDoiTheoSanPham(
            long maSanPham
    ) {
        return quyDoiDonViRepository
                .findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(maSanPham)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuyDoiDonViResponse layChiTietQuyDoiDonVi(
            long maQuyDoi
    ) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository
                .findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy quy đổi đơn vị"
                ));

        return toResponse(quyDoiDonVi);
    }

    @Transactional
    public QuyDoiDonViResponse themQuyDoiDonVi(
            QuyDoiDonViRequest request
    ) {
        kiemTraDuLieuRequest(request);

        long maSanPham = layGiaTriLongBatBuoc(
                request.getMaSanPham(),
                "Sản phẩm không được để trống"
        );

        long maDonViNguon = layGiaTriLongBatBuoc(
                request.getMaDonViNguon(),
                "Đơn vị nguồn không được để trống"
        );

        long maDonViDich = layGiaTriLongBatBuoc(
                request.getMaDonViDich(),
                "Đơn vị đích không được để trống"
        );

        SanPham sanPham = laySanPham(maSanPham);
        DonViSanPham donViNguon = layDonViSanPham(maDonViNguon);
        DonViSanPham donViDich = layDonViSanPham(maDonViDich);

        kiemTraDonViThuocDungSanPham(
                maSanPham,
                donViNguon,
                donViDich
        );

        boolean biTrungQuyDoi = quyDoiDonViRepository
                .existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPham(
                        maSanPham,
                        maDonViNguon,
                        maDonViDich
                );

        if (biTrungQuyDoi) {
            throw new IllegalArgumentException(
                    "Quy đổi đơn vị này đã tồn tại"
            );
        }

        QuyDoiDonVi quyDoiDonVi = new QuyDoiDonVi();

        quyDoiDonVi.setSanPham(sanPham);
        quyDoiDonVi.setDonViNguon(donViNguon);
        quyDoiDonVi.setSoLuongNguon(request.getSoLuongNguon());
        quyDoiDonVi.setDonViDich(donViDich);
        quyDoiDonVi.setSoLuongDich(request.getSoLuongDich());
        quyDoiDonVi.setTrangThai(true);

        QuyDoiDonVi quyDoiDaLuu =
                quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(quyDoiDaLuu);
    }

    @Transactional
    public QuyDoiDonViResponse capNhatQuyDoiDonVi(
            long maQuyDoi,
            QuyDoiDonViRequest request
    ) {
        kiemTraDuLieuRequest(request);

        long maSanPham = layGiaTriLongBatBuoc(
                request.getMaSanPham(),
                "Sản phẩm không được để trống"
        );

        long maDonViNguon = layGiaTriLongBatBuoc(
                request.getMaDonViNguon(),
                "Đơn vị nguồn không được để trống"
        );

        long maDonViDich = layGiaTriLongBatBuoc(
                request.getMaDonViDich(),
                "Đơn vị đích không được để trống"
        );

        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository
                .findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy quy đổi đơn vị"
                ));

        SanPham sanPham = laySanPham(maSanPham);
        DonViSanPham donViNguon = layDonViSanPham(maDonViNguon);
        DonViSanPham donViDich = layDonViSanPham(maDonViDich);

        kiemTraDonViThuocDungSanPham(
                maSanPham,
                donViNguon,
                donViDich
        );

        boolean biTrungQuyDoi = quyDoiDonViRepository
                .existsBySanPham_MaSanPhamAndDonViNguon_MaDonViSanPhamAndDonViDich_MaDonViSanPhamAndMaQuyDoiNot(
                        maSanPham,
                        maDonViNguon,
                        maDonViDich,
                        maQuyDoi
                );

        if (biTrungQuyDoi) {
            throw new IllegalArgumentException(
                    "Quy đổi đơn vị này đã tồn tại"
            );
        }

        quyDoiDonVi.setSanPham(sanPham);
        quyDoiDonVi.setDonViNguon(donViNguon);
        quyDoiDonVi.setSoLuongNguon(request.getSoLuongNguon());
        quyDoiDonVi.setDonViDich(donViDich);
        quyDoiDonVi.setSoLuongDich(request.getSoLuongDich());

        QuyDoiDonVi quyDoiDaCapNhat =
                quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(quyDoiDaCapNhat);
    }

    @Transactional
    public QuyDoiDonViResponse anQuyDoiDonVi(
            long maQuyDoi
    ) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository
                .findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy quy đổi đơn vị"
                ));

        quyDoiDonVi.setTrangThai(false);

        QuyDoiDonVi quyDoiDaCapNhat =
                quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(quyDoiDaCapNhat);
    }

    @Transactional
    public QuyDoiDonViResponse hienQuyDoiDonVi(
            long maQuyDoi
    ) {
        QuyDoiDonVi quyDoiDonVi = quyDoiDonViRepository
                .findById(maQuyDoi)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy quy đổi đơn vị"
                ));

        quyDoiDonVi.setTrangThai(true);

        QuyDoiDonVi quyDoiDaCapNhat =
                quyDoiDonViRepository.save(quyDoiDonVi);

        return toResponse(quyDoiDaCapNhat);
    }

    private void kiemTraDuLieuRequest(
            QuyDoiDonViRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Dữ liệu quy đổi không được để trống"
            );
        }

        if (request.getMaSanPham() == null) {
            throw new IllegalArgumentException(
                    "Sản phẩm không được để trống"
            );
        }

        if (request.getMaDonViNguon() == null) {
            throw new IllegalArgumentException(
                    "Đơn vị nguồn không được để trống"
            );
        }

        if (request.getMaDonViDich() == null) {
            throw new IllegalArgumentException(
                    "Đơn vị đích không được để trống"
            );
        }

        if (request.getMaDonViNguon()
                .equals(request.getMaDonViDich())) {
            throw new IllegalArgumentException(
                    "Đơn vị nguồn và đơn vị đích không được giống nhau"
            );
        }

        if (request.getSoLuongNguon() == null
                || request.getSoLuongNguon()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Số lượng nguồn phải lớn hơn 0"
            );
        }

        if (request.getSoLuongDich() == null
                || request.getSoLuongDich()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Số lượng đích phải lớn hơn 0"
            );
        }
    }

    private long layGiaTriLongBatBuoc(
            Long giaTri,
            String thongBao
    ) {
        if (giaTri == null) {
            throw new IllegalArgumentException(thongBao);
        }

        return giaTri.longValue();
    }

    private SanPham laySanPham(
            long maSanPham
    ) {
        return sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy sản phẩm"
                ));
    }

    private DonViSanPham layDonViSanPham(
            long maDonViSanPham
    ) {
        return donViSanPhamRepository.findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn vị sản phẩm"
                ));
    }

    private void kiemTraDonViThuocDungSanPham(
            long maSanPham,
            DonViSanPham donViNguon,
            DonViSanPham donViDich
    ) {
        SanPham sanPhamCuaDonViNguon =
                donViNguon.getSanPham();

        SanPham sanPhamCuaDonViDich =
                donViDich.getSanPham();

        Long maSanPhamCuaDonViNguon =
                sanPhamCuaDonViNguon != null
                        ? sanPhamCuaDonViNguon.getMaSanPham()
                        : null;

        Long maSanPhamCuaDonViDich =
                sanPhamCuaDonViDich != null
                        ? sanPhamCuaDonViDich.getMaSanPham()
                        : null;

        if (maSanPhamCuaDonViNguon == null
                || maSanPhamCuaDonViNguon.longValue() != maSanPham) {
            throw new IllegalArgumentException(
                    "Đơn vị nguồn không thuộc sản phẩm đã chọn"
            );
        }

        if (maSanPhamCuaDonViDich == null
                || maSanPhamCuaDonViDich.longValue() != maSanPham) {
            throw new IllegalArgumentException(
                    "Đơn vị đích không thuộc sản phẩm đã chọn"
            );
        }
    }

    private QuyDoiDonViResponse toResponse(
            QuyDoiDonVi quyDoiDonVi
    ) {
        SanPham sanPham = quyDoiDonVi.getSanPham();

        DonViSanPham donViNguon =
                quyDoiDonVi.getDonViNguon();

        DonViTinh donViTinhNguon =
                donViNguon != null
                        ? donViNguon.getDonViTinh()
                        : null;

        DonViSanPham donViDich =
                quyDoiDonVi.getDonViDich();

        DonViTinh donViTinhDich =
                donViDich != null
                        ? donViDich.getDonViTinh()
                        : null;

        return QuyDoiDonViResponse.builder()
                .maQuyDoi(quyDoiDonVi.getMaQuyDoi())

                .maSanPham(
                        sanPham != null
                                ? sanPham.getMaSanPham()
                                : null
                )
                .tenSanPham(
                        sanPham != null
                                ? sanPham.getTenSanPham()
                                : null
                )

                .maDonViNguon(
                        donViNguon != null
                                ? donViNguon.getMaDonViSanPham()
                                : null
                )
                .tenDonViNguon(
                        donViTinhNguon != null
                                ? donViTinhNguon.getTenDonViTinh()
                                : null
                )
                .kyHieuDonViNguon(
                        donViTinhNguon != null
                                ? donViTinhNguon.getKyHieu()
                                : null
                )
                .soLuongNguon(
                        quyDoiDonVi.getSoLuongNguon()
                )

                .maDonViDich(
                        donViDich != null
                                ? donViDich.getMaDonViSanPham()
                                : null
                )
                .tenDonViDich(
                        donViTinhDich != null
                                ? donViTinhDich.getTenDonViTinh()
                                : null
                )
                .kyHieuDonViDich(
                        donViTinhDich != null
                                ? donViTinhDich.getKyHieu()
                                : null
                )
                .soLuongDich(
                        quyDoiDonVi.getSoLuongDich()
                )

                .trangThai(
                        quyDoiDonVi.getTrangThai()
                )
                .build();
    }
}