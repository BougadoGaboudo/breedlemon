"use client";

import { PairingStatus } from "@/lib/genealogyTree";

type PairingStatusBadgeProps = {
  status: PairingStatus;
  onChange: (status: PairingStatus) => void;
};

const STATUS_ORDER: PairingStatus[] = ["not_started", "in_progress", "done"];

const STATUS_CONFIG: Record<PairingStatus, { label: string; color: string }> = {
  not_started: { label: "Pas encore fait", color: "bg-red-500" },
  in_progress: { label: "En cours", color: "bg-primary-500" },
  done: { label: "Terminé", color: "bg-green-500" },
};

export function PairingStatusBadge({ status, onChange }: PairingStatusBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length;
    onChange(STATUS_ORDER[nextIndex]);
  };

  const { label, color } = STATUS_CONFIG[status];

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${label} - clique pour changer`}
      className={`absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full border-2 border-dark-500  text-xs cursor-pointer z-10 ${color}`}
    >
      {label}
    </button>
  );
}
