import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { layDanhSachPhieuNhap } from "../api/phieuNhapApi";

import type {
  PhieuNhap,
  TrangThaiPhieuNhap,
} from "../types/PhieuNhap";

function useDanhSachPhieuNhap() {
  const [danhSachPhieuNhap, setDanhSachPhieuNhap] =
    useState<PhieuNhap[]>([]);

  const [loading, setLoading] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [lanTaiDanhSach, setLanTaiDanhSach] = useState(0);

  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] =
    useState<TrangThaiPhieuNhap | "">("");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const taiLaiDanhSach = useCallback(() => {
    setLoading(true);
    setLoi(null);
    setLanTaiDanhSach((giaTriCu) => giaTriCu + 1);
  }, []);

  useEffect(() => {
    let daHuy = false;

    const taiDanhSach = async () => {
      try {
        const response = await layDanhSachPhieuNhap();

        if (daHuy) {
          return;
        }

        setDanhSachPhieuNhap(response.data);
        setLoi(null);
      } catch (error) {
        console.error(
          "Không thể tải danh sách phiếu nhập:",
          error
        );

        if (!daHuy) {
          setLoi("Không thể tải danh sách phiếu nhập.");
        }
      } finally {
        if (!daHuy) {
          setLoading(false);
        }
      }
    };

    void taiDanhSach();

    return () => {
      daHuy = true;
    };
  }, [lanTaiDanhSach]);

  const danhSachDaLoc = useMemo(() => {
    const tuKhoaChuanHoa = tuKhoa.trim().toLowerCase();

    return danhSachPhieuNhap.filter((phieuNhap) => {
      const khopTuKhoa =
        tuKhoaChuanHoa.length === 0
        || phieuNhap.maPhieuNhap
          .toString()
          .includes(tuKhoaChuanHoa)
        || phieuNhap.tenNhaCungCap
          .toLowerCase()
          .includes(tuKhoaChuanHoa)
        || phieuNhap.tenNhanVienLap
          .toLowerCase()
          .includes(tuKhoaChuanHoa)
        || (phieuNhap.ghiChu ?? "")
          .toLowerCase()
          .includes(tuKhoaChuanHoa);

      const khopTrangThai =
        trangThai === ""
        || phieuNhap.trangThaiPhieuNhap === trangThai;

      return khopTuKhoa && khopTrangThai;
    });
  }, [danhSachPhieuNhap, tuKhoa, trangThai]);

  const totalElements = danhSachDaLoc.length;

  const totalPages = Math.ceil(
    totalElements / size
  );

  const danhSachHienThi = useMemo(() => {
    const viTriBatDau = page * size;
    const viTriKetThuc = viTriBatDau + size;

    return danhSachDaLoc.slice(
      viTriBatDau,
      viTriKetThuc
    );
  }, [danhSachDaLoc, page, size]);

  useEffect(() => {
    if (totalPages === 0) {
      if (page !== 0) {
        setPage(0);
      }

      return;
    }

    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const doiTuKhoa = useCallback((giaTri: string) => {
    setTuKhoa(giaTri);
    setPage(0);
  }, []);

  const doiTrangThai = useCallback(
    (giaTri: TrangThaiPhieuNhap | "") => {
      setTrangThai(giaTri);
      setPage(0);
    },
    []
  );

  const doiKichThuoc = useCallback((giaTri: number) => {
    setSize(giaTri);
    setPage(0);
  }, []);

  const xoaBoLoc = useCallback(() => {
    setTuKhoa("");
    setTrangThai("");
    setPage(0);
  }, []);

  return {
    danhSachPhieuNhap: danhSachHienThi,
    loading,
    loi,

    tuKhoa,
    trangThai,

    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: totalPages === 0 || page >= totalPages - 1,

    doiTuKhoa,
    doiTrangThai,
    doiTrang: setPage,
    doiKichThuoc,
    xoaBoLoc,
    taiLaiDanhSach,
  };
}

export default useDanhSachPhieuNhap;