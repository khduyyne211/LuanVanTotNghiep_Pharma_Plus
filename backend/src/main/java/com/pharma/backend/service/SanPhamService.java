package com.pharma.backend.service;

import java.math.BigDecimal;
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
import com.pharma.backend.dto.donvisanpham.DonViSanPhamRequest;
import com.pharma.backend.dto.donvisanpham.DonViSanPhamResponse;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.sanpham.DonViSanPhamTaoMoiRequest;
import com.pharma.backend.dto.sanpham.QuyDoiDonViTaoMoiRequest;
import com.pharma.backend.dto.sanpham.SanPhamRequest;
import com.pharma.backend.dto.sanpham.SanPhamResponse;
import com.pharma.backend.dto.sanpham.SanPhamTaoMoiRequest;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.NhaSanXuatRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    private final DanhMucSanPhamRepository danhMucSanPhamRepository;
    private final NhaSanXuatRepository nhaSanXuatRepository;
    private final DonViSanPhamService donViSanPhamService;
    private final QuyDoiDonViService quyDoiDonViService;

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