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
    <div className="w-80 absolute top-22.5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-25 md:right-2 z-40 flex items-center gap-2 px-4 py-2">
      <div className="w-28 shrink-0">
        <Select
          value={targetIvCount}
          options={[2, 3, 4, 5, 6].map((n) => ({ value: n, label: `${n} IVs` }))}
          placeholder="IVs"
          className="py-1.75 px-4 text-center rounded-lg"
          onChange={(count) => count !== undefined && onTargetIvCountChange(count)}
        />
      </div>

      <SecondaryButton
        onClick={() => onOrientationChange(orientation === "horizontal" ? "vertical" : "horizontal")}
        className="flex-1"
      >
        {orientation === "horizontal" ? "Vertical" : "Horizontal"}
      </SecondaryButton>
    </div>
  );
}
