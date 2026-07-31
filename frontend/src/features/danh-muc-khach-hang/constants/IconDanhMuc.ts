import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBandage,
  faBone,
  faBottleDroplet,
  faBrain,
  faBrush,
  faCapsules,
  faDroplet,
  faEye,
  faFaceSmile,
  faFlask,
  faGaugeHigh,
  faGlassWater,
  faHeartPulse,
  faHouse,
  faKitMedical,
  faLeaf,
  faLungs,
  faMaskFace,
  faMugHot,
  faPerson,
  faPills,
  faRibbon,
  faScissors,
  faShieldVirus,
  faSoap,
  faSpa,
  faStethoscope,
  faSyringe,
  faTableCellsLarge,
  faTemperatureHalf,
  faTooth,
  faVenusMars,
  faVirus,
  faWandMagicSparkles,
  faWater,
} from "@fortawesome/free-solid-svg-icons";

const ICON_DANH_MUC_THEO_MA: Record<number, IconDefinition> = {
  // Danh mục cấp 1
  1: faCapsules,            // Thực phẩm chức năng
  2: faSpa,                 // Dược mỹ phẩm
  3: faPills,               // Thuốc
  4: faPerson,              // Chăm sóc cá nhân
  5: faStethoscope,         // Thiết bị y tế

  // Nhóm Thuốc
  6: faShieldVirus,         // Thuốc dị ứng
  7: faFlask,               // Thuốc giải độc và khử độc
  8: faBandage,             // Thuốc da liễu
  9: faBottleDroplet,       // Miếng dán, cao xoa, dầu
  10: faBone,               // Cơ - xương - khớp
  11: faCapsules,           // Thuốc bổ & vitamin
  12: faRibbon,             // Thuốc ung thư
  13: faTemperatureHalf,    // Thuốc giảm đau, hạ sốt, kháng viêm
  14: faLungs,              // Thuốc hô hấp
  15: faVirus,              // Thuốc kháng sinh, kháng nấm
  16: faEye,                // Thuốc Mắt, Tai, Mũi, Họng
  17: faBrain,              // Thuốc hệ thần kinh
  18: faSyringe,            // Thuốc tiêm chích & dịch truyền
  19: faFlask,              // Thuốc tiêu hoá & gan mật
  20: faHeartPulse,         // Thuốc tim mạch & máu
  21: faVenusMars,          // Thuốc tiết niệu - sinh dục
  22: faDroplet,            // Thuốc trị tiểu đường

  // Nhóm Dược mỹ phẩm
  23: faFaceSmile,          // Chăm sóc da mặt
  24: faPerson,             // Chăm sóc cơ thể
  25: faScissors,           // Chăm sóc tóc - da đầu
  26: faBrush,              // Mỹ phẩm trang điểm
  27: faLeaf,               // Sản phẩm từ thiên nhiên

  // Nhóm Chăm sóc cá nhân
  28: faTooth,              // Chăm sóc răng miệng
  29: faSoap,               // Vệ sinh cá nhân
  30: faMugHot,             // Thực phẩm - Đồ uống
  31: faHouse,              // Đồ dùng gia đình
  32: faVenusMars,          // Hỗ trợ tình dục
  33: faWandMagicSparkles,  // Thiết bị làm đẹp

  // Nhóm Thiết bị y tế
  34: faStethoscope,        // Dụng cụ y tế
  35: faGaugeHigh,          // Dụng cụ theo dõi
  36: faKitMedical,         // Dụng cụ sơ cứu
  37: faMaskFace,           // Khẩu trang

  // Nhóm Thực phẩm chức năng
  38: faCapsules,           // Vitamin & Khoáng chất
  39: faShieldVirus,        // Miễn dịch - Đề kháng
  40: faVenusMars,          // Sinh lý - Nội tiết tố
  41: faEye,                // Mắt - Thị lực
  42: faFlask,              // Tiêu hóa
  43: faBrain,              // Thần kinh não
  44: faWandMagicSparkles,  // Hỗ trợ làm đẹp
  45: faDroplet,            // Đường huyết - Tiểu đường
  46: faHeartPulse,         // Tim mạch - Huyết áp
  47: faLungs,              // Hô hấp - Tai mũi họng
  48: faBone,               // Cơ - Xương khớp
  49: faPills,              // Gan - Mật
  50: faWater,              // Thận - Tiết niệu
  51: faGlassWater,         // Sữa
};

export function layIconDanhMuc(maDanhMuc: number): IconDefinition {
  return ICON_DANH_MUC_THEO_MA[maDanhMuc] ?? faTableCellsLarge;
}