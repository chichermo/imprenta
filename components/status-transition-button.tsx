"use client";

type StatusTransitionButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
};

export function StatusTransitionButton({
  label,
  onClick,
  disabled = false,
  variant = "ghost",
}: StatusTransitionButtonProps) {
  const className =
    variant === "primary" ? "action-button action-button--compact" : "ghost-button ghost-button--compact";

  return (
    <button className={className} disabled={disabled} onClick={onClick} type="button">
      {label}
    </button>
  );
}
