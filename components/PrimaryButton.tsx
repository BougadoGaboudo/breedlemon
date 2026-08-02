type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isSelected?: boolean;
};

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
  isSelected = false,
}: PrimaryButtonProps) {
  const baseClass = "px-4 py-2 rounded-lg transition-all duration-300 ease-out";

  const stateClass = disabled
    ? "border border-primary-500/30 bg-primary-500/30 text-dark-500/30 cursor-not-allowed"
    : isSelected
      ? "border border-dark-500 bg-dark-500 text-light-500 cursor-pointer"
      : "border border-primary-500 bg-primary-500 text-dark-500 cursor-pointer hover:bg-dark-500 hover:text-primary-500 hover:border-dark-500";

  return (
    <button type="button" className={`${baseClass} ${stateClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
