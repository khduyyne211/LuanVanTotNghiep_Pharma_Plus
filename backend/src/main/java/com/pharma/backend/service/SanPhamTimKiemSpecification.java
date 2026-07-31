package com.pharma.backend.service;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DuLieuChuyenMonThuoc;
import com.pharma.backend.entity.HoatChat;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.ThanhPhanHoatChat;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

@Component
public class SanPhamTimKiemSpecification {

    private static final Pattern MAU_TU_KHOA_HAM_LUONG =
            Pattern.compile("^(\\d+(?:[.,]\\d+)?)([\\p{L}%µ]+)?$");

    public String chuanHoaTuKhoaTimKiem(String tuKhoa) {
        if (tuKhoa == null) {
            return null;
        }

        String tuKhoaDaGopKhoangTrang = tuKhoa.trim().replaceAll("\\s+", " ");

        if (tuKhoaDaGopKhoangTrang.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng nhập từ khóa tìm kiếm."
            );
        }

        if (tuKhoaDaGopKhoangTrang.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Từ khóa tìm kiếm không được vượt quá 100 ký tự."
            );
        }

        String tuKhoaKhongDau = Normalizer
                .normalize(tuKhoaDaGopKhoangTrang, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");

        return tuKhoaKhongDau
                .replace('đ', 'd')
                .replace('Đ', 'd')
                .toLowerCase(Locale.ROOT);
    }

    public List<String> tachThanhPhanTuKhoa(String tuKhoaDaChuanHoa) {
        if (tuKhoaDaChuanHoa == null || tuKhoaDaChuanHoa.isBlank()) {
            return List.of();
        }

        return Arrays.stream(tuKhoaDaChuanHoa.split(" "))
                .filter(thanhPhan -> !thanhPhan.isBlank())
                .distinct()
                .limit(10)
                .toList();
    }

    public Specification<SanPham> taoDieuKienLocSanPham(
            BigDecimal giaTu,
            BigDecimal giaDen,
Long maNhaSanXuat,
            List<Long> danhSachMaDanhMucCanLoc,
            String tuKhoaDaChuanHoa,
            List<String> danhSachThanhPhanTuKhoa,
            String sapXep
    ) {
        return (root, query, cb) -> {
            List<Predicate> dieuKien = new ArrayList<>();

            Join<SanPham, NhaSanXuat> nhaSanXuatJoin =
                    root.join("nhaSanXuat", JoinType.LEFT);

            Join<SanPham, DanhMucSanPham> danhMucJoin =
                    root.join("danhMuc", JoinType.INNER);

            Join<DanhMucSanPham, DanhMucSanPham> danhMucChaJoin =
                    danhMucJoin.join("danhMucCha", JoinType.LEFT);

            Join<SanPham, DonViSanPham> donViBanMacDinhJoin =
                    root.join("danhSachDonViSanPham", JoinType.INNER);

            dieuKien.add(cb.isTrue(root.<Boolean>get("trangThaiSanPham")));
            dieuKien.add(cb.isTrue(danhMucJoin.<Boolean>get("trangThaiHienThi")));

            dieuKien.add(cb.or(
                    cb.isNull(danhMucChaJoin.<Long>get("maDanhMuc")),
                    cb.isTrue(danhMucChaJoin.<Boolean>get("trangThaiHienThi"))
            ));

            dieuKien.add(cb.or(
                    cb.isNull(nhaSanXuatJoin.<Long>get("maNhaSanXuat")),
                    cb.isTrue(nhaSanXuatJoin.<Boolean>get("trangThai"))
            ));

            dieuKien.add(cb.isTrue(
                    donViBanMacDinhJoin.<Boolean>get("laDonViBanMacDinh")
            ));

            dieuKien.add(cb.isTrue(
                    donViBanMacDinhJoin.<Boolean>get("choPhepBan")
            ));

            dieuKien.add(cb.isTrue(
                    donViBanMacDinhJoin.<Boolean>get("trangThai")
            ));

            dieuKien.add(cb.isNotNull(
                    donViBanMacDinhJoin.<BigDecimal>get("giaBanTheoDonVi")
            ));

            if (giaTu != null) {
                dieuKien.add(cb.greaterThanOrEqualTo(
                        donViBanMacDinhJoin.<BigDecimal>get("giaBanTheoDonVi"),
                        giaTu
                ));
            }

            if (giaDen != null) {
                dieuKien.add(cb.lessThanOrEqualTo(
                        donViBanMacDinhJoin.<BigDecimal>get("giaBanTheoDonVi"),
                        giaDen
                ));
            }

            if (maNhaSanXuat != null) {
                dieuKien.add(cb.equal(
                        nhaSanXuatJoin.get("maNhaSanXuat"),
                        maNhaSanXuat
                ));
            }

            if (danhSachMaDanhMucCanLoc != null
                    && !danhSachMaDanhMucCanLoc.isEmpty()) {
                dieuKien.add(
                        danhMucJoin.get("maDanhMuc")
                                .in(danhSachMaDanhMucCanLoc)
                );
            }

            boolean coTuKhoaTimKiem =
                    danhSachThanhPhanTuKhoa != null
                            && !danhSachThanhPhanTuKhoa.isEmpty();

            if (coTuKhoaTimKiem) {
for (String thanhPhanTuKhoa : danhSachThanhPhanTuKhoa) {
                    dieuKien.add(taoDieuKienTimTheoMotThanhPhan(
                            root,
                            query,
                            cb,
                            nhaSanXuatJoin,
                            danhMucJoin,
                            danhMucChaJoin,
                            thanhPhanTuKhoa
                    ));
                }
            }


            if (!laTruyVanDem(query)) {
                if ("GIA_TANG_DAN".equals(sapXep)) {
                    query.orderBy(
                            cb.asc(donViBanMacDinhJoin.<BigDecimal>get(
                                    "giaBanTheoDonVi"
                            )),
                            cb.desc(root.<Long>get("maSanPham"))
                    );
                } else if ("GIA_GIAM_DAN".equals(sapXep)) {
                    query.orderBy(
                            cb.desc(donViBanMacDinhJoin.<BigDecimal>get(
                                    "giaBanTheoDonVi"
                            )),
                            cb.desc(root.<Long>get("maSanPham"))
                    );
                } else if (coTuKhoaTimKiem) {
                    Expression<Integer> diemLienQuan =
                            taoDiemLienQuanTimKiem(
                                    root,
                                    query,
                                    cb,
                                    nhaSanXuatJoin,
                                    danhMucJoin,
                                    danhMucChaJoin,
                                    tuKhoaDaChuanHoa,
                                    danhSachThanhPhanTuKhoa
                            );

                    query.orderBy(
                            cb.desc(diemLienQuan),
                            cb.desc(root.<Long>get("maSanPham"))
                    );
                } else {
                    query.orderBy(cb.desc(root.<Long>get("maSanPham")));
                }
            }

            return cb.and(dieuKien.toArray(new Predicate[0]));
        };
    }

    private boolean laTruyVanDem(CriteriaQuery<?> query) {
        return Long.class.equals(query.getResultType())
                || long.class.equals(query.getResultType());
    }

    private Predicate taoDieuKienTimTheoMotThanhPhan(
            Root<SanPham> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            Join<SanPham, NhaSanXuat> nhaSanXuatJoin,
            Join<SanPham, DanhMucSanPham> danhMucJoin,
            Join<DanhMucSanPham, DanhMucSanPham> danhMucChaJoin,
            String thanhPhanTuKhoa
    ) {
        String mauTimKiem = taoMauChua(thanhPhanTuKhoa);

        Predicate khopTenSanPham = khopVanBan(
                cb,
                root.<String>get("tenSanPham"),
                mauTimKiem
        );

        Predicate khopNhaSanXuat = khopVanBan(
                cb,
nhaSanXuatJoin.<String>get("tenNhaSanXuat"),
                mauTimKiem
        );

        Predicate khopDanhMuc = khopVanBan(
                cb,
                danhMucJoin.<String>get("tenDanhMuc"),
                mauTimKiem
        );

        Predicate khopDanhMucCha = khopVanBan(
                cb,
                danhMucChaJoin.<String>get("tenDanhMuc"),
                mauTimKiem
        );

        Predicate khopMoTaNgan = khopVanBan(
                cb,
                root.<String>get("moTaNgan"),
                mauTimKiem
        );

        Predicate khopHoatChatVaHamLuong =
                taoDieuKienKhopHoatChatVaHamLuong(
                        root,
                        query,
                        cb,
                        thanhPhanTuKhoa,
                        mauTimKiem
                );

        Predicate khopCongDung = taoDieuKienKhopDuLieuChuyenMon(
                root,
                query,
                cb,
                "congDungThamKhao",
                mauTimKiem
        );

        Predicate khopDangBaoChe = taoDieuKienKhopDuLieuChuyenMon(
                root,
                query,
                cb,
                "dangBaoChe",
                mauTimKiem
        );

        return cb.or(
                khopTenSanPham,
                khopHoatChatVaHamLuong,
                khopNhaSanXuat,
                khopDanhMuc,
                khopDanhMucCha,
                khopCongDung,
                khopMoTaNgan,
                khopDangBaoChe
        );
    }

    private Expression<Integer> taoDiemLienQuanTimKiem(
            Root<SanPham> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            Join<SanPham, NhaSanXuat> nhaSanXuatJoin,
            Join<SanPham, DanhMucSanPham> danhMucJoin,
            Join<DanhMucSanPham, DanhMucSanPham> danhMucChaJoin,
            String tuKhoaDaChuanHoa,
            List<String> danhSachThanhPhanTuKhoa
    ) {
        Expression<String> tenSanPham = taoBieuThucChuoiTimKiem(
                cb,
                root.<String>get("tenSanPham")
        );

        String tuKhoaDaThoat =
                thoatKyTuDacBietLike(tuKhoaDaChuanHoa);

        Predicate tenKhopHoanToan =
                cb.equal(tenSanPham, tuKhoaDaChuanHoa);

        Predicate tenBatDauBang =
                cb.like(tenSanPham, tuKhoaDaThoat + "%", '\\');

        Predicate tenCoChua =
                cb.like(tenSanPham, "%" + tuKhoaDaThoat + "%", '\\');

        Predicate hoatChatKhop =
                taoDieuKienKhopBatKyThanhPhanHoatChat(
                        root,
                        query,
                        cb,
                        danhSachThanhPhanTuKhoa
                );

        Predicate nhaSanXuatKhop =
                taoDieuKienKhopBatKyThanhPhanVanBan(
                        cb,
                        nhaSanXuatJoin.<String>get("tenNhaSanXuat"),
                        danhSachThanhPhanTuKhoa
                );
Predicate danhMucKhop =
                taoDieuKienKhopBatKyThanhPhanVanBan(
                        cb,
                        danhMucJoin.<String>get("tenDanhMuc"),
                        danhSachThanhPhanTuKhoa
                );

        Predicate danhMucChaKhop =
                taoDieuKienKhopBatKyThanhPhanVanBan(
                        cb,
                        danhMucChaJoin.<String>get("tenDanhMuc"),
                        danhSachThanhPhanTuKhoa
                );

        Predicate congDungKhop =
                taoDieuKienKhopBatKyThanhPhanDuLieuChuyenMon(
                        root,
                        query,
                        cb,
                        "congDungThamKhao",
                        danhSachThanhPhanTuKhoa
                );

        Predicate moTaNganKhop =
                taoDieuKienKhopBatKyThanhPhanVanBan(
                        cb,
                        root.<String>get("moTaNgan"),
                        danhSachThanhPhanTuKhoa
                );

        Predicate dangBaoCheKhop =
                taoDieuKienKhopBatKyThanhPhanDuLieuChuyenMon(
                        root,
                        query,
                        cb,
                        "dangBaoChe",
                        danhSachThanhPhanTuKhoa
                );

        return cb.<Integer>selectCase()
                .when(tenKhopHoanToan, 800)
                .when(tenBatDauBang, 700)
                .when(tenCoChua, 600)
                .when(hoatChatKhop, 500)
                .when(nhaSanXuatKhop, 400)
                .when(cb.or(danhMucKhop, danhMucChaKhop), 300)
                .when(cb.or(congDungKhop, moTaNganKhop), 200)
                .when(dangBaoCheKhop, 100)
                .otherwise(0);
    }

    private Predicate taoDieuKienKhopBatKyThanhPhanVanBan(
            CriteriaBuilder cb,
            Expression<String> bieuThuc,
            List<String> danhSachThanhPhanTuKhoa
    ) {
        List<Predicate> dieuKien = danhSachThanhPhanTuKhoa.stream()
                .map(thanhPhan -> khopVanBan(
                        cb,
                        bieuThuc,
                        taoMauChua(thanhPhan)
                ))
                .toList();

        return cb.or(dieuKien.toArray(new Predicate[0]));
    }

    private Predicate taoDieuKienKhopBatKyThanhPhanHoatChat(
            Root<SanPham> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            List<String> danhSachThanhPhanTuKhoa
    ) {
        List<Predicate> dieuKien = danhSachThanhPhanTuKhoa.stream()
                .map(thanhPhan -> taoDieuKienKhopHoatChatVaHamLuong(
                        root,
                        query,
                        cb,
                        thanhPhan,
                        taoMauChua(thanhPhan)
                ))
                .toList();

        return cb.or(dieuKien.toArray(new Predicate[0]));
    }

    private Predicate taoDieuKienKhopBatKyThanhPhanDuLieuChuyenMon(
Root<SanPham> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            String tenThuocTinh,
            List<String> danhSachThanhPhanTuKhoa
    ) {
        List<Predicate> dieuKien = danhSachThanhPhanTuKhoa.stream()
                .map(thanhPhan -> taoDieuKienKhopDuLieuChuyenMon(
                        root,
                        query,
                        cb,
                        tenThuocTinh,
                        taoMauChua(thanhPhan)
                ))
                .toList();

        return cb.or(dieuKien.toArray(new Predicate[0]));
    }

    private Predicate taoDieuKienKhopHoatChatVaHamLuong(
            Root<SanPham> sanPhamRoot,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            String thanhPhanTuKhoa,
            String mauTimKiem
    ) {
        Subquery<Long> truyVanThanhPhan = query.subquery(Long.class);

        Root<ThanhPhanHoatChat> thanhPhanRoot =
                truyVanThanhPhan.from(ThanhPhanHoatChat.class);

        Join<ThanhPhanHoatChat, HoatChat> hoatChatJoin =
                thanhPhanRoot.join("hoatChat", JoinType.INNER);

        Predicate khopTenHoatChat = khopVanBan(
                cb,
                hoatChatJoin.<String>get("tenHoatChat"),
                mauTimKiem
        );

        Predicate khopDonViHamLuong = khopVanBan(
                cb,
                thanhPhanRoot.<String>get("donViHamLuong"),
                mauTimKiem
        );

        Predicate khopHamLuong = taoDieuKienKhopHamLuong(
                cb,
                thanhPhanRoot,
                thanhPhanTuKhoa
        );

        truyVanThanhPhan.select(cb.literal(1L));

        truyVanThanhPhan.where(
                cb.equal(
                        thanhPhanRoot.get("sanPham").get("maSanPham"),
                        sanPhamRoot.get("maSanPham")
                ),
                cb.isTrue(hoatChatJoin.<Boolean>get("trangThai")),
                cb.or(
                        khopTenHoatChat,
                        khopDonViHamLuong,
                        khopHamLuong
                )
        );

        return cb.exists(truyVanThanhPhan);
    }

    private Predicate taoDieuKienKhopHamLuong(
            CriteriaBuilder cb,
            Root<ThanhPhanHoatChat> thanhPhanRoot,
            String thanhPhanTuKhoa
    ) {
        Matcher matcher =
                MAU_TU_KHOA_HAM_LUONG.matcher(thanhPhanTuKhoa);

        if (!matcher.matches()) {
            return cb.disjunction();
        }

        BigDecimal hamLuong;

        try {
            hamLuong = new BigDecimal(
                    matcher.group(1).replace(',', '.')
            );
        } catch (NumberFormatException exception) {
            return cb.disjunction();
        }

        Predicate khopGiaTriHamLuong = cb.equal(
                thanhPhanRoot.<BigDecimal>get("hamLuong"),
                hamLuong
        );

        String donViHamLuong = matcher.group(2);
if (donViHamLuong == null || donViHamLuong.isBlank()) {
            return khopGiaTriHamLuong;
        }

        Predicate khopDonVi = khopVanBan(
                cb,
                thanhPhanRoot.<String>get("donViHamLuong"),
                taoMauChua(donViHamLuong)
        );

        return cb.and(khopGiaTriHamLuong, khopDonVi);
    }

    private Predicate taoDieuKienKhopDuLieuChuyenMon(
            Root<SanPham> sanPhamRoot,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            String tenThuocTinh,
            String mauTimKiem
    ) {
        Subquery<Long> truyVanDuLieuChuyenMon =
                query.subquery(Long.class);

        Root<DuLieuChuyenMonThuoc> duLieuChuyenMonRoot =
                truyVanDuLieuChuyenMon.from(DuLieuChuyenMonThuoc.class);

        truyVanDuLieuChuyenMon.select(cb.literal(1L));

        truyVanDuLieuChuyenMon.where(
                cb.equal(
                        duLieuChuyenMonRoot
                                .get("sanPham")
                                .get("maSanPham"),
                        sanPhamRoot.get("maSanPham")
                ),
                cb.isTrue(
                        duLieuChuyenMonRoot
                                .<Boolean>get("trangThaiXacNhan")
                ),
                khopVanBan(
                        cb,
                        duLieuChuyenMonRoot.<String>get(tenThuocTinh),
                        mauTimKiem
                )
        );

        return cb.exists(truyVanDuLieuChuyenMon);
    }

    private Predicate khopVanBan(
            CriteriaBuilder cb,
            Expression<String> bieuThuc,
            String mauTimKiem
    ) {
        return cb.like(
                taoBieuThucChuoiTimKiem(cb, bieuThuc),
                mauTimKiem,
                '\\'
        );
    }

    private Expression<String> taoBieuThucChuoiTimKiem(
            CriteriaBuilder cb,
            Expression<String> bieuThucGoc
    ) {
        Expression<String> chuoiKhongNull =
                cb.coalesce(bieuThucGoc, "");

        Expression<String> chuoiChuThuong =
                cb.lower(chuoiKhongNull);

        return cb.function(
                "replace",
                String.class,
                chuoiChuThuong,
                cb.literal("đ"),
                cb.literal("d")
        );
    }

    private String taoMauChua(String giaTri) {
        return "%" + thoatKyTuDacBietLike(giaTri) + "%";
    }

    private String thoatKyTuDacBietLike(String giaTri) {
        return giaTri
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }
}
