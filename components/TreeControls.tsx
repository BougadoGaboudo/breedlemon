"use client";

import { Select } from "./Select";
import SecondaryButton from "./SecondaryButton";

type TreeControlsProps = {
  targetIvCount: number;
  onTargetIvCountChange: (count: number) => void;
  orientation: "horizontal" | "vertical";
  onOrientationChange: (orientation: "horizontal" | "vertical") => void;
};

export function TreeControls({
  targetIvCount,
  onTargetIvCountChange,
  orientation,
  onOrientationChange,
}: TreeControlsProps) {
  return (
    <div className="w-80 absolute top-22.5 right-6.5 md:top-30 md:right-10 z-40 flex items-center gap-2 bg-light-500 border-2 border-dark-500 rounded-lg px-4 py-2">
      <span className="text-sm whitespace-nowrap">IVs visés :</span>
      <Select
        value={targetIvCount}
        options={[2, 3, 4, 5, 6].map((n) => ({ value: n, label: `${n} IVs` }))}
        placeholder="IVs"
        className="py-1.75 px-4"
        onChange={(count) => count !== undefined && onTargetIvCountChange(count)}
      />

      <SecondaryButton onClick={() => onOrientationChange(orientation === "horizontal" ? "vertical" : "horizontal")}>
        {orientation === "horizontal" ? "Vertical" : "Horizontal"}
      </SecondaryButton>
    </div>
  );
}
