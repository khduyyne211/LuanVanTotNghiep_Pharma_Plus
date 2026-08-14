package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.admin.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.admin.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.dto.admin.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.admin.sanpham.DonViSanPhamCapNhatRequest;
import com.pharma.backend.dto.admin.sanpham.DonViSanPhamTaoMoiRequest;
import com.pharma.backend.dto.admin.sanpham.DuLieuChuyenMonThuocRequest;
import com.pharma.backend.dto.admin.sanpham.DuLieuChuyenMonThuocResponse;
import com.pharma.backend.dto.admin.sanpham.QuyDoiDonViCapNhatRequest;
import com.pharma.backend.dto.admin.sanpham.QuyDoiDonViTaoMoiRequest;
import com.pharma.backend.dto.admin.sanpham.SanPhamRequest;
import com.pharma.backend.dto.admin.sanpham.SanPhamResponse;
import com.pharma.backend.dto.admin.sanpham.SanPhamTaoMoiRequest;
import com.pharma.backend.dto.admin.sanpham.ThanhPhanHoatChatResponse;
import com.pharma.backend.dto.admin.sanpham.ThanhPhanHoatChatTaoMoiRequest;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.entity.DuLieuChuyenMonThuoc;
import com.pharma.backend.entity.HoatChat;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.ThanhPhanHoatChat;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.DonViTinhRepository;
import com.pharma.backend.repository.DuLieuChuyenMonThuocRepository;
import com.pharma.backend.repository.HoatChatRepository;
import com.pharma.backend.repository.NhaSanXuatRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;
import com.pharma.backend.repository.ThanhPhanHoatChatRepository;
import com.pharma.backend.dto.admin.sanpham.DonViNhapKhoResponse;
import com.pharma.backend.dto.admin.sanpham.SanPhamNhapKhoOptionResponse;
import lombok.RequiredArgsConstructor;
import java.util.Comparator;

import com.pharma.backend.repository.projection.TuyChonNhapKhoProjection;

@Service
@RequiredArgsConstructor
public class SanPhamService {

        private final SanPhamRepository sanPhamRepository;
        private final DanhMucSanPhamRepository danhMucSanPhamRepository;
        private final NhaSanXuatRepository nhaSanXuatRepository;
        private final DonViSanPhamService donViSanPhamService;
        private final QuyDoiDonViService quyDoiDonViService;
        private final HoatChatRepository hoatChatRepository;
        private final ThanhPhanHoatChatRepository thanhPhanHoatChatRepository;
        private final DuLieuChuyenMonThuocRepository duLieuChuyenMonThuocRepository;
        private final DonViSanPhamRepository donViSanPhamRepository;
        private final DonViTinhRepository donViTinhRepository;
        private final QuyDoiDonViRepository quyDoiDonViRepository;

        @Transactional(readOnly = true)
        public List<SanPhamResponse> layDanhSachSanPham() {
                return sanPhamRepository.findAllByOrderByNgayTaoDesc()
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public PhanTrangResponse<SanPhamResponse> layDanhSachSanPhamPhanTrang(
                        int page,
                        int size,
                        String keyword,
                        Boolean laThuocKeDon,
                        Boolean trangThaiSanPham,
                        Long maDanhMuc,
                        Long maNhaSanXuat) {
                if (page < 0) {
                        page = 0;
                }

                if (size <= 0) {
                        size = 10;
                }

                if (size > 50) {
                        size = 50;
                }

                String keywordDaXuLy = null;

                if (keyword != null && !keyword.trim().isEmpty()) {
                        keywordDaXuLy = keyword.trim();
                }

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(Sort.Direction.DESC, "ngayTao"));

                Page<SanPham> sanPhamPage = sanPhamRepository.timKiemVaLocSanPham(
                                keywordDaXuLy,
                                laThuocKeDon,
                                trangThaiSanPham,
                                maDanhMuc,
                                maNhaSanXuat,
                                pageable);

                return PhanTrangResponse.<SanPhamResponse>builder()
                                .content(
                                                sanPhamPage.getContent()
                                                                .stream()
                                                                .map(this::toResponse)
                                                                .toList())
                                .page(sanPhamPage.getNumber())
                                .size(sanPhamPage.getSize())
                                .totalElements(sanPhamPage.getTotalElements())
                                .totalPages(sanPhamPage.getTotalPages())
                                .first(sanPhamPage.isFirst())
                                .last(sanPhamPage.isLast())
                                .build();
        }

        @Transactional(readOnly = true)
        public SanPhamResponse layChiTietSanPham(long maSanPham) {
                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                return toResponse(sanPham);
        }

        @Transactional(readOnly = true)
        public List<SanPhamNhapKhoOptionResponse> layTuyChonNhapKho() {

                long batDauTruyVan = System.nanoTime();

                List<TuyChonNhapKhoProjection> danhSachDong = donViSanPhamRepository
                                .findAllTuyChonNhapKho();

                long ketThucTruyVan = System.nanoTime();

                Map<Long, List<TuyChonNhapKhoProjection>> danhSachDonViTheoSanPham = danhSachDong.stream()
                                .collect(
                                                java.util.stream.Collectors.groupingBy(
                                                                TuyChonNhapKhoProjection::getMaSanPham,
                                                                LinkedHashMap::new,
                                                                java.util.stream.Collectors
                                                                                .toList()));

                List<SanPhamNhapKhoOptionResponse> ketQua = danhSachDonViTheoSanPham
                                .values()
                                .stream()
                                .map(danhSachDonVi -> {
                                        TuyChonNhapKhoProjection sanPhamDauTien = danhSachDonVi.get(0);

                                        List<DonViNhapKhoResponse> danhSachDonViNhap = danhSachDonVi
                                                        .stream()
                                                        .map(donVi -> DonViNhapKhoResponse
                                                                        .builder()
                                                                        .maDonViSanPham(
                                                                                        donVi.getMaDonViSanPham())
                                                                        .maDonViTinh(
                                                                                        donVi.getMaDonViTinh())
                                                                        .tenDonViTinh(
                                                                                        donVi.getTenDonViTinh())
                                                                        .kyHieu(
                                                                                        donVi.getKyHieu())
                                                                        .build())
                                                        .sorted(
                                                                        Comparator.comparing(
                                                                                        DonViNhapKhoResponse::getTenDonViTinh,
                                                                                        String.CASE_INSENSITIVE_ORDER))
                                                        .toList();

                                        return SanPhamNhapKhoOptionResponse
                                                        .builder()
                                                        .maSanPham(
                                                                        sanPhamDauTien
                                                                                        .getMaSanPham())
                                                        .tenSanPham(
                                                                        sanPhamDauTien
                                                                                        .getTenSanPham())
                                                        .danhSachDonViNhap(
                                                                        danhSachDonViNhap)
                                                        .build();
                                })
                                .sorted(
                                                Comparator.comparing(
                                                                SanPhamNhapKhoOptionResponse::getTenSanPham,
                                                                String.CASE_INSENSITIVE_ORDER))
                                .toList();

                long ketThucXuLy = System.nanoTime();

                double thoiGianTruyVanMs = (ketThucTruyVan - batDauTruyVan)
                                / 1_000_000.0;

                double thoiGianXuLyMs = (ketThucXuLy - ketThucTruyVan)
                                / 1_000_000.0;

                System.out.printf(
                                "Tuy chon nhap kho projection - Query: %.2f ms | Map DTO: %.2f ms | So dong: %d%n",
                                thoiGianTruyVanMs,
                                thoiGianXuLyMs,
                                danhSachDong.size());

                return ketQua;
        }

        @Transactional(readOnly = true)
        public SanPhamResponse layChiTietSanPhamDayDu(long maSanPham) {
                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                return SanPhamResponse.builder()
                                .maSanPham(sanPham.getMaSanPham())
                                .maDanhMuc(
                                                sanPham.getDanhMuc() != null
                                                                ? sanPham.getDanhMuc().getMaDanhMuc()
                                                                : null)
                                .tenDanhMuc(
                                                sanPham.getDanhMuc() != null
                                                                ? sanPham.getDanhMuc().getTenDanhMuc()
                                                                : null)
                                .maNhaSanXuat(
                                                sanPham.getNhaSanXuat() != null
                                                                ? sanPham.getNhaSanXuat().getMaNhaSanXuat()
                                                                : null)
                                .tenNhaSanXuat(
                                                sanPham.getNhaSanXuat() != null
                                                                ? sanPham.getNhaSanXuat().getTenNhaSanXuat()
                                                                : null)
                                .tenSanPham(sanPham.getTenSanPham())
                                .hinhAnh(sanPham.getHinhAnh())
                                .laThuocKeDon(sanPham.getLaThuocKeDon())
                                .trangThaiSanPham(sanPham.getTrangThaiSanPham())
                                .moTaNgan(sanPham.getMoTaNgan())
                                .moTa(sanPham.getMoTa())
                                .ngayTao(sanPham.getNgayTao())
                                .danhSachDonViSanPham(
                                                donViSanPhamService
                                                                .layDanhSachDonViTheoSanPham(
                                                                                maSanPham))
                                .danhSachQuyDoiDonVi(
                                                quyDoiDonViService
                                                                .layDanhSachQuyDoiTheoSanPham(
                                                                                maSanPham))
                                .danhSachThanhPhanHoatChat(
                                                thanhPhanHoatChatRepository
                                                                .findByMaSanPham(maSanPham)
                                                                .stream()
                                                                .map(this::toThanhPhanHoatChatResponse)
                                                                .toList())
                                .duLieuChuyenMonThuoc(
                                                duLieuChuyenMonThuocRepository
                                                                .findByMaSanPham(maSanPham)
                                                                .map(this::toDuLieuChuyenMonThuocResponse)
                                                                .orElse(null))
                                .build();
        }

        @Transactional
        public SanPhamResponse themSanPham(
                        SanPhamTaoMoiRequest request) {
                kiemTraDuLieuTaoSanPham(request);

                SanPham sanPhamDaTao = luuThongTinSanPham(
                                request.getThongTinSanPham());

                Long maSanPham = sanPhamDaTao.getMaSanPham();

                Map<Long, Long> maDonViSanPhamTheoMaDonViTinh = luuDanhSachDonVi(
                                maSanPham,
                                request.getDanhSachDonVi());

                luuDanhSachQuyDoi(
                                maSanPham,
                                request.getDanhSachQuyDoi(),
                                maDonViSanPhamTheoMaDonViTinh);
                luuDanhSachThanhPhanHoatChat(
                                sanPhamDaTao,
                                request.getDanhSachThanhPhanHoatChat());

                luuDuLieuChuyenMonThuoc(
                                sanPhamDaTao,
                                request.getDuLieuChuyenMonThuoc());
                return layChiTietSanPhamDayDu(maSanPham);
        }

        @Transactional
        public SanPhamResponse capNhatSanPham(
                        long maSanPham,
                        SanPhamRequest request) {
                kiemTraThongTinSanPham(request);

                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                boolean biTrungTen = sanPhamRepository
                                .existsByTenSanPhamAndMaSanPhamNot(
                                                request.getTenSanPham().trim(),
                                                maSanPham);

                if (biTrungTen) {
                        throw new IllegalArgumentException(
                                        "Tên sản phẩm đã tồn tại");
                }

                DanhMucSanPham danhMuc = layDanhMuc(
                                request.getMaDanhMuc());

                NhaSanXuat nhaSanXuat = layNhaSanXuat(
                                request.getMaNhaSanXuat());

                sanPham.setDanhMuc(danhMuc);
                sanPham.setNhaSanXuat(nhaSanXuat);
                sanPham.setTenSanPham(
                                request.getTenSanPham().trim());
                sanPham.setHinhAnh(
                                chuanHoaChuoiRongThanhNull(
                                                request.getHinhAnh()));
                sanPham.setLaThuocKeDon(
                                Boolean.TRUE.equals(
                                                request.getLaThuocKeDon()));
                sanPham.setMoTaNgan(
                                chuanHoaChuoiRongThanhNull(
                                                request.getMoTaNgan()));
                sanPham.setMoTa(
                                chuanHoaChuoiRongThanhNull(
                                                request.getMoTa()));

                SanPham updated = sanPhamRepository.save(sanPham);

                return toResponse(updated);
        }

        @Transactional
        public SanPhamResponse capNhatDanhSachDonViSanPham(
                        long maSanPham,
                        List<DonViSanPhamCapNhatRequest> danhSachRequest) {
                if (danhSachRequest == null || danhSachRequest.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có ít nhất một đơn vị");
                }

                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                List<DonViSanPham> danhSachHienTai = donViSanPhamRepository
                                .findBySanPham_MaSanPham(maSanPham);

                Map<Long, DonViSanPham> donViHienTaiTheoMa = new LinkedHashMap<>();

                for (DonViSanPham donVi : danhSachHienTai) {
                        donViHienTaiTheoMa.put(
                                        donVi.getMaDonViSanPham(),
                                        donVi);
                }

                Set<Long> maBanGhiCuTrongRequest = new HashSet<>();
                Set<Long> maDonViTinhDaChon = new HashSet<>();
                Map<Long, Boolean> trangThaiSauCapNhat = new LinkedHashMap<>();
                Map<Long, DonViTinh> donViTinhTheoMa = new LinkedHashMap<>();

                int soDonViCoSoDangHoatDong = 0;
                int soDonViBanMacDinhDangHoatDong = 0;

                for (DonViSanPhamCapNhatRequest request : danhSachRequest) {
                        if (request == null) {
                                throw new IllegalArgumentException(
                                                "Dữ liệu đơn vị không hợp lệ");
                        }

                        if (!maDonViTinhDaChon.add(
                                        request.getMaDonViTinh())) {
                                throw new IllegalArgumentException(
                                                "Không được chọn trùng đơn vị tính");
                        }

                        DonViTinh donViTinh = donViTinhRepository
                                        .findById(request.getMaDonViTinh())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Không tìm thấy đơn vị tính"));

                        if (request.getMaDonViSanPham() == null
                                        && !Boolean.TRUE.equals(
                                                        donViTinh.getTrangThai())) {
                                throw new IllegalArgumentException(
                                                "Không thể thêm đơn vị tính đang bị ẩn");
                        }

                        donViTinhTheoMa.put(
                                        request.getMaDonViTinh(),
                                        donViTinh);

                        boolean dangHoatDong = Boolean.TRUE.equals(
                                        request.getTrangThai());

                        boolean laDonViCoSo = Boolean.TRUE.equals(
                                        request.getLaDonViCoSo());

                        if (laDonViCoSo && !dangHoatDong) {
                                throw new IllegalArgumentException(
                                                "Đơn vị cơ sở phải đang hoạt động");
                        }

                        if (laDonViCoSo) {
                                soDonViCoSoDangHoatDong++;
                        }

                        boolean laDonViBanMacDinh = Boolean.TRUE.equals(
                                        request.getLaDonViBanMacDinh());

                        if (laDonViBanMacDinh && !dangHoatDong) {
                                throw new IllegalArgumentException(
                                                "Đơn vị bán mặc định phải đang hoạt động");
                        }

                        if (laDonViBanMacDinh
                                        && !Boolean.TRUE.equals(
                                                        request.getChoPhepBan())) {
                                throw new IllegalArgumentException(
                                                "Đơn vị bán mặc định phải được phép bán");
                        }

                        if (laDonViBanMacDinh) {
                                soDonViBanMacDinhDangHoatDong++;
                        }

                        if (Boolean.TRUE.equals(
                                        request.getChoPhepBan())
                                        && (request.getGiaBanTheoDonVi() == null
                                                        || request
                                                                        .getGiaBanTheoDonVi()
                                                                        .compareTo(BigDecimal.ZERO) <= 0)) {
                                throw new IllegalArgumentException(
                                                "Đơn vị cho phép bán phải có giá lớn hơn 0");
                        }

                        if (request.getMaDonViSanPham() != null) {
                                DonViSanPham donViHienTai = donViHienTaiTheoMa.get(
                                                request.getMaDonViSanPham());

                                if (donViHienTai == null) {
                                        throw new IllegalArgumentException(
                                                        "Đơn vị sản phẩm không thuộc sản phẩm đang sửa");
                                }

                                if (!maBanGhiCuTrongRequest.add(
                                                request.getMaDonViSanPham())) {
                                        throw new IllegalArgumentException(
                                                        "Không được gửi trùng đơn vị sản phẩm");
                                }

                                Long maDonViTinhHienTai = donViHienTai
                                                .getDonViTinh()
                                                .getMaDonViTinh();

                                if (!maDonViTinhHienTai.equals(
                                                request.getMaDonViTinh())) {
                                        throw new IllegalArgumentException(
                                                        "Không được đổi đơn vị tính của đơn vị sản phẩm đã tồn tại. "
                                                                        + "Hãy ẩn đơn vị cũ và thêm đơn vị mới");
                                }

                                trangThaiSauCapNhat.put(
                                                request.getMaDonViSanPham(),
                                                dangHoatDong);
                        }
                }

                if (soDonViCoSoDangHoatDong != 1) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có đúng một đơn vị cơ sở đang hoạt động");
                }

                if (soDonViBanMacDinhDangHoatDong != 1) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có đúng một đơn vị bán mặc định đang hoạt động");
                }

                if (!maBanGhiCuTrongRequest.containsAll(
                                donViHienTaiTheoMa.keySet())) {
                        throw new IllegalArgumentException(
                                        "Danh sách cập nhật phải chứa đầy đủ các đơn vị hiện tại");
                }

                List<QuyDoiDonVi> danhSachQuyDoiHienTai = quyDoiDonViRepository
                                .findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(
                                                maSanPham);

                for (QuyDoiDonVi quyDoi : danhSachQuyDoiHienTai) {
                        if (!Boolean.TRUE.equals(quyDoi.getTrangThai())) {
                                continue;
                        }

                        Long maDonViNguon = quyDoi.getDonViNguon()
                                        .getMaDonViSanPham();

                        Long maDonViDich = quyDoi.getDonViDich()
                                        .getMaDonViSanPham();

                        if (Boolean.FALSE.equals(
                                        trangThaiSauCapNhat.get(maDonViNguon))
                                        || Boolean.FALSE.equals(
                                                        trangThaiSauCapNhat.get(maDonViDich))) {
                                throw new IllegalArgumentException(
                                                "Không thể ẩn đơn vị đang được dùng trong quy đổi hoạt động");
                        }
                }

                /*
                 * Hạ đơn vị cơ sở và đơn vị bán mặc định cũ trước
                 * để có thể đổi sang đơn vị mới trong cùng transaction.
                 */
                for (DonViSanPham donVi : danhSachHienTai) {
                        donVi.setLaDonViCoSo(false);
                        donVi.setLaDonViBanMacDinh(false);
                }

                donViSanPhamRepository.saveAll(danhSachHienTai);
                donViSanPhamRepository.flush();

                List<DonViSanPham> danhSachCanLuu = new ArrayList<>();

                for (DonViSanPhamCapNhatRequest request : danhSachRequest) {
                        DonViSanPham donVi;

                        if (request.getMaDonViSanPham() == null) {
                                donVi = new DonViSanPham();
                                donVi.setSanPham(sanPham);
                        } else {
                                donVi = donViHienTaiTheoMa.get(
                                                request.getMaDonViSanPham());
                        }

                        donVi.setDonViTinh(
                                        donViTinhTheoMa.get(
                                                        request.getMaDonViTinh()));
                        donVi.setGiaBanTheoDonVi(
                                        request.getGiaBanTheoDonVi());
                        donVi.setLaDonViCoSo(
                                        Boolean.TRUE.equals(
                                                        request.getLaDonViCoSo()));
                        donVi.setLaDonViBanMacDinh(
                                        Boolean.TRUE.equals(
                                                        request.getLaDonViBanMacDinh()));
                        donVi.setChoPhepBan(
                                        Boolean.TRUE.equals(
                                                        request.getChoPhepBan()));
                        donVi.setChoPhepNhap(
                                        Boolean.TRUE.equals(
                                                        request.getChoPhepNhap()));
                        donVi.setTrangThai(
                                        Boolean.TRUE.equals(
                                                        request.getTrangThai()));

                        danhSachCanLuu.add(donVi);
                }

                donViSanPhamRepository.saveAll(danhSachCanLuu);

                return layChiTietSanPhamDayDu(maSanPham);
        }

        @Transactional
        public SanPhamResponse capNhatDanhSachQuyDoiDonVi(
                        long maSanPham,
                        List<QuyDoiDonViCapNhatRequest> danhSachRequest) {
                if (danhSachRequest == null) {
                        throw new IllegalArgumentException(
                                        "Danh sách quy đổi không được để trống");
                }

                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                List<DonViSanPham> danhSachDonVi = donViSanPhamRepository
                                .findBySanPham_MaSanPham(maSanPham);

                Map<Long, DonViSanPham> donViTheoMa = new LinkedHashMap<>();

                int soDonViDangHoatDong = 0;

                for (DonViSanPham donVi : danhSachDonVi) {
                        donViTheoMa.put(
                                        donVi.getMaDonViSanPham(),
                                        donVi);

                        if (Boolean.TRUE.equals(donVi.getTrangThai())) {
                                soDonViDangHoatDong++;
                        }
                }

                List<QuyDoiDonVi> danhSachHienTai = quyDoiDonViRepository
                                .findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(
                                                maSanPham);

                Map<Long, QuyDoiDonVi> quyDoiHienTaiTheoMa = new LinkedHashMap<>();

                for (QuyDoiDonVi quyDoi : danhSachHienTai) {
                        quyDoiHienTaiTheoMa.put(
                                        quyDoi.getMaQuyDoi(),
                                        quyDoi);
                }

                Set<Long> maBanGhiCuTrongRequest = new HashSet<>();
                Set<String> capQuyDoiDaChon = new HashSet<>();

                int soQuyDoiDangHoatDong = 0;

                for (QuyDoiDonViCapNhatRequest request : danhSachRequest) {
                        if (request == null) {
                                throw new IllegalArgumentException(
                                                "Dữ liệu quy đổi không hợp lệ");
                        }

                        if (request.getMaDonViNguon()
                                        .equals(request.getMaDonViDich())) {
                                throw new IllegalArgumentException(
                                                "Đơn vị nguồn và đơn vị đích không được giống nhau");
                        }

                        DonViSanPham donViNguon = donViTheoMa.get(
                                        request.getMaDonViNguon());

                        DonViSanPham donViDich = donViTheoMa.get(
                                        request.getMaDonViDich());

                        if (donViNguon == null || donViDich == null) {
                                throw new IllegalArgumentException(
                                                "Đơn vị quy đổi không thuộc sản phẩm đang sửa");
                        }

                        boolean dangHoatDong = Boolean.TRUE.equals(
                                        request.getTrangThai());

                        if (dangHoatDong
                                        && (!Boolean.TRUE.equals(
                                                        donViNguon.getTrangThai())
                                                        || !Boolean.TRUE.equals(
                                                                        donViDich.getTrangThai()))) {
                                throw new IllegalArgumentException(
                                                "Quy đổi đang hoạt động phải sử dụng đơn vị đang hoạt động");
                        }

                        String khoaCapQuyDoi = request.getMaDonViNguon()
                                        + "-"
                                        + request.getMaDonViDich();

                        if (!capQuyDoiDaChon.add(khoaCapQuyDoi)) {
                                throw new IllegalArgumentException(
                                                "Không được khai báo trùng quy đổi");
                        }

                        if (dangHoatDong) {
                                soQuyDoiDangHoatDong++;
                        }

                        if (request.getMaQuyDoi() != null) {
                                QuyDoiDonVi quyDoiHienTai = quyDoiHienTaiTheoMa.get(
                                                request.getMaQuyDoi());

                                if (quyDoiHienTai == null) {
                                        throw new IllegalArgumentException(
                                                        "Quy đổi không thuộc sản phẩm đang sửa");
                                }

                                if (!maBanGhiCuTrongRequest.add(
                                                request.getMaQuyDoi())) {
                                        throw new IllegalArgumentException(
                                                        "Không được gửi trùng mã quy đổi");
                                }
                        }
                }

                if (!maBanGhiCuTrongRequest.containsAll(
                                quyDoiHienTaiTheoMa.keySet())) {
                        throw new IllegalArgumentException(
                                        "Danh sách cập nhật phải chứa đầy đủ các quy đổi hiện tại");
                }

                if (soDonViDangHoatDong >= 2
                                && soQuyDoiDangHoatDong == 0) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm có từ hai đơn vị hoạt động phải có quy đổi hoạt động");
                }

                List<QuyDoiDonVi> danhSachCanLuu = new ArrayList<>();

                for (QuyDoiDonViCapNhatRequest request : danhSachRequest) {
                        QuyDoiDonVi quyDoi;

                        if (request.getMaQuyDoi() == null) {
                                quyDoi = new QuyDoiDonVi();
                                quyDoi.setSanPham(sanPham);
                        } else {
                                quyDoi = quyDoiHienTaiTheoMa.get(
                                                request.getMaQuyDoi());
                        }

                        quyDoi.setDonViNguon(
                                        donViTheoMa.get(
                                                        request.getMaDonViNguon()));
                        quyDoi.setSoLuongNguon(
                                        request.getSoLuongNguon());
                        quyDoi.setDonViDich(
                                        donViTheoMa.get(
                                                        request.getMaDonViDich()));
                        quyDoi.setSoLuongDich(
                                        request.getSoLuongDich());
                        quyDoi.setTrangThai(
                                        Boolean.TRUE.equals(
                                                        request.getTrangThai()));

                        danhSachCanLuu.add(quyDoi);
                }

                quyDoiDonViRepository.saveAll(danhSachCanLuu);

                return layChiTietSanPhamDayDu(maSanPham);
        }

        @Transactional
        public SanPhamResponse capNhatThanhPhanHoatChat(
                        long maSanPham,
                        List<ThanhPhanHoatChatTaoMoiRequest> danhSachThanhPhan) {
                kiemTraDanhSachThanhPhanHoatChat(
                                danhSachThanhPhan);

                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                List<ThanhPhanHoatChat> danhSachCu = thanhPhanHoatChatRepository
                                .findByMaSanPham(maSanPham);

                thanhPhanHoatChatRepository.deleteAll(
                                danhSachCu);

                thanhPhanHoatChatRepository.flush();

                luuDanhSachThanhPhanHoatChat(
                                sanPham,
                                danhSachThanhPhan);

                return layChiTietSanPhamDayDu(maSanPham);
        }

        @Transactional
        public SanPhamResponse capNhatDuLieuChuyenMonThuoc(
                        long maSanPham,
                        DuLieuChuyenMonThuocRequest request) {
                kiemTraDuLieuChuyenMonThuoc(request);

                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                DuLieuChuyenMonThuoc duLieu = duLieuChuyenMonThuocRepository
                                .findByMaSanPham(maSanPham)
                                .orElseGet(
                                                DuLieuChuyenMonThuoc::new);

                duLieu.setSanPham(sanPham);
                duLieu.setDangBaoChe(
                                request.getDangBaoChe().trim());
                duLieu.setPhanLoaiThuoc(
                                request.getPhanLoaiThuoc().trim());
                duLieu.setCongDungThamKhao(
                                request.getCongDungThamKhao().trim());
                duLieu.setCachDungThamKhao(
                                request.getCachDungThamKhao().trim());
                duLieu.setCanhBaoAnToan(
                                request.getCanhBaoAnToan().trim());

                /*
                 * Admin thay đổi dữ liệu chuyên môn thì
                 * Dược sĩ phải xác nhận lại.
                 */
                duLieu.setTrangThaiXacNhan(false);

                duLieuChuyenMonThuocRepository.save(duLieu);

                return layChiTietSanPhamDayDu(maSanPham);
        }

        @Transactional
        public SanPhamResponse anSanPham(long maSanPham) {
                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                sanPham.setTrangThaiSanPham(false);

                SanPham updated = sanPhamRepository.save(sanPham);

                return toResponse(updated);
        }

        @Transactional
        public SanPhamResponse hienSanPham(long maSanPham) {
                SanPham sanPham = sanPhamRepository.findById(maSanPham)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy sản phẩm"));

                sanPham.setTrangThaiSanPham(true);

                SanPham updated = sanPhamRepository.save(sanPham);

                return toResponse(updated);
        }

        private SanPham luuThongTinSanPham(
                        SanPhamRequest request) {
                String tenSanPham = request.getTenSanPham().trim();

                if (sanPhamRepository.existsByTenSanPham(
                                tenSanPham)) {
                        throw new IllegalArgumentException(
                                        "Tên sản phẩm đã tồn tại");
                }

                DanhMucSanPham danhMuc = layDanhMuc(
                                request.getMaDanhMuc());

                NhaSanXuat nhaSanXuat = layNhaSanXuat(
                                request.getMaNhaSanXuat());

                SanPham sanPham = new SanPham();

                sanPham.setDanhMuc(danhMuc);
                sanPham.setNhaSanXuat(nhaSanXuat);
                sanPham.setTenSanPham(tenSanPham);
                sanPham.setHinhAnh(
                                chuanHoaChuoiRongThanhNull(
                                                request.getHinhAnh()));
                sanPham.setLaThuocKeDon(
                                Boolean.TRUE.equals(
                                                request.getLaThuocKeDon()));
                sanPham.setMoTaNgan(
                                chuanHoaChuoiRongThanhNull(
                                                request.getMoTaNgan()));
                sanPham.setMoTa(
                                chuanHoaChuoiRongThanhNull(
                                                request.getMoTa()));
                sanPham.setTrangThaiSanPham(true);

                return sanPhamRepository.save(sanPham);
        }

        private Map<Long, Long> luuDanhSachDonVi(
                        Long maSanPham,
                        List<DonViSanPhamTaoMoiRequest> danhSachDonVi) {
                Map<Long, Long> maDonViSanPhamTheoMaDonViTinh = new LinkedHashMap<>();

                for (DonViSanPhamTaoMoiRequest donVi : danhSachDonVi) {
                        DonViSanPhamRequest donViRequest = new DonViSanPhamRequest();

                        donViRequest.setMaSanPham(maSanPham);
                        donViRequest.setMaDonViTinh(
                                        donVi.getMaDonViTinh());
                        donViRequest.setGiaBanTheoDonVi(
                                        donVi.getGiaBanTheoDonVi());
                        donViRequest.setLaDonViCoSo(
                                        Boolean.TRUE.equals(
                                                        donVi.getLaDonViCoSo()));
                        donViRequest.setLaDonViBanMacDinh(
                                        Boolean.TRUE.equals(
                                                        donVi.getLaDonViBanMacDinh()));
                        donViRequest.setChoPhepBan(
                                        Boolean.TRUE.equals(
                                                        donVi.getChoPhepBan()));
                        donViRequest.setChoPhepNhap(
                                        Boolean.TRUE.equals(
                                                        donVi.getChoPhepNhap()));

                        DonViSanPhamResponse donViDaTao = donViSanPhamService
                                        .themDonViSanPham(
                                                        donViRequest);

                        maDonViSanPhamTheoMaDonViTinh.put(
                                        donVi.getMaDonViTinh(),
                                        donViDaTao.getMaDonViSanPham());
                }

                return maDonViSanPhamTheoMaDonViTinh;
        }

        private void luuDanhSachQuyDoi(
                        Long maSanPham,
                        List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi,
                        Map<Long, Long> maDonViSanPhamTheoMaDonViTinh) {
                if (danhSachQuyDoi == null
                                || danhSachQuyDoi.isEmpty()) {
                        return;
                }

                for (QuyDoiDonViTaoMoiRequest quyDoi : danhSachQuyDoi) {
                        Long maDonViNguon = maDonViSanPhamTheoMaDonViTinh.get(
                                        quyDoi.getMaDonViTinhNguon());

                        Long maDonViDich = maDonViSanPhamTheoMaDonViTinh.get(
                                        quyDoi.getMaDonViTinhDich());

                        QuyDoiDonViRequest quyDoiRequest = new QuyDoiDonViRequest();

                        quyDoiRequest.setMaSanPham(maSanPham);
                        quyDoiRequest.setMaDonViNguon(
                                        maDonViNguon);
                        quyDoiRequest.setSoLuongNguon(
                                        quyDoi.getSoLuongNguon());
                        quyDoiRequest.setMaDonViDich(
                                        maDonViDich);
                        quyDoiRequest.setSoLuongDich(
                                        quyDoi.getSoLuongDich());

                        quyDoiDonViService.themQuyDoiDonVi(
                                        quyDoiRequest);
                }
        }

        private void kiemTraDuLieuTaoSanPham(
                        SanPhamTaoMoiRequest request) {
                if (request == null) {
                        throw new IllegalArgumentException(
                                        "Dữ liệu tạo sản phẩm không được để trống");
                }

                kiemTraThongTinSanPham(
                                request.getThongTinSanPham());

                Set<Long> maDonViTinhDaChon = kiemTraDanhSachDonVi(
                                request.getDanhSachDonVi());

                kiemTraDanhSachQuyDoi(
                                request.getDanhSachDonVi(),
                                request.getDanhSachQuyDoi(),
                                maDonViTinhDaChon);
                kiemTraDanhSachThanhPhanHoatChat(
                                request.getDanhSachThanhPhanHoatChat());

                kiemTraDuLieuChuyenMonThuoc(
                                request.getDuLieuChuyenMonThuoc());
        }

        private void kiemTraThongTinSanPham(
                        SanPhamRequest thongTinSanPham) {
                if (thongTinSanPham == null) {
                        throw new IllegalArgumentException(
                                        "Thông tin sản phẩm không được để trống");
                }

                if (thongTinSanPham.getMaDanhMuc() == null) {
                        throw new IllegalArgumentException(
                                        "Danh mục sản phẩm không được để trống");
                }

                if (thongTinSanPham.getTenSanPham() == null
                                || thongTinSanPham
                                                .getTenSanPham()
                                                .trim()
                                                .isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Tên sản phẩm không được để trống");
                }
        }

        private Set<Long> kiemTraDanhSachDonVi(
                        List<DonViSanPhamTaoMoiRequest> danhSachDonVi) {
                if (danhSachDonVi == null
                                || danhSachDonVi.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có ít nhất một đơn vị");
                }

                Set<Long> maDonViTinhDaChon = new HashSet<>();
                int soDonViCoSo = 0;
                int soDonViBanMacDinh = 0;

                for (DonViSanPhamTaoMoiRequest donVi : danhSachDonVi) {
                        if (donVi == null
                                        || donVi.getMaDonViTinh() == null) {
                                throw new IllegalArgumentException(
                                                "Đơn vị tính không được để trống");
                        }

                        if (!maDonViTinhDaChon.add(
                                        donVi.getMaDonViTinh())) {
                                throw new IllegalArgumentException(
                                                "Không được chọn trùng đơn vị tính");
                        }

                        if (Boolean.TRUE.equals(
                                        donVi.getLaDonViCoSo())) {
                                soDonViCoSo++;
                        }

                        if (Boolean.TRUE.equals(
                                        donVi.getLaDonViBanMacDinh())) {
                                soDonViBanMacDinh++;

                                if (!Boolean.TRUE.equals(
                                                donVi.getChoPhepBan())) {
                                        throw new IllegalArgumentException(
                                                        "Đơn vị bán mặc định phải được phép bán");
                                }
                        }

                        if (Boolean.TRUE.equals(
                                        donVi.getChoPhepBan())
                                        && (donVi.getGiaBanTheoDonVi() == null
                                                        || donVi.getGiaBanTheoDonVi()
                                                                        .compareTo(
                                                                                        BigDecimal.ZERO) <= 0)) {
                                throw new IllegalArgumentException(
                                                "Đơn vị được phép bán phải có giá bán lớn hơn 0");
                        }

                        if (donVi.getGiaBanTheoDonVi() != null
                                        && donVi.getGiaBanTheoDonVi()
                                                        .compareTo(
                                                                        BigDecimal.ZERO) < 0) {
                                throw new IllegalArgumentException(
                                                "Giá bán theo đơn vị không được nhỏ hơn 0");
                        }
                }

                if (soDonViCoSo != 1) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có đúng một đơn vị cơ sở");
                }

                if (soDonViBanMacDinh != 1) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có đúng một đơn vị bán mặc định");
                }

                return maDonViTinhDaChon;
        }

        private void kiemTraDanhSachQuyDoi(
                        List<DonViSanPhamTaoMoiRequest> danhSachDonVi,
                        List<QuyDoiDonViTaoMoiRequest> danhSachQuyDoi,
                        Set<Long> maDonViTinhDaChon) {
                if (danhSachDonVi.size() >= 2
                                && (danhSachQuyDoi == null
                                                || danhSachQuyDoi.isEmpty())) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm có từ hai đơn vị phải có quy đổi");
                }

                if (danhSachQuyDoi == null
                                || danhSachQuyDoi.isEmpty()) {
                        return;
                }

                Set<String> capQuyDoiDaChon = new HashSet<>();

                for (QuyDoiDonViTaoMoiRequest quyDoi : danhSachQuyDoi) {
                        if (quyDoi == null
                                        || quyDoi.getMaDonViTinhNguon() == null
                                        || quyDoi.getMaDonViTinhDich() == null) {
                                throw new IllegalArgumentException(
                                                "Đơn vị nguồn và đơn vị đích không được để trống");
                        }

                        if (quyDoi.getMaDonViTinhNguon().equals(
                                        quyDoi.getMaDonViTinhDich())) {
                                throw new IllegalArgumentException(
                                                "Đơn vị nguồn và đơn vị đích không được giống nhau");
                        }

                        if (!maDonViTinhDaChon.contains(
                                        quyDoi.getMaDonViTinhNguon())
                                        || !maDonViTinhDaChon.contains(
                                                        quyDoi.getMaDonViTinhDich())) {
                                throw new IllegalArgumentException(
                                                "Quy đổi chỉ được sử dụng các đơn vị đã khai báo");
                        }

                        if (quyDoi.getSoLuongNguon() == null
                                        || quyDoi.getSoLuongNguon()
                                                        .compareTo(
                                                                        BigDecimal.ZERO) <= 0) {
                                throw new IllegalArgumentException(
                                                "Số lượng nguồn phải lớn hơn 0");
                        }

                        if (quyDoi.getSoLuongDich() == null
                                        || quyDoi.getSoLuongDich()
                                                        .compareTo(
                                                                        BigDecimal.ZERO) <= 0) {
                                throw new IllegalArgumentException(
                                                "Số lượng đích phải lớn hơn 0");
                        }

                        String capQuyDoi = quyDoi.getMaDonViTinhNguon()
                                        + "-"
                                        + quyDoi.getMaDonViTinhDich();

                        if (!capQuyDoiDaChon.add(capQuyDoi)) {
                                throw new IllegalArgumentException(
                                                "Không được khai báo trùng cùng một quy đổi");
                        }
                }
        }

        private void kiemTraDanhSachThanhPhanHoatChat(
                        List<ThanhPhanHoatChatTaoMoiRequest> danhSachThanhPhan) {
                if (danhSachThanhPhan == null
                                || danhSachThanhPhan.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Sản phẩm phải có ít nhất một thành phần hoạt chất");
                }

                Set<Long> maHoatChatDaChon = new HashSet<>();

                for (ThanhPhanHoatChatTaoMoiRequest thanhPhan : danhSachThanhPhan) {
                        if (thanhPhan == null
                                        || thanhPhan.getMaHoatChat() == null) {
                                throw new IllegalArgumentException(
                                                "Hoạt chất không được để trống");
                        }

                        if (!maHoatChatDaChon.add(
                                        thanhPhan.getMaHoatChat())) {
                                throw new IllegalArgumentException(
                                                "Không được chọn trùng hoạt chất");
                        }

                        if (thanhPhan.getHamLuong() == null
                                        || thanhPhan.getHamLuong()
                                                        .compareTo(BigDecimal.ZERO) <= 0) {
                                throw new IllegalArgumentException(
                                                "Hàm lượng hoạt chất phải lớn hơn 0");
                        }

                        if (thanhPhan.getDonViHamLuong() == null
                                        || thanhPhan.getDonViHamLuong().isBlank()) {
                                throw new IllegalArgumentException(
                                                "Đơn vị hàm lượng không được để trống");
                        }
                }
        }

        private void kiemTraDuLieuChuyenMonThuoc(
                        DuLieuChuyenMonThuocRequest duLieu) {
                if (duLieu == null) {
                        throw new IllegalArgumentException(
                                        "Dữ liệu chuyên môn thuốc không được để trống");
                }

                if (laChuoiRong(duLieu.getDangBaoChe())) {
                        throw new IllegalArgumentException(
                                        "Dạng bào chế không được để trống");
                }

                if (laChuoiRong(duLieu.getPhanLoaiThuoc())) {
                        throw new IllegalArgumentException(
                                        "Phân loại thuốc không được để trống");
                }

                if (laChuoiRong(duLieu.getCongDungThamKhao())) {
                        throw new IllegalArgumentException(
                                        "Công dụng tham khảo không được để trống");
                }

                if (laChuoiRong(duLieu.getCachDungThamKhao())) {
                        throw new IllegalArgumentException(
                                        "Cách dùng tham khảo không được để trống");
                }

                if (laChuoiRong(duLieu.getCanhBaoAnToan())) {
                        throw new IllegalArgumentException(
                                        "Cảnh báo an toàn không được để trống");
                }
        }

        private void luuDanhSachThanhPhanHoatChat(
                        SanPham sanPham,
                        List<ThanhPhanHoatChatTaoMoiRequest> danhSachThanhPhan) {
                List<ThanhPhanHoatChat> danhSachCanLuu = danhSachThanhPhan.stream()
                                .map(thanhPhanRequest -> {
                                        HoatChat hoatChat = hoatChatRepository.findById(
                                                        thanhPhanRequest.getMaHoatChat()).orElseThrow(
                                                                        () -> new IllegalArgumentException(
                                                                                        "Không tìm thấy hoạt chất"));

                                        if (!Boolean.TRUE.equals(hoatChat.getTrangThai())) {
                                                throw new IllegalArgumentException(
                                                                "Hoạt chất "
                                                                                + hoatChat.getTenHoatChat()
                                                                                + " đang bị ẩn");
                                        }

                                        ThanhPhanHoatChat thanhPhan = new ThanhPhanHoatChat();

                                        thanhPhan.setSanPham(sanPham);
                                        thanhPhan.setHoatChat(hoatChat);
                                        thanhPhan.setHamLuong(
                                                        thanhPhanRequest.getHamLuong());
                                        thanhPhan.setDonViHamLuong(
                                                        thanhPhanRequest
                                                                        .getDonViHamLuong()
                                                                        .trim());
                                        thanhPhan.setVaiTroHoatChat(
                                                        chuanHoaChuoiRongThanhNull(
                                                                        thanhPhanRequest
                                                                                        .getVaiTroHoatChat()));
                                        thanhPhan.setGhiChu(
                                                        chuanHoaChuoiRongThanhNull(
                                                                        thanhPhanRequest.getGhiChu()));

                                        return thanhPhan;
                                })
                                .toList();

                thanhPhanHoatChatRepository.saveAll(danhSachCanLuu);
        }

        private void luuDuLieuChuyenMonThuoc(
                        SanPham sanPham,
                        DuLieuChuyenMonThuocRequest request) {
                DuLieuChuyenMonThuoc duLieu = new DuLieuChuyenMonThuoc();

                duLieu.setSanPham(sanPham);
                duLieu.setDangBaoChe(
                                request.getDangBaoChe().trim());
                duLieu.setPhanLoaiThuoc(
                                request.getPhanLoaiThuoc().trim());
                duLieu.setCongDungThamKhao(
                                request.getCongDungThamKhao().trim());
                duLieu.setCachDungThamKhao(
                                request.getCachDungThamKhao().trim());
                duLieu.setCanhBaoAnToan(
                                request.getCanhBaoAnToan().trim());
                duLieu.setTrangThaiXacNhan(false);

                duLieuChuyenMonThuocRepository.save(duLieu);
        }

        private boolean laChuoiRong(String giaTri) {
                return giaTri == null || giaTri.isBlank();
        }

        private DanhMucSanPham layDanhMuc(
                        Long maDanhMuc) {
                if (maDanhMuc == null) {
                        throw new IllegalArgumentException(
                                        "Danh mục sản phẩm không được để trống");
                }

                return danhMucSanPhamRepository.findById(maDanhMuc)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy danh mục sản phẩm"));
        }

        private NhaSanXuat layNhaSanXuat(
                        Long maNhaSanXuat) {
                if (maNhaSanXuat == null) {
                        return null;
                }

                return nhaSanXuatRepository.findById(maNhaSanXuat)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy nhà sản xuất"));
        }

        private String chuanHoaChuoiRongThanhNull(
                        String giaTri) {
                if (giaTri == null || giaTri.trim().isEmpty()) {
                        return null;
                }

                return giaTri.trim();
        }

        private ThanhPhanHoatChatResponse toThanhPhanHoatChatResponse(
                        ThanhPhanHoatChat thanhPhan) {
                HoatChat hoatChat = thanhPhan.getHoatChat();

                return ThanhPhanHoatChatResponse.builder()
                                .maThanhPhan(
                                                thanhPhan.getMaThanhPhan())
                                .maHoatChat(
                                                hoatChat != null
                                                                ? hoatChat.getMaHoatChat()
                                                                : null)
                                .tenHoatChat(
                                                hoatChat != null
                                                                ? hoatChat.getTenHoatChat()
                                                                : null)
                                .hamLuong(
                                                thanhPhan.getHamLuong())
                                .donViHamLuong(
                                                thanhPhan.getDonViHamLuong())
                                .vaiTroHoatChat(
                                                thanhPhan.getVaiTroHoatChat())
                                .ghiChu(
                                                thanhPhan.getGhiChu())
                                .build();
        }

        private DuLieuChuyenMonThuocResponse toDuLieuChuyenMonThuocResponse(
                        DuLieuChuyenMonThuoc duLieu) {
                return DuLieuChuyenMonThuocResponse.builder()
                                .maDuLieuChuyenMon(
                                                duLieu.getMaDuLieuChuyenMon())
                                .dangBaoChe(
                                                duLieu.getDangBaoChe())
                                .phanLoaiThuoc(
                                                duLieu.getPhanLoaiThuoc())
                                .congDungThamKhao(
                                                duLieu.getCongDungThamKhao())
                                .cachDungThamKhao(
                                                duLieu.getCachDungThamKhao())
                                .canhBaoAnToan(
                                                duLieu.getCanhBaoAnToan())
                                .trangThaiXacNhan(
                                                duLieu.getTrangThaiXacNhan())
                                .build();
        }

        private SanPhamResponse toResponse(
                        SanPham sanPham) {
                DanhMucSanPham danhMuc = sanPham.getDanhMuc();

                NhaSanXuat nhaSanXuat = sanPham.getNhaSanXuat();

                return SanPhamResponse.builder()
                                .maSanPham(sanPham.getMaSanPham())
                                .maDanhMuc(
                                                danhMuc != null
                                                                ? danhMuc.getMaDanhMuc()
                                                                : null)
                                .tenDanhMuc(
                                                danhMuc != null
                                                                ? danhMuc.getTenDanhMuc()
                                                                : null)
                                .maNhaSanXuat(
                                                nhaSanXuat != null
                                                                ? nhaSanXuat.getMaNhaSanXuat()
                                                                : null)
                                .tenNhaSanXuat(
                                                nhaSanXuat != null
                                                                ? nhaSanXuat.getTenNhaSanXuat()
                                                                : null)
                                .tenSanPham(sanPham.getTenSanPham())
                                .hinhAnh(sanPham.getHinhAnh())
                                .laThuocKeDon(sanPham.getLaThuocKeDon())
                                .trangThaiSanPham(
                                                sanPham.getTrangThaiSanPham())
                                .moTaNgan(sanPham.getMoTaNgan())
                                .moTa(sanPham.getMoTa())
                                .ngayTao(sanPham.getNgayTao())
                                .build();
        }
}
