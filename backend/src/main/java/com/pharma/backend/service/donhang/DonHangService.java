package com.pharma.backend.service.donhang;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.donhang.ChiTietDonHangProjection;
import com.pharma.backend.dto.donhang.ChiTietDonHangResponse;
import com.pharma.backend.dto.donhang.DonHangChiTietProjection;
import com.pharma.backend.dto.donhang.DonHangChiTietResponse;
import com.pharma.backend.dto.donhang.DonHangDanhSachProjection;
import com.pharma.backend.dto.donhang.DonHangDanhSachResponse;
import com.pharma.backend.repository.donhang.ChiTietDonHangRepository;
import com.pharma.backend.repository.donhang.DonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    @Transactional(readOnly = true)
    public PhanTrangResponse<DonHangDanhSachResponse>
            layDanhSachDonHangPhanTrang(
                    int page,
                    int size,
                    String keyword,
                    String trangThaiDonHang,
                    String trangThaiThanhToan,
                    String trangThaiKiemDuyet
            ) {
        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = size <= 0 ? 10 : Math.min(size, 50);

        Pageable pageable = PageRequest.of(pageHopLe, sizeHopLe);

        Page<DonHangDanhSachProjection> donHangPage =
                donHangRepository.timKiemDonHang(
                        xuLyChuoiLoc(keyword),
                        xuLyChuoiLoc(trangThaiDonHang),
                        xuLyChuoiLoc(trangThaiThanhToan),
                        xuLyChuoiLoc(trangThaiKiemDuyet),
                        pageable
                );

        return PhanTrangResponse
                .<DonHangDanhSachResponse>builder()
                .content(
                        donHangPage.getContent()
                                .stream()
                                .map(this::toDanhSachResponse)
                                .toList()
                )
                .page(donHangPage.getNumber())
                .size(donHangPage.getSize())
                .totalElements(donHangPage.getTotalElements())
                .totalPages(donHangPage.getTotalPages())
                .first(donHangPage.isFirst())
                .last(donHangPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public DonHangChiTietResponse layChiTietDonHang(
            long maDonHang
    ) {
        DonHangChiTietProjection donHang =
                donHangRepository.timChiTietDonHang(maDonHang)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Không tìm thấy đơn hàng"
                                )
                        );

        List<ChiTietDonHangResponse> danhSachChiTiet =
                chiTietDonHangRepository
                        .timTheoMaDonHang(maDonHang)
                        .stream()
                        .map(this::toChiTietResponse)
                        .toList();

        return DonHangChiTietResponse.builder()
                .maDonHang(donHang.getMaDonHang())
                .maKhachHang(donHang.getMaKhachHang())
                .tenKhachHang(donHang.getTenKhachHang())
                .emailKhachHang(donHang.getEmailKhachHang())
                .soDienThoaiKhachHang(
                        donHang.getSoDienThoaiKhachHang()
                )
                .maDiaChi(donHang.getMaDiaChi())
                .tenNguoiNhan(donHang.getTenNguoiNhan())
                .soDienThoaiNhan(
                        donHang.getSoDienThoaiNhan()
                )
                .tinhThanh(donHang.getTinhThanh())
                .quanHuyen(donHang.getQuanHuyen())
                .phuongXa(donHang.getPhuongXa())
                .diaChiChiTiet(donHang.getDiaChiChiTiet())
                .maVoucher(donHang.getMaVoucher())
                .maDonThuoc(donHang.getMaDonThuoc())
                .maNhanVienXuLy(
                        donHang.getMaNhanVienXuLy()
                )
                .tenNhanVienXuLy(
                        donHang.getTenNhanVienXuLy()
                )
                .maDuocSiDuyet(donHang.getMaDuocSiDuyet())
                .tenDuocSiDuyet(
                        donHang.getTenDuocSiDuyet()
                )
                .ngayDatHang(donHang.getNgayDatHang())
                .loaiKhach(donHang.getLoaiKhach())
                .tongTienHang(donHang.getTongTienHang())
                .phiGiaoHang(donHang.getPhiGiaoHang())
                .giamGia(donHang.getGiamGia())
                .tongThanhToan(donHang.getTongThanhToan())
                .phuongThucThanhToan(
                        donHang.getPhuongThucThanhToan()
                )
                .trangThaiThanhToan(
                        donHang.getTrangThaiThanhToan()
                )
                .trangThaiDonHang(
                        donHang.getTrangThaiDonHang()
                )
                .trangThaiKiemDuyet(
                        donHang.getTrangThaiKiemDuyet()
                )
                .ngayKiemDuyet(donHang.getNgayKiemDuyet())
                .ghiChuKiemDuyet(
                        donHang.getGhiChuKiemDuyet()
                )
                .lyDoTuChoiDuyet(
                        donHang.getLyDoTuChoiDuyet()
                )
                .ghiChu(donHang.getGhiChu())
                .anhDonThuoc(donHang.getAnhDonThuoc())
                .trangThaiDonThuoc(
                        donHang.getTrangThaiDonThuoc()
                )
                .ketQuaKiemDuyetDonThuoc(
                        donHang.getKetQuaKiemDuyetDonThuoc()
                )
                .coThuocKeDon(
                        donHang.getCoThuocKeDon() != null
                        && donHang.getCoThuocKeDon() == 1
                )
                .danhSachChiTiet(danhSachChiTiet)
                .build();
    }

    private DonHangDanhSachResponse toDanhSachResponse(
            DonHangDanhSachProjection donHang
    ) {
        return DonHangDanhSachResponse.builder()
                .maDonHang(donHang.getMaDonHang())
                .maKhachHang(donHang.getMaKhachHang())
                .tenKhachHang(donHang.getTenKhachHang())
                .emailKhachHang(donHang.getEmailKhachHang())
                .soDienThoaiKhachHang(
                        donHang.getSoDienThoaiKhachHang()
                )
                .maDonThuoc(donHang.getMaDonThuoc())
                .maNhanVienXuLy(
                        donHang.getMaNhanVienXuLy()
                )
                .tenNhanVienXuLy(
                        donHang.getTenNhanVienXuLy()
                )
                .ngayDatHang(donHang.getNgayDatHang())
                .loaiKhach(donHang.getLoaiKhach())
                .tongTienHang(donHang.getTongTienHang())
                .phiGiaoHang(donHang.getPhiGiaoHang())
                .giamGia(donHang.getGiamGia())
                .tongThanhToan(donHang.getTongThanhToan())
                .phuongThucThanhToan(
                        donHang.getPhuongThucThanhToan()
                )
                .trangThaiThanhToan(
                        donHang.getTrangThaiThanhToan()
                )
                .trangThaiDonHang(
                        donHang.getTrangThaiDonHang()
                )
                .trangThaiKiemDuyet(
                        donHang.getTrangThaiKiemDuyet()
                )
                .coThuocKeDon(
                        donHang.getCoThuocKeDon() != null
                        && donHang.getCoThuocKeDon() == 1
                )
                .build();
    }

    private ChiTietDonHangResponse toChiTietResponse(
            ChiTietDonHangProjection chiTiet
    ) {
        return ChiTietDonHangResponse.builder()
                .maChiTietDonHang(
                        chiTiet.getMaChiTietDonHang()
                )
                .maSanPham(chiTiet.getMaSanPham())
                .tenSanPham(chiTiet.getTenSanPham())
                .laThuocKeDon(chiTiet.getLaThuocKeDon())
                .hinhAnh(chiTiet.getHinhAnh())
                .maDonViSanPham(
                        chiTiet.getMaDonViSanPham()
                )
                .maDonViTinh(chiTiet.getMaDonViTinh())
                .tenDonViTinh(chiTiet.getTenDonViTinh())
                .kyHieu(chiTiet.getKyHieu())
                .soLuong(chiTiet.getSoLuong())
                .donGia(chiTiet.getDonGia())
                .giamGia(chiTiet.getGiamGia())
                .thanhTien(chiTiet.getThanhTien())
                .cachTinhGia(chiTiet.getCachTinhGia())
                .build();
    }

    private String xuLyChuoiLoc(String giaTri) {
        if (giaTri == null || giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }
}
