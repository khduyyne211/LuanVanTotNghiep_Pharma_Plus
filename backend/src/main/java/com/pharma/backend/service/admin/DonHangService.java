package com.pharma.backend.service.admin;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.admin.donhang.ChiTietDonHangProjection;
import com.pharma.backend.dto.admin.donhang.ChiTietDonHangResponse;
import com.pharma.backend.dto.admin.donhang.DonHangChiTietProjection;
import com.pharma.backend.dto.admin.donhang.DonHangChiTietResponse;
import com.pharma.backend.dto.admin.donhang.DonHangDanhSachProjection;
import com.pharma.backend.dto.admin.donhang.DonHangDanhSachResponse;
import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.DonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    @Transactional(readOnly = true)
    public PhanTrangResponse<DonHangDanhSachResponse> layDanhSachDonHangPhanTrang(
            int page,
            int size,
            String keyword,
            TrangThaiDonHang trangThaiDonHang,
            TrangThaiThanhToan trangThaiThanhToan,
            TrangThaiKiemDuyetDonHang trangThaiKiemDuyet
    ) {
        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = size <= 0 ? 10 : Math.min(size, 50);
        Pageable pageable = PageRequest.of(pageHopLe, sizeHopLe);

        Page<DonHangDanhSachProjection> donHangPage = donHangRepository.timKiemDonHang(
                xuLyChuoiLoc(keyword),
                layTenEnum(trangThaiDonHang),
                layTenEnum(trangThaiThanhToan),
                layTenEnum(trangThaiKiemDuyet),
                pageable
        );

        return PhanTrangResponse.<DonHangDanhSachResponse>builder()
                .content(donHangPage.getContent().stream().map(this::toDanhSachResponse).toList())
                .page(donHangPage.getNumber())
                .size(donHangPage.getSize())
                .totalElements(donHangPage.getTotalElements())
                .totalPages(donHangPage.getTotalPages())
                .first(donHangPage.isFirst())
                .last(donHangPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public DonHangChiTietResponse layChiTietDonHang(long maDonHang) {
        DonHangChiTietProjection donHang = donHangRepository.timChiTietDonHang(maDonHang)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        List<ChiTietDonHangResponse> danhSachChiTiet = chiTietDonHangRepository.timTheoMaDonHang(maDonHang)
                .stream()
                .map(this::toChiTietResponse)
                .toList();

        return DonHangChiTietResponse.builder()
                .maDonHang(donHang.getMaDonHang())
                .maKhachHang(donHang.getMaKhachHang())
                .tenKhachHang(donHang.getTenKhachHang())
                .soDienThoaiKhachHang(donHang.getSoDienThoaiKhachHang())
                .maDiaChi(donHang.getMaDiaChi())
                .tenNguoiNhan(donHang.getTenNguoiNhan())
                .soDienThoaiNhan(donHang.getSoDienThoaiNhan())
                .thanhPho(donHang.getThanhPho())
                .phuongKhuVuc(donHang.getPhuongKhuVuc())
                .diaChiChiTiet(donHang.getDiaChiChiTiet())
                .maVoucher(donHang.getMaVoucher())
                .maDonThuoc(donHang.getMaDonThuoc())
                .maNhanVienXuLy(donHang.getMaNhanVienXuLy())
                .tenNhanVienXuLy(donHang.getTenNhanVienXuLy())
                .ngayDatHang(donHang.getNgayDatHang())
                .loaiKhach(chuyenEnum(donHang.getLoaiKhach(), LoaiKhachHang.class, "loai_khach"))
                .tongTienHang(donHang.getTongTienHang())
                .phiGiaoHang(donHang.getPhiGiaoHang())
                .giamGia(donHang.getGiamGia())
                .tongThanhToan(donHang.getTongThanhToan())
                .phuongThucThanhToan(chuyenEnum(
                        donHang.getPhuongThucThanhToan(),
                        PhuongThucThanhToan.class,
                        "phuong_thuc_thanh_toan"
                ))
                .trangThaiThanhToan(chuyenEnum(
                        donHang.getTrangThaiThanhToan(),
                        TrangThaiThanhToan.class,
                        "trang_thai_thanh_toan"
                ))
                .trangThaiDonHang(chuyenEnum(
                        donHang.getTrangThaiDonHang(),
                        TrangThaiDonHang.class,
                        "trang_thai_don_hang"
                ))
                .trangThaiKiemDuyet(chuyenEnum(
                        donHang.getTrangThaiKiemDuyet(),
                        TrangThaiKiemDuyetDonHang.class,
                        "trang_thai_kiem_duyet"
                ))
                .ngayKiemDuyet(donHang.getNgayKiemDuyet())
                .ghiChuKiemDuyet(donHang.getGhiChuKiemDuyet())
                .lyDoTuChoiDuyet(donHang.getLyDoTuChoiDuyet())
                .ghiChu(donHang.getGhiChu())
                .anhDonThuoc(donHang.getAnhDonThuoc())
                .trangThaiDonThuoc(chuyenEnum(
                        donHang.getTrangThaiDonThuoc(),
                        TrangThaiDonThuoc.class,
                        "trang_thai_don_thuoc"
                ))
                .lyDoTuChoiDonThuoc(donHang.getLyDoTuChoiDonThuoc())
                .ghiChuDonThuoc(donHang.getGhiChuDonThuoc())
                .coThuocKeDon(Integer.valueOf(1).equals(donHang.getCoThuocKeDon()))
                .danhSachChiTiet(danhSachChiTiet)
                .build();
    }

    private DonHangDanhSachResponse toDanhSachResponse(DonHangDanhSachProjection donHang) {
        return DonHangDanhSachResponse.builder()
                .maDonHang(donHang.getMaDonHang())
                .maKhachHang(donHang.getMaKhachHang())
                .tenKhachHang(donHang.getTenKhachHang())
                .soDienThoaiKhachHang(donHang.getSoDienThoaiKhachHang())
                .maDonThuoc(donHang.getMaDonThuoc())
                .maNhanVienXuLy(donHang.getMaNhanVienXuLy())
                .tenNhanVienXuLy(donHang.getTenNhanVienXuLy())
                .ngayDatHang(donHang.getNgayDatHang())
                .loaiKhach(chuyenEnum(donHang.getLoaiKhach(), LoaiKhachHang.class, "loai_khach"))
                .tongTienHang(donHang.getTongTienHang())
                .phiGiaoHang(donHang.getPhiGiaoHang())
                .giamGia(donHang.getGiamGia())
                .tongThanhToan(donHang.getTongThanhToan())
                .phuongThucThanhToan(chuyenEnum(
                        donHang.getPhuongThucThanhToan(),
                        PhuongThucThanhToan.class,
                        "phuong_thuc_thanh_toan"
                ))
                .trangThaiThanhToan(chuyenEnum(
                        donHang.getTrangThaiThanhToan(),
                        TrangThaiThanhToan.class,
                        "trang_thai_thanh_toan"
                ))
                .trangThaiDonHang(chuyenEnum(
                        donHang.getTrangThaiDonHang(),
                        TrangThaiDonHang.class,
                        "trang_thai_don_hang"
                ))
                .trangThaiKiemDuyet(chuyenEnum(
                        donHang.getTrangThaiKiemDuyet(),
                        TrangThaiKiemDuyetDonHang.class,
                        "trang_thai_kiem_duyet"
                ))
                .coThuocKeDon(Integer.valueOf(1).equals(donHang.getCoThuocKeDon()))
                .build();
    }

    private ChiTietDonHangResponse toChiTietResponse(ChiTietDonHangProjection chiTiet) {
        return ChiTietDonHangResponse.builder()
                .maChiTietDonHang(chiTiet.getMaChiTietDonHang())
                .maSanPham(chiTiet.getMaSanPham())
                .tenSanPham(chiTiet.getTenSanPham())
                .laThuocKeDon(chiTiet.getLaThuocKeDon())
                .hinhAnh(chiTiet.getHinhAnh())
                .maDonViSanPham(chiTiet.getMaDonViSanPham())
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

    private String layTenEnum(Enum<?> giaTri) {
        return giaTri == null ? null : giaTri.name();
    }

    private <E extends Enum<E>> E chuyenEnum(String giaTri, Class<E> kieuEnum, String tenCot) {
        if (giaTri == null || giaTri.isBlank()) {
            return null;
        }

        try {
            return Enum.valueOf(kieuEnum, giaTri.trim());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(
                    "Giá trị không hợp lệ tại cột " + tenCot + ": " + giaTri,
                    ex
            );
        }
    }
}
