import { maxIV, Stat, statLabels } from "@/data/stats";

type StatSliderProps = {
  stat: Stat;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

export function StatSlider({ stat, value, onChange, disabled }: StatSliderProps) {
  const percent = (value / maxIV) * 100;

  return (
    <div className="grid grid-cols-8 gap-4 items-center">
      <span>{statLabels[stat]}</span>
      <span className="text-right">{value}</span>
      <input
        id={stat}
        type="range"
        min={0}
        max={maxIV}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="col-span-6 w-full accent-primary-500"
        style={{
          background: `linear-gradient(to right, var(--color-primary-500) ${percent}%, var(--color-light-500) ${percent}%)`,
        }}
      />
    </div>
  );
}
