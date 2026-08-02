type SecondaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isSelected?: boolean;
};

export default function SecondaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
  isSelected = false,
}: SecondaryButtonProps) {
  const baseClass = "px-4 py-2 rounded-lg transition-all duration-300 ease-out";

  const stateClass = disabled
    ? "border border-dark-500/15 bg-dark-500/5 text-dark-500/15 cursor-not-allowed"
    : isSelected
      ? "border border-primary-500 bg-primary-500 text-dark-500 cursor-pointer hover:bg-light-500/20"
      : "border border-dark-500 bg-light-500 text-dark-500 cursor-pointer hover:bg-primary-500/30";

  return (
    <button type="button" className={`${baseClass} ${stateClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
