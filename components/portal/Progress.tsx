import { cn } from "@/lib/utils";

/**
 * Progress bar drawn as a hand-coloured ruler rather than a smooth pill,
 * to stay consistent with the paper art direction.
 */
export function ProgressBar({
  value,
  className,
  tone = "green",
}: {
  value: number;
  className?: string;
  tone?: "green" | "yellow";
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Project completion"
      className={cn("relative h-4 border-[2.5px] border-ink bg-kraft-2", className)}
    >
      <div
        className={cn(
          "h-full transition-[width] duration-700 ease-out",
          tone === "green" ? "bg-green" : "bg-yellow",
        )}
        style={{ width: `${clamped}%` }}
      />
      {/* ruler ticks */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 19 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1 border-r border-ink/12 last:border-r-0"
          />
        ))}
      </div>
    </div>
  );
}

/** Big percentage number in the display serif-ish condensed style. */
export function ProgressDial({
  value,
  size = 132,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped} percent complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#DCCFB6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1B7A45"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="butt"
          className="transition-[stroke-dasharray] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="text-[30px] leading-none font-extrabold tracking-[-0.03em] text-green">
          {clamped}%
        </b>
        {label ? (
          <span className="mt-1 text-[9.5px] font-bold tracking-[0.16em] text-ink-3 uppercase">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}