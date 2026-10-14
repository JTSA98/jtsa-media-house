import Image from "next/image";

/**
 * Festive hero backdrop.
 *
 * Fixed rather than absolute, so the artwork stays put while the headline,
 * badge and CTAs scroll up over it. Everything after the hero sits on an
 * opaque wrapper in page.tsx, which is what keeps this from bleeding through
 * the sections below.
 *
 * Source art is the generated Diwali scene, served as responsive WebP from
 * public/hero. The centre of that image is deliberately empty dark sky, which
 * is what makes the H1 legible — the scrims here finish the job at the top
 * (where the garland and string lights are bright) and at the foot (where the
 * diya row sits under the stat cards).
 */

export function FestiveScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-kraft select-none"
    >
      <Image
        src="/hero/festive-1672.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={82}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Top wash — the garland and string lights run right under the fixed
          header, which would otherwise read as bright clutter. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,15,25,.72) 0%, rgba(11,15,25,.18) 18%, rgba(11,15,25,0) 34%)",
        }}
      />

      {/* Centre band. The H1 runs roughly 18%-81% of the viewport, so this
          holds a near-opaque wash across that whole span rather than fading
          in at the midpoint. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,15,25,.30) 0%, rgba(11,15,25,.72) 16%, rgba(11,15,25,.86) 30%, rgba(11,15,25,.88) 70%, rgba(11,15,25,.72) 84%, rgba(11,15,25,.30) 100%)",
        }}
      />

      {/* Foot — sits behind the stat cards, stops short so they keep contrast. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,15,25,0) 62%, rgba(11,15,25,.45) 100%)",
        }}
      />

      {/* Phones: the 16:9 art crops to its own dark centre at these widths,
          which is the safest place for text, but it needs more overall wash to
          stop the surviving slivers competing with the headline. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: "rgba(11,15,25,.45)" }}
      />
    </div>
  );
}