import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import {
  faBaby,
  faBabyCarriage,
  faBandage,
  faBone,
  faBottleDroplet,
  faBoxOpen,
  faBrain,
  faCapsules,
  faDroplet,
  faEarListen,
  faFaceSmile,
  faFlask,
  faGaugeHigh,
  faGlassWater,
  faHeartPulse,
  faKitMedical,
  faLungs,
  faMaskFace,
  faPerson,
  faPersonBreastfeeding,
  faPersonCane,
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
  faVenusMars,
  faWater,
} from "@fortawesome/free-solid-svg-icons";

/*
 * Icon được ánh xạ theo mã danh mục
 * trong dữ liệu danh mục hiện tại.
 *
 * Khi bổ sung danh mục mới trong DB,
 * chỉ cần bổ sung mapping tương ứng tại đây.
 */
const ICON_DANH_MUC_THEO_MA:
  Record<number, IconDefinition> = {
    /*
     * =========================
     * THUỐC
     * =========================
     */

    1: faPills,
    // Thuốc

    2: faTemperatureHalf,
    // Giảm đau và hạ sốt

    3: faLungs,
    // Cảm cúm, ho và hô hấp

    4: faFlask,
    // Tiêu hóa và gan mật

    5: faBandage,
    // Dị ứng và da liễu

    6: faHeartPulse,
    // Tim mạch và huyết áp

    7: faDroplet,
    // Nội tiết và đái tháo đường

    8: faBone,
    // Cơ xương khớp

    /*
     * =========================
     * THỰC PHẨM BẢO VỆ SỨC KHỎE
     * =========================
     */

    9: faShieldVirus,
    // Thực phẩm bảo vệ sức khỏe

    10: faCapsules,
    // Vitamin và khoáng chất

    11: faShieldVirus,
    // Tăng đề kháng và miễn dịch

    12: faFlask,
    // Tiêu hóa và men vi sinh

    13: faHeartPulse,
    // Tim mạch và tuần hoàn

    14: faBone,
    // Xương khớp

    15: faBottleDroplet,
    // Gan và giải độc

    16: faBrain,
    // Giấc ngủ và thần kinh

    /*
     * =========================
     * DƯỢC MỸ PHẨM
     * =========================
     */

    17: faSpa,
    // Dược mỹ phẩm

    18: faFaceSmile,
    // Chăm sóc da mặt

    19: faSoap,
    // Làm sạch và tẩy trang

    20: faDroplet,
    // Dưỡng ẩm và phục hồi

    21: faSun,
    // Chống nắng

    22: faBandage,
    // Hỗ trợ giảm mụn

    23: faScissors,
    // Chăm sóc tóc và da đầu

    24: faSpa,
    // Chăm sóc cơ thể

    /*
     * =========================
     * CHĂM SÓC CÁ NHÂN
     * =========================
     */

    25: faPerson,
    // Chăm sóc cá nhân

    26: faTooth,
    // Chăm sóc răng miệng

    27: faPumpSoap,
    // Vệ sinh cơ thể

    28: faVenusMars,
    // Chăm sóc phụ nữ

    29: faPerson,
    // Chăm sóc nam giới

    30: faEarListen,
    // Vệ sinh tai mũi họng

    31: faMaskFace,
    // Khẩu trang và bảo hộ

    32: faPersonCane,
    // Chăm sóc người cao tuổi

    /*
     * =========================
     * THIẾT BỊ Y TẾ
     * =========================
     */

    33: faStethoscope,
    // Thiết bị y tế

    34: faGaugeHigh,
    // Máy đo huyết áp

    35: faDroplet,
    // Máy đo đường huyết

    36: faTemperatureHalf,
    // Nhiệt kế

    37: faLungs,
    // Máy xông khí dung

    38: faHeartPulse,
    // Máy đo nồng độ oxy SpO2

    39: faKitMedical,
    // Dụng cụ sơ cứu

    40: faBoxOpen,
    // Vật tư y tế tiêu hao

    /*
     * =========================
     * MẸ VÀ BÉ
     * =========================
     */

    41: faBaby,
    // Mẹ và bé

    42: faGlassWater,
    // Sữa và dinh dưỡng cho bé

    43: faWater,
    // Tã bỉm và khăn ướt

    44: faSpa,
    // Chăm sóc da cho bé

    45: faBabyCarriage,
    // Đồ dùng cho bé

    46: faPersonPregnant,
    // Dinh dưỡng cho mẹ bầu

    47: faPersonPregnant,
    // Chăm sóc sau sinh

    48: faPersonBreastfeeding,
    // Hỗ trợ cho con bú

    /*
     * =========================
     * CHĂM SÓC Y TẾ
     * =========================
     */

    49: faKitMedical,
    // Chăm sóc y tế
  };

export function layIconDanhMuc(
  maDanhMuc: number,
): IconDefinition {
  return (
    ICON_DANH_MUC_THEO_MA[
      maDanhMuc
    ]
    ?? faTableCellsLarge
  );
}