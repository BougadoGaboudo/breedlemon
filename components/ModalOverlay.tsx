"use client";

type ModalOverlayProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export function ModalOverlay({ onClose, children }: ModalOverlayProps) {
  return (
    <div className="fixed inset-0 bg-dark-500/50 flex items-center justify-center gap-4 z-50" onClick={onClose}>
      {children}
    </div>
  );
}
