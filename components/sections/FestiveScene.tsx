/**
 * Festive hero scene, drawn entirely in CSS and SVG.
 *
 * The reference design is a split composition: a cluster of creators with
 * phones on the left, a pandal and market stalls on the right, with the
 * headline centred over the seam. That artwork cannot be sourced here, so
 * this rebuilds the same composition from vectors — flat silhouette figures,
 * a temple arch, market canopies and a crowd, under a toran garland and
 * string lights.
 *
 * Two rules keep it decoration rather than content:
 *   - the whole layer is aria-hidden and pointer-events-none;
 *   - a scrim darkens the centre so the H1 keeps full contrast over it.
 *
 * Positions are fixed arrays rather than randomised, because a Math.random()
 * here would differ between server and client render.
 */

/* Warm festive palette. Left side leans magenta/purple to read as "digital",
   right side leans saffron/amber to read as "ground". */
const MARIGOLD = "#f59e0b";
const SAFFRON = "#fb923c";
const TURMERIC = "#facc15";
const DEEP_PINK = "#ec4899";
const MAGENTA = "#d946ef";
const INDIGO = "#6366f1";
const TERRA = "#b45309";

/** Creator figures for the left panel: head, shoulders, and a raised phone. */
const CREATORS = [
  { x: 34, y: 300, s: 1.0, skin: "#f2c9a0", cloth: "#7c3aed", phone: true },
  { x: 104, y: 262, s: 0.86, skin: "#e8b98d", cloth: "#db2777", phone: true },
  { x: 66, y: 372, s: 1.12, skin: "#d9a06a", cloth: "#4338ca", phone: false },
  { x: 152, y: 336, s: 0.78, skin: "#f2c9a0", cloth: "#0891b2", phone: true },
  { x: 12, y: 392, s: 0.92, skin: "#c98a5a", cloth: "#9d174d", phone: false },
  { x: 186, y: 404, s: 0.95, skin: "#e8b98d", cloth: "#6d28d9", phone: true },
];

/** Engagement bubbles. All sit at x < 120 of a 220-wide panel, which is the
 *  outer fifth of the screen — clear of the headline's centred column. */
const BUBBLES = [
  { x: 16, y: 214, icon: "heart", label: "1,204" },
  { x: 54, y: 168, icon: "heart", label: "9,318" },
  { x: 10, y: 132, icon: "eye", label: "31K" },
  { x: 72, y: 268, icon: "heart", label: "846" },
  { x: 34, y: 96, icon: "eye", label: "V6ews" },
];

/** String-light catenary across the top. */
const BULBS = Array.from({ length: 22 }, (_, i) => {
  const t = i / 21;
  // Parabolic sag between two anchor points.
  const x = 4 + t * 1392;
  const y = 70 + 46 * (1 - Math.pow(2 * t - 1, 2));
  const tone = [TURMERIC, DEEP_PINK, MARIGOLD, TURMERIC, "#a78bfa"][i % 5];
  return { x, y, tone, r: i % 5 === 0 ? 6 : 4.5 };
});

/** Marigold toran strung across the very top. */
const TORAN = Array.from({ length: 30 }, (_, i) => ({
  x: 10 + i * 48,
  tone: [MARIGOLD, SAFFRON, TURMERIC, MARIGOLD, "#84cc16"][i % 5],
  r: i % 2 === 0 ? 11 : 8,
}));

/** Diya lamps along the bottom edge. */
const DIYAS = [
  { x: 70, s: 1 },
  { x: 250, s: 0.8 },
  { x: 430, s: 0.95 },
  { x: 1290, s: 1 },
  { x: 1130, s: 0.85 },
  { x: 960, s: 0.95 },
];

export function FestiveScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* ── night sky, warmer toward the temple ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 78% 8%, #3b2410 0%, #1e1436 42%, #0b0f19 100%)",
        }}
      />

      {/* diya glow pools */}
      <div
        className="absolute -right-40 bottom-0 size-[620px] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(closest-side, rgba(251,146,60,.55), transparent 72%)",
        }}
      />
      <div
        className="absolute -left-52 bottom-10 size-[560px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(217,70,239,.45), transparent 72%)",
        }}
      />

      {/* ── toran garland — sits below the fixed header, not behind it ── */}
      <svg
        className="absolute inset-x-0 top-20 h-20 w-full opacity-80"
        viewBox="0 0 1400 100"
        preserveAspectRatio="xMidYMin slice"
      >
        {TORAN.map((f, i) => (
          <circle key={`t${i}`} cx={f.x} cy={f.r + 2} r={f.r} fill={f.tone} />
        ))}
        <rect x="0" y="0" width="1400" height="4" fill={MARIGOLD} opacity=".5" />
      </svg>

      {/* ── string lights ── */}
      <svg
        className="absolute inset-x-0 top-28 h-32 w-full opacity-70"
        viewBox="0 0 1400 150"
        preserveAspectRatio="none"
      >
        <path
          d={`M4,70 Q700,${70 + 92} 1396,70`}
          stroke="#4c3a6b"
          strokeWidth="2"
          fill="none"
        />
        {BULBS.map((b, i) => (
          <g key={`b${i}`}>
            <circle cx={b.x} cy={b.y} r={b.r + 5} fill={b.tone} opacity=".18" />
            <circle cx={b.x} cy={b.y} r={b.r} fill={b.tone} />
          </g>
        ))}
      </svg>

      {/* ── left: the creator swarm. Kept to the outer edge — the H1 is wide, so
             anything further in would sit underneath the text. ── */}
      <svg
        className="absolute inset-y-0 left-0 w-[30%] max-w-[360px] opacity-55"
        viewBox="0 0 220 480"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="fs-creatorCloth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>

        {/* soft floor so the figures are not floating on nothing */}
        <ellipse cx="110" cy="470" rx="150" ry="34" fill="#000" opacity=".35" />

        {CREATORS.map((c, i) => (
          <g key={`c${i}`} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            {/* shoulders */}
            <path
              d="M-42,120 C-42,66 -22,48 0,48 C22,48 42,66 42,120 Z"
              fill={c.cloth}
            />
            {/* head */}
            <circle cx="0" cy="22" r="21" fill={c.skin} />
            {/* hair */}
            <path
              d="M-21,18 C-21,-6 21,-6 21,18 C14,6 -14,6 -21,18 Z"
              fill="#2a1b3d"
            />
            {c.phone ? (
              <g>
                <rect x="26" y="-4" width="17" height="30" rx="4" fill="#1b1630" />
                <rect x="28" y="0" width="13" height="22" rx="2" fill="#c4b5fd" />
                <path d="M32,9 l6,3 l-6,3 z" fill="#7c3aed" />
              </g>
            ) : null}
          </g>
        ))}

        {/* engagement bubbles */}
        {BUBBLES.map((b, i) => (
          <g key={`bb${i}`} transform={`translate(${b.x} ${b.y}) scale(0.82)`}>
            <rect
              x="0"
              y="-12"
              width="52"
              height="24"
              rx="12"
              fill="#1b1338"
              stroke={DEEP_PINK}
              strokeOpacity=".55"
            />
            <text
              x="10"
              y="5"
              fontSize="11"
              fontWeight="700"
              fill={DEEP_PINK}
              fontFamily="system-ui, sans-serif"
            >
              {b.icon === "heart" ? "♥" : "◉"}
            </text>
            <text
              x="23"
              y="5"
              fontSize="11"
              fontWeight="700"
              fill="#f5f3ff"
              fontFamily="system-ui, sans-serif"
            >
              {b.label}
            </text>
          </g>
        ))}
      </svg>

      {/* ── right: pandal, stalls, crowd ── */}
      <svg
        className="absolute inset-y-0 right-0 w-[32%] max-w-[400px] opacity-60"
        viewBox="0 0 300 480"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* crowd silhouettes */}
        {[28, 62, 96, 130, 164, 198, 232, 266].map((x, i) => (
          <g key={`cr${i}`} opacity={0.5 + (i % 3) * 0.12} transform={`translate(${x} ${392 + (i % 2) * 12})`}>
            <circle cx="0" cy="0" r="11" fill="#120d24" />
            <path d="M-15,46 C-15,20 -8,13 0,13 C8,13 15,20 15,46 Z" fill="#120d24" />
          </g>
        ))}

        {/* temple arch */}
        <g>
          {/* kalash */}
          <circle cx="150" cy="34" r="9" fill={TURMERIC} />
          <path d="M138,44 h24 l-5,14 h-14 Z" fill={SAFFRON} />
          {/* dome */}
          <path
            d="M150,58 C118,66 96,96 96,132 L96,150 L204,150 L204,132 C204,96 182,66 150,58 Z"
            fill={MARIGOLD}
            opacity=".92"
          />
          {/* body */}
          <path d="M74,150 h152 v250 h-152 Z" fill={TERRA} opacity=".9" />
          {/* inner arch */}
          <path
            d="M118,400 L118,236 C118,196 132,176 150,176 C168,176 182,196 182,236 L182,400 Z"
            fill="#2a1408"
          />
          {/* sanctum glow */}
          <ellipse cx="150" cy="300" rx="30" ry="80" fill={TURMERIC} opacity=".45" />
          {/* figure in the sanctum */}
          <circle cx="150" cy="248" r="13" fill="#fde68a" opacity=".9" />
          <path d="M134,320 C134,282 141,268 150,268 C159,268 166,282 166,320 Z" fill="#fcd34d" opacity=".9" />
          {/* pillars */}
          <rect x="74" y="150" width="14" height="250" fill="#92400e" />
          <rect x="212" y="150" width="14" height="250" fill="#92400e" />
        </g>

        {/* market stalls */}
        {[
          { x: 8, w: 66, c: "#be123c" },
          { x: 226, w: 66, c: "#0369a1" },
        ].map((s, i) => (
          <g key={`s${i}`} transform={`translate(${s.x} 300)`}>
            {/* striped canopy */}
            <path d={`M0,22 L${s.w / 2},0 L${s.w},22 Z`} fill={s.c} />
            <path
              d={`M0,22 L${s.w},22 L${s.w},30 L0,30 Z`}
              fill={TURMERIC}
              opacity=".8"
            />
            <rect x="4" y="30" width={s.w - 8} height="58" fill="#3b1d12" />
            {/* counter goods */}
            {[10, 26, 42].map((gx) => (
              <rect
                key={gx}
                x={gx}
                y="36"
                width="10"
                height="18"
                rx="2"
                fill={MARIGOLD}
                opacity=".7"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* ── diya lamps ── */}
      <svg
        className="absolute inset-x-0 bottom-0 h-24 w-full"
        viewBox="0 0 1400 100"
        preserveAspectRatio="xMidYMax slice"
      >
        {DIYAS.map((d, i) => (
          <g key={`d${i}`} transform={`translate(${d.x} 84) scale(${d.s})`}>
            <ellipse cx="0" cy="0" rx="16" ry="5" fill={TERRA} />
            <path d="M-16,0 C-16,-9 16,-9 16,0 Z" fill={SAFFRON} />
            <ellipse cx="0" cy="-14" rx="16" ry="12" fill={TURMERIC} opacity=".5" />
            <path d="M0,-22 C6,-13 6,-7 0,-4 C-6,-7 -6,-13 0,-22 Z" fill="#fef08a" />
          </g>
        ))}
      </svg>

      {/* ── centre scrim.
          The H1 runs about 18%–81% of the viewport, so this band has to be
          near-opaque across that whole range — not just the midpoint — or
          the temple and the engagement bubbles bleed through the words. ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,15,25,0) 0%, rgba(11,15,25,.55) 12%, rgba(11,15,25,.94) 22%, rgba(11,15,25,.97) 50%, rgba(11,15,25,.94) 78%, rgba(11,15,25,.55) 88%, rgba(11,15,25,0) 100%)",
        }}
      />
      {/* Phones: no room for a side panel, so the scene becomes a dimmed
          full-bleed backdrop with a heavier wash over it. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: "rgba(11,15,25,.62)" }}
      />
      <div
        className="absolute inset-0 opacity-80 lg:opacity-45"
        style={{
          /* Stops short of .8 at the foot — the stat cards sit right there
             and were being crushed to near-invisible. */
          background:
            "linear-gradient(180deg, rgba(11,15,25,.6) 0%, rgba(11,15,25,0) 26%, rgba(11,15,25,0) 66%, rgba(11,15,25,.42) 100%)",
        }}
      />
    </div>
  );
}