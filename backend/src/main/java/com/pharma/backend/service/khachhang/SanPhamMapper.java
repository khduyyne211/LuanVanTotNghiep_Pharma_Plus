package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.pharma.backend.dto.khachhang.sanpham.DonViBanSanPhamResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.DuLieuChuyenMonThuocResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.SanPhamChiTietResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.SanPhamResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.ThanhPhanHoatChatResponseDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DuLieuChuyenMonThuoc;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.ThanhPhanHoatChat;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SanPhamMapper {

    private static final String CACH_TINH_GIA_MAC_DINH =
            "GIA_BAN_THEO_DON_VI";

    private final MoTaQuyDoiSanPhamService moTaQuyDoiSanPhamService;

    /**
     * Overload tạm tương thích với các Service chưa tích hợp tồn kho
     * và khuyến mãi.
     */
    public SanPhamResponseDto chuyenSangSanPhamResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi
    ) {
        return chuyenSangSanPhamResponseDto(
                sanPham,
                danhSachDonViBan,
                danhSachQuyDoiDonVi,
                taoKetQuaGiaMacDinh(danhSachDonViBan),
                taoSoLuongToiDaMacDinh(danhSachDonViBan)
        );
    }

    /**
     * Mapper chính dành cho dữ liệu khách hàng đã được tính tồn kho
     * và khuyến mãi.
     */
    public SanPhamResponseDto chuyenSangSanPhamResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi,
            Map<Long, Integer> soLuongToiDaTheoDonVi
    ) {
        DuLieuDonViDaXuLy duLieuDonVi = xuLyDuLieuDonVi(
                sanPham,
                danhSachDonViBan,
                ketQuaGiaTheoDonVi,
                soLuongToiDaTheoDonVi
        );

        KetQuaTinhGiaSanPham giaDaiDien =
                duLieuDonVi.ketQuaGiaDaiDien();

        return new SanPhamResponseDto(
                sanPham.getMaSanPham(),
                sanPham.getTenSanPham(),
                sanPham.getHinhAnh(),
                giaDaiDien.giaGoc(),
                giaDaiDien.giaSauKhuyenMai(),
                giaDaiDien.soTienGiamMoiDonVi(),
                giaDaiDien.coKhuyenMai(),
                duLieuDonVi.hetHang(),
                sanPham.getLaThuocKeDon(),
                sanPham.getNhaSanXuat() != null
                        ? sanPham.getNhaSanXuat().getTenNhaSanXuat()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getMaDanhMuc()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getTenDanhMuc()
                        : null,
                sanPham.getMoTaNgan(),
                moTaQuyDoiSanPhamService.taoMoTaQuyDoi(
                        danhSachQuyDoiDonVi != null
                                ? danhSachQuyDoiDonVi
                                : List.of()
                ),
                duLieuDonVi.danhSachDonViBanDto()
        );
    }

    /**
     * Overload tạm tương thích với Service chi tiết hiện tại.
     */
    public SanPhamChiTietResponseDto chuyenSangSanPhamChiTietResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat,
            DuLieuChuyenMonThuoc duLieuChuyenMonThuoc,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi
    ) {
        return chuyenSangSanPhamChiTietResponseDto(
                sanPham,
                danhSachDonViBan,
                danhSachThanhPhanHoatChat,
                duLieuChuyenMonThuoc,
                danhSachQuyDoiDonVi,
                taoKetQuaGiaMacDinh(danhSachDonViBan),
                taoSoLuongToiDaMacDinh(danhSachDonViBan)
        );
    }

    /**
     * Mapper chi tiết đã tích hợp tồn kho và khuyến mãi.
     */
    public SanPhamChiTietResponseDto chuyenSangSanPhamChiTietResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat,
            DuLieuChuyenMonThuoc duLieuChuyenMonThuoc,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi,
            Map<Long, Integer> soLuongToiDaTheoDonVi
    ) {
        DuLieuDonViDaXuLy duLieuDonVi = xuLyDuLieuDonVi(
                sanPham,
                danhSachDonViBan,
                ketQuaGiaTheoDonVi,
                soLuongToiDaTheoDonVi
        );

        KetQuaTinhGiaSanPham giaDaiDien =
                duLieuDonVi.ketQuaGiaDaiDien();

        List<ThanhPhanHoatChatResponseDto>
                danhSachThanhPhanHoatChatDto =
                danhSachThanhPhanHoatChat == null
                        ? List.of()
                        : danhSachThanhPhanHoatChat.stream()
                                .filter(Objects::nonNull)
                                .map(this::chuyenSangThanhPhanHoatChatResponseDto)
                                .toList();

        return new SanPhamChiTietResponseDto(
                sanPham.getMaSanPham(),
                sanPham.getTenSanPham(),
                sanPham.getHinhAnh(),
                giaDaiDien.giaGoc(),
                giaDaiDien.giaSauKhuyenMai(),
                giaDaiDien.soTienGiamMoiDonVi(),
                giaDaiDien.coKhuyenMai(),
                duLieuDonVi.hetHang(),
                sanPham.getLaThuocKeDon(),
                sanPham.getTrangThaiSanPham(),
                sanPham.getMoTaNgan(),
                sanPham.getMoTa(),
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getMaDanhMuc()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getTenDanhMuc()
                        : null,
                sanPham.getNhaSanXuat() != null
                        ? sanPham.getNhaSanXuat().getTenNhaSanXuat()
                        : null,
                moTaQuyDoiSanPhamService.taoMoTaQuyDoi(
                        danhSachQuyDoiDonVi != null
                                ? danhSachQuyDoiDonVi
                                : List.of()
                ),
                duLieuDonVi.danhSachDonViBanDto(),
                danhSachThanhPhanHoatChatDto,
                chuyenSangDuLieuChuyenMonThuocResponseDto(
                        duLieuChuyenMonThuoc
                )
        );
    }

    /**
     * Chọn đơn vị đại diện:
     *
     * 1. Đơn vị mặc định nếu đơn vị đó còn hàng.
     * 2. Nếu mặc định hết hàng, lấy đơn vị còn hàng đầu tiên.
     * 3. Nếu toàn bộ hết hàng, vẫn lấy đơn vị hợp lệ đầu tiên
     *    để hiển thị giá nhưng không trả đơn vị vào danh sách chọn.
     */
    private DuLieuDonViDaXuLy xuLyDuLieuDonVi(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi,
            Map<Long, Integer> soLuongToiDaTheoDonVi
    ) {
        List<DonViSanPham> danhSachDonViDaSapXep =
                sapXepDanhSachDonViBan(danhSachDonViBan);

        if (danhSachDonViDaSapXep.isEmpty()) {
            return new DuLieuDonViDaXuLy(
                    taoKetQuaGiaRong(sanPham),
                    true,
                    List.of()
            );
        }

        List<DonViSanPham> danhSachDonViConHang =
                danhSachDonViDaSapXep.stream()
                        .filter(donVi ->
                                laySoLuongToiDaBatBuoc(
                                        donVi,
                                        soLuongToiDaTheoDonVi
                                ) > 0
                        )
                        .toList();

        boolean hetHang = danhSachDonViConHang.isEmpty();

        DonViSanPham donViDaiDien =
                hetHang
                        ? danhSachDonViDaSapXep.get(0)
                        : danhSachDonViConHang.get(0);

        KetQuaTinhGiaSanPham ketQuaGiaDaiDien =
                layKetQuaGiaBatBuoc(
                        donViDaiDien,
                        ketQuaGiaTheoDonVi
                );

        List<DonViBanSanPhamResponseDto> danhSachDonViBanDto =
                danhSachDonViConHang.stream()
                        .map(donVi -> {
                            KetQuaTinhGiaSanPham ketQuaGia =
                                    layKetQuaGiaBatBuoc(
                                            donVi,
                                            ketQuaGiaTheoDonVi
                                    );

                            int soLuongToiDa =
                                    laySoLuongToiDaBatBuoc(
                                            donVi,
                                            soLuongToiDaTheoDonVi
                                    );

                            return chuyenSangDonViBanSanPhamResponseDto(
                                    donVi,
                                    ketQuaGia,
                                    soLuongToiDa
                            );
                        })
                        .toList();

        return new DuLieuDonViDaXuLy(
                ketQuaGiaDaiDien,
                hetHang,
                danhSachDonViBanDto
        );
    }

    private List<DonViSanPham> sapXepDanhSachDonViBan(
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (danhSachDonViBan == null
                || danhSachDonViBan.isEmpty()) {
            return List.of();
        }

        return danhSachDonViBan.stream()
                .filter(Objects::nonNull)
                .sorted(
                        Comparator.comparingInt(this::layThuTuUuTienDonVi)
                                .thenComparing(
                                        DonViSanPham::getMaDonViSanPham,
                                        Comparator.nullsLast(Long::compareTo)
                                )
                )
                .toList();
    }

    private int layThuTuUuTienDonVi(
            DonViSanPham donViSanPham
    ) {
        if (Boolean.TRUE.equals(
                donViSanPham.getLaDonViBanMacDinh()
        )) {
            return 0;
        }

        if (Boolean.TRUE.equals(
                donViSanPham.getLaDonViCoSo()
        )) {
            return 1;
        }

        return 2;
    }

    private DonViBanSanPhamResponseDto
            chuyenSangDonViBanSanPhamResponseDto(
                    DonViSanPham donViSanPham,
                    KetQuaTinhGiaSanPham ketQuaGia,
                    int soLuongToiDa
            ) {
        return new DonViBanSanPhamResponseDto(
                donViSanPham.getMaDonViSanPham(),
                donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getMaDonViTinh()
                        : null,
                donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getTenDonViTinh()
                        : null,
                donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getKyHieu()
                        : null,
                ketQuaGia.giaGoc(),
                ketQuaGia.soTienGiamMoiDonVi(),
                ketQuaGia.giaSauKhuyenMai(),
                ketQuaGia.coKhuyenMai(),
                soLuongToiDa,
                donViSanPham.getLaDonViCoSo()
        );
    }

    private KetQuaTinhGiaSanPham layKetQuaGiaBatBuoc(
            DonViSanPham donViSanPham,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi
    ) {
        if (donViSanPham.getMaDonViSanPham() == null) {
            throw new IllegalStateException(
                    "Đơn vị sản phẩm chưa có mã."
            );
        }

        if (ketQuaGiaTheoDonVi == null) {
            throw new IllegalStateException(
                    "Chưa có dữ liệu giá sản phẩm."
            );
        }

        KetQuaTinhGiaSanPham ketQuaGia =
                ketQuaGiaTheoDonVi.get(
                        donViSanPham.getMaDonViSanPham()
                );

        if (ketQuaGia == null) {
            throw new IllegalStateException(
                    "Không tìm thấy kết quả tính giá của đơn vị sản phẩm: "
                            + donViSanPham.getMaDonViSanPham()
            );
        }

        return ketQuaGia;
    }

    private int laySoLuongToiDaBatBuoc(
            DonViSanPham donViSanPham,
            Map<Long, Integer> soLuongToiDaTheoDonVi
    ) {
        if (donViSanPham.getMaDonViSanPham() == null) {
            throw new IllegalStateException(
                    "Đơn vị sản phẩm chưa có mã."
            );
        }

        if (soLuongToiDaTheoDonVi == null
                || !soLuongToiDaTheoDonVi.containsKey(
                        donViSanPham.getMaDonViSanPham()
                )) {
            throw new IllegalStateException(
                    "Không tìm thấy tồn kho của đơn vị sản phẩm: "
                            + donViSanPham.getMaDonViSanPham()
            );
        }

        Integer soLuongToiDa =
                soLuongToiDaTheoDonVi.get(
                        donViSanPham.getMaDonViSanPham()
                );

        return soLuongToiDa != null
                ? Math.max(soLuongToiDa, 0)
                : 0;
    }

    /**
     * Giá mặc định dùng cho overload tương thích.
     *
     * Các Service được tích hợp sau sẽ truyền kết quả từ
     * TinhGiaSanPhamService vào Mapper.
     */
    private Map<Long, KetQuaTinhGiaSanPham> taoKetQuaGiaMacDinh(
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (danhSachDonViBan == null
                || danhSachDonViBan.isEmpty()) {
            return Map.of();
        }

        Map<Long, KetQuaTinhGiaSanPham> ketQua =
                new LinkedHashMap<>();

        for (DonViSanPham donViSanPham : danhSachDonViBan) {
            if (donViSanPham == null
                    || donViSanPham.getMaDonViSanPham() == null) {
                continue;
            }

            BigDecimal giaGoc =
                    donViSanPham.getGiaBanTheoDonVi() != null
                            ? donViSanPham.getGiaBanTheoDonVi()
                            : BigDecimal.ZERO;

            Long maSanPham =
                    donViSanPham.getSanPham() != null
                            ? donViSanPham.getSanPham().getMaSanPham()
                            : null;

            ketQua.put(
                    donViSanPham.getMaDonViSanPham(),
                    new KetQuaTinhGiaSanPham(
                            maSanPham,
                            donViSanPham.getMaDonViSanPham(),
                            giaGoc,
                            BigDecimal.ZERO,
                            BigDecimal.ZERO,
                            BigDecimal.ZERO,
                            giaGoc,
                            false,
                            CACH_TINH_GIA_MAC_DINH
                    )
            );
        }

        return ketQua;
    }

    /**
     * Giữ hành vi cũ cho các Service chưa tích hợp tồn kho.
     */
    private Map<Long, Integer> taoSoLuongToiDaMacDinh(
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (danhSachDonViBan == null
                || danhSachDonViBan.isEmpty()) {
            return Map.of();
        }

        Map<Long, Integer> ketQua = new LinkedHashMap<>();

        for (DonViSanPham donViSanPham : danhSachDonViBan) {
            if (donViSanPham == null
                    || donViSanPham.getMaDonViSanPham() == null) {
                continue;
            }

            ketQua.put(
                    donViSanPham.getMaDonViSanPham(),
                    Integer.MAX_VALUE
            );
        }

        return ketQua;
    }

    private KetQuaTinhGiaSanPham taoKetQuaGiaRong(
            SanPham sanPham
    ) {
        return new KetQuaTinhGiaSanPham(
                sanPham != null
                        ? sanPham.getMaSanPham()
                        : null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                false,
                CACH_TINH_GIA_MAC_DINH
        );
    }

    private ThanhPhanHoatChatResponseDto
            chuyenSangThanhPhanHoatChatResponseDto(
                    ThanhPhanHoatChat thanhPhanHoatChat
            ) {
        return new ThanhPhanHoatChatResponseDto(
                thanhPhanHoatChat.getMaThanhPhan(),
                thanhPhanHoatChat.getHoatChat() != null
                        ? thanhPhanHoatChat.getHoatChat().getMaHoatChat()
                        : null,
                thanhPhanHoatChat.getHoatChat() != null
                        ? thanhPhanHoatChat.getHoatChat().getTenHoatChat()
                        : null,
                thanhPhanHoatChat.getHamLuong(),
                thanhPhanHoatChat.getDonViHamLuong(),
                thanhPhanHoatChat.getVaiTroHoatChat(),
                thanhPhanHoatChat.getGhiChu()
        );
    }

    private DuLieuChuyenMonThuocResponseDto
            chuyenSangDuLieuChuyenMonThuocResponseDto(
                    DuLieuChuyenMonThuoc duLieuChuyenMonThuoc
            ) {
        if (duLieuChuyenMonThuoc == null) {
            return null;
        }

        return new DuLieuChuyenMonThuocResponseDto(
                duLieuChuyenMonThuoc.getDangBaoChe(),
                duLieuChuyenMonThuoc.getCongDungThamKhao(),
                duLieuChuyenMonThuoc.getCachDungThamKhao(),
                duLieuChuyenMonThuoc.getCanhBaoAnToan(),
                duLieuChuyenMonThuoc.getPhanLoaiThuoc(),
                duLieuChuyenMonThuoc.getTrangThaiXacNhan()
        );
    }

    private record DuLieuDonViDaXuLy(
            KetQuaTinhGiaSanPham ketQuaGiaDaiDien,
            boolean hetHang,
            List<DonViBanSanPhamResponseDto> danhSachDonViBanDto
    ) {
    }
}