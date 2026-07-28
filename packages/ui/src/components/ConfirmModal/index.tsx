import { forwardRef, type ReactNode } from "react";

import { Button } from "../Button/index.js";
import { Modal } from "../Modal/index.js";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * 동작의 성격 — danger는 삭제류, primary는 저장/진행류
   * @default "primary"
   */
  tone?: "danger" | "primary";
  title: ReactNode;
  /** 부가 설명 */
  description?: ReactNode;
  /** 확인 버튼 문구 @default tone에 따라 "삭제"/"확인" */
  confirmText?: string;
  /** 취소 버튼 문구 @default "취소" */
  cancelText?: string;
  /** 확인 클릭 시 호출 — 호출 후 onClose가 자동으로 이어진다 */
  onConfirm: () => void;
}

/**
 * 확인 모달 — sije-common의 ModalDelete/ModalEdit/ModalReset/ModalDeleteInUse
 * 4형제를 tone 하나로 통합한다 (복붙 드리프트 실증 사례의 해소).
 *
 * initial focus: danger는 **취소** 버튼(파괴 동작 오입력 방지), primary는 확인 버튼.
 * 명령형 confirm() 헬퍼는 백로그(07)다.
 */
export const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(function ConfirmModal(
  {
    open,
    onClose,
    tone = "primary",
    title,
    description,
    confirmText,
    cancelText = "취소",
    onConfirm,
  },
  ref,
) {
  const resolvedConfirmText = confirmText ?? (tone === "danger" ? "삭제" : "확인");
  const dangerous = tone === "danger";

  return (
    <Modal
      ref={ref}
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            tone="neutral"
            onClick={onClose}
            data-autofocus={dangerous ? "" : undefined}
          >
            {cancelText}
          </Button>
          <Button
            tone={tone}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            data-autofocus={dangerous ? undefined : ""}
          >
            {resolvedConfirmText}
          </Button>
        </>
      }
    >
      {description}
    </Modal>
  );
});
