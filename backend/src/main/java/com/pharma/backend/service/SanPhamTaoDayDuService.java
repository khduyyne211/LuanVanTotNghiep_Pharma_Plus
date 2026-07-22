package com.pharma.backend.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.sanpham.SanPhamResponse;
import com.pharma.backend.dto.sanpham.taomoi.DonViSanPhamTaoMoiRequest;
import com.pharma.backend.dto.sanpham.taomoi.QuyDoiDonViTaoMoiRequest;
import com.pharma.backend.dto.sanpham.taomoi.SanPhamTaoDayDuRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamTaoDayDuService {

    private final SanPhamTaoDayDuValidator validator;
    private final SanPhamService sanPhamService;
    private final DonViSanPhamService donViSanPhamService;
    private final QuyDoiDonViService quyDoiDonViService;

    @Transactional
    public SanPhamResponse taoSanPhamDayDu(
            SanPhamTaoDayDuRequest request
    ) {
        validator.kiemTra(request);

        SanPhamResponse sanPhamDaTao =
                sanPhamService.themSanPham(
                        request.getThongTinSanPham()
                );

        Long maSanPham = sanPhamDaTao.getMaSanPham();

        Map<Long, Long> maDonViSanPhamTheoMaDonViTinh =
                luuDanhSachDonVi(
                        maSanPham,
                        request.getDanhSachDonVi()
                );

        luuDanhSachQuyDoi(
                maSanPham,
                request.getDanhSachQuyDoi(),
                maDonViSanPhamTheoMaDonViTinh
        );

        return sanPhamService.layChiTietSanPhamDayDu(
                maSanPham
        );
    }

    private Map<Long, Long> luuDanhSachDonVi(
            Long maSanPham,
            List<DonViSanPhamTaoMoiRequest> danhSachDonVi
    ) {
        Map<Long, Long> maDonViSanPhamTheoMaDonViTinh =
                new LinkedHashMap<>();

        for (DonViSanPhamTaoMoiRequest donVi : danhSachDonVi) {
            DonViSanPhamRequest donViRequest =
                    new DonViSanPhamRequest();

            donViRequest.setMaSanPham(maSanPham);
            donViRequest.setMaDonViTinh(
                    donVi.getMaDonViTinh()
            );
            donViRequest.setGiaBanTheoDonVi(
                    donVi.getGiaBanTheoDonVi()
            );
            donViRequest.setLaDonViCoSo(
                    donVi.getLaDonViCoSo()
            );
            donViRequest.setChoPhepBan(
                    donVi.getChoPhepBan()
            );
            donViRequest.setChoPhepNhap(
                    donVi.getChoPhepNhap()
            );

            DonViSanPhamResponse donViDaTao =
                    donViSanPhamService.themDonViSanPham(
                            donViRequest
                    );

            maDonViSanPhamTheoMaDonViTinh.put(
                    donVi.getMaDonViTinh(),
                    donViDaTao.getMaDonViSanPham()
            );
        }

        return maDonViSanPhamTheoMaDonViTinh;
    }

    private void luuDanhSachQuyDoi(
            Long maSanPham,
            List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi,
            Map<Long, Long> maDonViSanPhamTheoMaDonViTinh
    ) {
        if (danhSachQuyDoi == null
                || danhSachQuyDoi.isEmpty()) {
            return;
        }

        for (QuyDoiDonViTaoMoiRequest quyDoi
                : danhSachQuyDoi) {
            QuyDoiDonViRequest quyDoiRequest =
                    new QuyDoiDonViRequest();

            quyDoiRequest.setMaSanPham(maSanPham);

            quyDoiRequest.setMaDonViNguon(
                    maDonViSanPhamTheoMaDonViTinh.get(
                            quyDoi.getMaDonViTinhNguon()
                    )
            );
            quyDoiRequest.setSoLuongNguon(
                    quyDoi.getSoLuongNguon()
            );

            quyDoiRequest.setMaDonViDich(
                    maDonViSanPhamTheoMaDonViTinh.get(
                            quyDoi.getMaDonViTinhDich()
                    )
            );
            quyDoiRequest.setSoLuongDich(
                    quyDoi.getSoLuongDich()
            );

            quyDoiDonViService.themQuyDoiDonVi(
                    quyDoiRequest
            );
        }
    }
}