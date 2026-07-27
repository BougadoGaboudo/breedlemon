"use client";

type BreedButtonProps = { isReady: boolean; onClick: () => void };

export function BreedButton({ isReady, onClick }: BreedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isReady}
      className="px-4 py-2 rounded-lg transition-all duration-300 ease-out border border-dark-500 bg-dark-500 text-light-500 cursor-pointer hover:bg-light-500/50 hover:text-dark-500 hover:border-dark-500"
    >
      Breed
    </button>
  );
}
