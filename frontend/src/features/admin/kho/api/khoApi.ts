import axiosClient from "../../../../shared/api/axiosClient";

import type {
  LoSapHetHan,
  TonKhoThap,
} from "../types/Kho";

export const layDanhSachTonKhoThap = async (
  nguongTon = 10,
): Promise<TonKhoThap[]> => {
  const response =
    await axiosClient.get<TonKhoThap[]>(
      "/dashboard/ton-kho-thap",
      {
        params: {
          nguongTon,
        },
      },
    );

  return response.data;
};

export const layDanhSachLoSapHetHan = async (
  soNgay = 30,
): Promise<LoSapHetHan[]> => {
  const response =
    await axiosClient.get<LoSapHetHan[]>(
      "/dashboard/lo-sap-het-han",
      {
        params: {
          soNgay,
        },
      },
    );

  return response.data;
};