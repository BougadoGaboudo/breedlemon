import { Stat, statLabels } from "@/data/stats";

type StatSliderProps = {
  stat: Stat;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const MAX_IV = 31;

export function StatSlider({ stat, value, onChange, disabled }: StatSliderProps) {
  const percent = (value / MAX_IV) * 100;

  return (
    <div className="grid grid-cols-5 gap-2 items-center">
      <span>{statLabels[stat]}</span>
      <span>{value}</span>
      <input
        id={stat}
        type="range"
        min={0}
        max={MAX_IV}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="col-span-3 w-full accent-primary-500"
        style={{
          background: `linear-gradient(to right, var(--color-primary-500) ${percent}%, var(--color-light-500) ${percent}%)`,
        }}
      />
    </div>
  );
}
