import axiosClient from "../../../api/axiosClient";

import type {
  HoatChat,
  HoatChatRequest,
} from "../types/HoatChat";

export const layDanhSachHoatChat = () => {
  return axiosClient.get<HoatChat[]>("/hoat-chat");
};

export const layChiTietHoatChat = (
  maHoatChat: number
) => {
  return axiosClient.get<HoatChat>(
    `/hoat-chat/${maHoatChat}`
  );
};

export const themHoatChat = (
  request: HoatChatRequest
) => {
  return axiosClient.post<HoatChat>(
    "/hoat-chat",
    request
  );
};

export const capNhatHoatChat = (
  maHoatChat: number,
  request: HoatChatRequest
) => {
  return axiosClient.put<HoatChat>(
    `/hoat-chat/${maHoatChat}`,
    request
  );
};

export const anHoatChat = (
  maHoatChat: number
) => {
  return axiosClient.put<HoatChat>(
    `/hoat-chat/${maHoatChat}/an`
  );
};

export const hienHoatChat = (
  maHoatChat: number
) => {
  return axiosClient.put<HoatChat>(
    `/hoat-chat/${maHoatChat}/hien`
  );
};