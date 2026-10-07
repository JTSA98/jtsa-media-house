import { cn } from "@/lib/utils";

/** A strip of washi tape. Position with the caller's classes. */
export function Tape({
  className,
  rotate = -3,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("tape", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
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

/** Sticky note with handwriting. */
export function HandNote({
  children,
  className,
  rotate = -2,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={cn("hand-note", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
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