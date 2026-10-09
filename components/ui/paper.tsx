import { cn } from "@/lib/utils";

/** Retired with the paper-craft design — kept as a no-op so the
    remaining call sites compile without touching their markup. */
export function Tape({
  className,
  rotate: _rotate,
}: {
  className?: string;
  rotate?: number;
}) {
  return null;
}

/** Marker-highlighted phrase. */
export function Marker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("marker", className)}>
      {children}
      <span className="sr-only"> </span>
    </span>
  );
}

/** Accent note card. */
export function HandNote({
  children,
  className,
  rotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-green/25 bg-kraft-3 px-4 py-3 font-semibold tracking-[0.06em] text-green shadow-[0_14px_34px_rgba(0,245,212,0.12)]",
        className,
      )}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {children}
    </div>
  );
}

export function Btn({
  children,
  href,
  tone = "green",
  size = "md",
  className,
  type,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  tone?: "green" | "yellow" | "white";
  size?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const cls = cn(
    "btn",
    tone === "green" && "btn-green",
    tone === "yellow" && "btn-yellow",
    tone === "white" && "btn-white",
    size === "lg" && "text-[15.5px] px-[38px] py-[19px]",
    className,
  );

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}