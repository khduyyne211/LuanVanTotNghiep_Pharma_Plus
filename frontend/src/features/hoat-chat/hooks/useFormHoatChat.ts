import { useCallback, useState } from "react";
import type { HoatChat } from "../types/HoatChat";

type UseFormHoatChatProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormHoatChat({ onTaiLaiDanhSach }: UseFormHoatChatProps) {
  const [hienForm, setHienForm] = useState(false);
  const [hoatChatCanSua, setHoatChatCanSua] = useState<HoatChat | null>(null);

  const moFormThem = useCallback(() => {
    setHoatChatCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback((hoatChat: HoatChat) => {
    setHoatChatCanSua(hoatChat);
    setHienForm(true);
  }, []);

  const dongForm = useCallback(() => {
    setHienForm(false);
    setHoatChatCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    hoatChatCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormHoatChat;