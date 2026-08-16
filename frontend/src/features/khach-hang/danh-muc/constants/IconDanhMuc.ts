import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import {
  faBaby,
  faBabyCarriage,
  faBandage,
  faBone,
  faBottleDroplet,
  faCapsules,
  faDroplet,
  faFaceSmile,
  faFlask,
  faGaugeHigh,
  faGlassWater,
  faHeartPulse,
  faKitMedical,
  faLungs,
  faMaskFace,
  faPersonBreastfeeding,
  faPersonPregnant,
  faPills,
  faPumpSoap,
  faScissors,
  faShieldVirus,
  faSoap,
  faSpa,
  faStethoscope,
  faSun,
  faTableCellsLarge,
  faTemperatureHalf,
  faTooth,
} from "@fortawesome/free-solid-svg-icons";

/*
 * Icon được ánh xạ theo mã danh mục
 * trong dữ liệu danh mục hiện tại.
 *
 * Khi bổ sung hoặc thay đổi danh mục trong DB,
 * cần cập nhật mapping tương ứng tại đây.
 */
const ICON_DANH_MUC_THEO_MA:
  Record<number, IconDefinition> = {
    /*
     * =========================
     * DANH MỤC CHA
     * =========================
     */

    1: faPills,
    // Thuốc

    2: faCapsules,
    // Thực phẩm chức năng

    3: faStethoscope,
    // Thiết bị y tế

    4: faSpa,
    // Chăm sóc cá nhân và dược mỹ phẩm

    5: faBaby,
    // Mẹ và bé

    /*
     * =========================
     * THUỐC
     * =========================
     */

    6: faTemperatureHalf,
    // Giảm đau và hạ sốt

    7: faLungs,
    // Cảm cúm và hô hấp

    8: faBandage,
    // Dị ứng và da liễu

    9: faFlask,
    // Tiêu hóa

    10: faCapsules,
    // Kháng sinh

    11: faHeartPulse,
    // Tim mạch và huyết áp

    12: faDroplet,
    // Đái tháo đường

    13: faBottleDroplet,
    // Thuốc dùng ngoài

    /*
     * =========================
     * THỰC PHẨM CHỨC NĂNG
     * =========================
     */

    14: faCapsules,
    // Vitamin và khoáng chất

    15: faFlask,
    // Hỗ trợ tiêu hóa

    16: faBone,
    // Hỗ trợ xương khớp

    17: faHeartPulse,
    // Hỗ trợ tim mạch

    18: faShieldVirus,
    // Tăng cường sức đề kháng

    19: faFaceSmile,
    // Hỗ trợ làm đẹp

    /*
     * =========================
     * THIẾT BỊ Y TẾ
     * =========================
     */

    20: faGaugeHigh,
    // Máy đo huyết áp

    21: faTemperatureHalf,
    // Nhiệt kế

    22: faDroplet,
    // Máy đo đường huyết

    23: faLungs,
    // Máy xông khí dung

    24: faMaskFace,
    // Khẩu trang y tế

    25: faKitMedical,
    // Vật tư sơ cứu

    /*
     * =========================
     * CHĂM SÓC CÁ NHÂN
     * VÀ DƯỢC MỸ PHẨM
     * =========================
     */

    26: faSpa,
    // Chăm sóc da

    27: faScissors,
    // Chăm sóc tóc và da đầu

    28: faTooth,
    // Chăm sóc răng miệng

    29: faPumpSoap,
    // Vệ sinh cá nhân

    30: faSun,
    // Chống nắng

    /*
     * =========================
     * MẸ VÀ BÉ
     * =========================
     */

    31: faGlassWater,
    // Sữa và dinh dưỡng cho bé

    32: faBabyCarriage,
    // Đồ dùng cho bé

    33: faBaby,
    // Chăm sóc da cho bé

    34: faPersonPregnant,
    // Dinh dưỡng cho mẹ bầu

    35: faPersonBreastfeeding,
    // Hỗ trợ cho con bú

    36: faSoap,
    // Vệ sinh và chăm sóc bé
  };

export function layIconDanhMuc(
  maDanhMuc: number,
): IconDefinition {
  return (
    ICON_DANH_MUC_THEO_MA[maDanhMuc]
    ?? faTableCellsLarge
  );
}