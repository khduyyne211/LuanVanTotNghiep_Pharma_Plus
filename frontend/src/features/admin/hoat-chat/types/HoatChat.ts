export interface HoatChat {
  maHoatChat: number;
  tenHoatChat: string;
  donVi: string | null;
  moTa: string | null;
  trangThai: boolean;
}

export interface HoatChatRequest {
  tenHoatChat: string;
  donVi: string | null;
  moTa: string | null;
}