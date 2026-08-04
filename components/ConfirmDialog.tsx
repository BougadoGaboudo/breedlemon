"use client";

import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

type ConfirmDialogProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="bg-light-500 rounded-lg p-6 w-full max-w-sm flex flex-col gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">{title}</h2>
        {description && <p className="text-sm text-dark-500/70">{description}</p>}
      </div>
      <div className="flex gap-2">
        <SecondaryButton onClick={onCancel} className="w-full">
          {cancelLabel}
        </SecondaryButton>
        <PrimaryButton onClick={onConfirm} className="w-full">
          {confirmLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}
