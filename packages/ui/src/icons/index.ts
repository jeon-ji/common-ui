/**
 * 아이콘 단일 배럴 — 새 아이콘은 ① svg/ 에 kebab-case 파일 추가 ② 여기서 createIcon으로
 * 감싸 export 두 단계로 등록한다. scripts/check-icons.ts가 md5 중복·네이밍·배럴 누락을 검사한다.
 *
 * `?react` import는 반드시 createIcon으로 감싼다 — 그대로 재수출하면 배포 d.ts에
 * 번들러 전용 specifier가 노출되어 소비자 tsc가 깨진다 (리뷰 M14).
 */
import { createIcon } from "../components/Icon/index.js";
import AlertTriangleSvg from "./svg/alert-triangle.svg?react";
import CheckSvg from "./svg/check.svg?react";
import CheckCircleSvg from "./svg/check-circle.svg?react";
import ChevronDownSvg from "./svg/chevron-down.svg?react";
import ChevronLeftSvg from "./svg/chevron-left.svg?react";
import ChevronRightSvg from "./svg/chevron-right.svg?react";
import ChevronUpSvg from "./svg/chevron-up.svg?react";
import CloseSvg from "./svg/close.svg?react";
import EyeSvg from "./svg/eye.svg?react";
import EyeOffSvg from "./svg/eye-off.svg?react";
import InfoCircleSvg from "./svg/info-circle.svg?react";
import SearchSvg from "./svg/search.svg?react";
import XCircleSvg from "./svg/x-circle.svg?react";

export const AlertTriangleIcon = createIcon(AlertTriangleSvg, "AlertTriangleIcon");
export const CheckCircleIcon = createIcon(CheckCircleSvg, "CheckCircleIcon");
export const CheckIcon = createIcon(CheckSvg, "CheckIcon");
export const ChevronDownIcon = createIcon(ChevronDownSvg, "ChevronDownIcon");
export const ChevronLeftIcon = createIcon(ChevronLeftSvg, "ChevronLeftIcon");
export const ChevronRightIcon = createIcon(ChevronRightSvg, "ChevronRightIcon");
export const ChevronUpIcon = createIcon(ChevronUpSvg, "ChevronUpIcon");
export const CloseIcon = createIcon(CloseSvg, "CloseIcon");
export const EyeIcon = createIcon(EyeSvg, "EyeIcon");
export const EyeOffIcon = createIcon(EyeOffSvg, "EyeOffIcon");
export const InfoCircleIcon = createIcon(InfoCircleSvg, "InfoCircleIcon");
export const SearchIcon = createIcon(SearchSvg, "SearchIcon");
export const XCircleIcon = createIcon(XCircleSvg, "XCircleIcon");
