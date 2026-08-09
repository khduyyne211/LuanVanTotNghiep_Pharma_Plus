package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangLocalRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangResponseDto;
import com.pharma.backend.entity.ChiTietGioHang;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.GioHang;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.repository.ChiTietGioHangRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.GioHangRepository;
import com.pharma.backend.repository.KhachHangRepository;

import lombok.RequiredArgsConstructor;
//Đồng bộ giỏ hàng giúp:
//Khi frontend gửi danh sách chi tiết bao gồm các dòng mã đơn vị sản phẩm và số lượng
//Bước 1: kiểm tra tồn kiemTraGioHangService.kiemTraDuDieuKienDongBo(request)
//Bước 2: Gom dòng trùng đơn vị: nếu 2 dòng trùng đơn vị sẽ được gom thành 1
//Bước 3: Lấy hoặc tạo gio_hang: Nếu khách đã có giỏ: Dùng giỏ hiện tại. Nếu chưa có: Lấy KhachHang → tạo GioHang → lưu database
//Bước 4: Xóa chi tiết cũ: chiTietGioHangRepository.xoaTatCaTheoMaGioHang(gioHang.getMaGioHang())
//Bước 5: Tạo dữ liệu mới: Mỗi dòng mới được lưu với: gioHang, sanPham, donViSanPham, soLuong
@Service
@RequiredArgsConstructor
public class DongBoGioHangService {

    private final KiemTraGioHangService kiemTraGioHangService;
    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final KhachHangRepository khachHangRepository;

    @Transactional
    public KiemTraGioHangResponseDto dongBoGioHang(
        Long maKhachHang,
        KiemTraGioHangRequestDto request
    ) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Khách hàng chưa đăng nhập."
            );
        }

        KiemTraGioHangResponseDto ketQuaKiemTra =
            kiemTraGioHangService.kiemTraDuDieuKienDongBo(request);

        Map<Long, Integer> soLuongTheoDonVi = gomSoLuongTheoDonVi(request);
        Map<Long, DonViSanPham> donViTheoMa = layDanhSachDonViSanPham(soLuongTheoDonVi);
        GioHang gioHang = layHoacTaoGioHang(maKhachHang);

        chiTietGioHangRepository.xoaTatCaTheoMaGioHang(gioHang.getMaGioHang());

        List<ChiTietGioHang> danhSachChiTietMoi = taoDanhSachChiTietMoi(
            gioHang,
            soLuongTheoDonVi,
            donViTheoMa
        );

        chiTietGioHangRepository.saveAll(danhSachChiTietMoi);

        return ketQuaKiemTra;
    }

    private Map<Long, Integer> gomSoLuongTheoDonVi(KiemTraGioHangRequestDto request) {
        Map<Long, Integer> soLuongTheoDonVi = new LinkedHashMap<>();

        for (ChiTietGioHangLocalRequestDto chiTiet : request.getDanhSachChiTiet()) {
            soLuongTheoDonVi.merge(
                chiTiet.getMaDonViSanPham(),
                chiTiet.getSoLuong(),
                Integer::sum
            );
        }

        return soLuongTheoDonVi;
    }

    private Map<Long, DonViSanPham> layDanhSachDonViSanPham(
        Map<Long, Integer> soLuongTheoDonVi
    ) {
        List<DonViSanPham> danhSachDonVi =
            donViSanPhamRepository.findAllById(soLuongTheoDonVi.keySet());

        Map<Long, DonViSanPham> donViTheoMa = new HashMap<>();

        for (DonViSanPham donViSanPham : danhSachDonVi) {
            donViTheoMa.put(
                donViSanPham.getMaDonViSanPham(),
                donViSanPham
            );
        }

        if (donViTheoMa.size() != soLuongTheoDonVi.size()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Có đơn vị sản phẩm không tồn tại."
            );
        }

        return donViTheoMa;
    }

    private GioHang layHoacTaoGioHang(Long maKhachHang) {
        return gioHangRepository.findByKhachHang_MaKhachHang(maKhachHang)
            .orElseGet(() -> taoGioHangMoi(maKhachHang));
    }

    private GioHang taoGioHangMoi(Long maKhachHang) {
        KhachHang khachHang = khachHangRepository.findById(maKhachHang)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Không tìm thấy khách hàng đăng nhập."
            ));

        GioHang gioHang = new GioHang();
        gioHang.setKhachHang(khachHang);

        return gioHangRepository.save(gioHang);
    }

    private List<ChiTietGioHang> taoDanhSachChiTietMoi(
        GioHang gioHang,
        Map<Long, Integer> soLuongTheoDonVi,
        Map<Long, DonViSanPham> donViTheoMa
    ) {
        List<ChiTietGioHang> danhSachChiTiet = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : soLuongTheoDonVi.entrySet()) {
            DonViSanPham donViSanPham = donViTheoMa.get(entry.getKey());
            BigDecimal donGia = donViSanPham.getGiaBanTheoDonVi();
            BigDecimal thanhTien = donGia.multiply(BigDecimal.valueOf(entry.getValue()));

            ChiTietGioHang chiTietGioHang = new ChiTietGioHang();
            chiTietGioHang.setGioHang(gioHang);
            chiTietGioHang.setSanPham(donViSanPham.getSanPham());
            chiTietGioHang.setDonViSanPham(donViSanPham);
            chiTietGioHang.setSoLuong(entry.getValue());
            chiTietGioHang.setDonGia(donGia);
            chiTietGioHang.setThanhTien(thanhTien);

            danhSachChiTiet.add(chiTietGioHang);
        }

        return danhSachChiTiet;
    }
}