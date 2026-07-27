type SelectOption<T> = { value: T; label: string };

type SelectProps<T extends string | number> = {
  value: T | undefined;
  options: SelectOption<T>[];
  placeholder: string;
  clearLabel?: string;
  disabled?: boolean;
  onChange: (value: T | undefined) => void;
};

export function Select<T extends string | number>({
  value,
  options,
  placeholder,
  clearLabel,
  disabled,
  onChange,
}: SelectProps<T>) {
  const isNumeric = options.length > 0 && typeof options[0].value === "number";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(undefined);
      return;
    }
    onChange((isNumeric ? Number(raw) : raw) as T);
  };

  return (
    <select
      className="w-full cursor-pointer border border-dark-500 rounded-sm"
      value={value ?? ""}
      disabled={disabled}
      onChange={handleChange}
    >
      {clearLabel ? (
        <option value="">{clearLabel}</option>
      ) : (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
