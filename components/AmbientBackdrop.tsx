"use client";

import { useEffect } from "react";

/* Ambient background layers, mounted once for the whole app.
   Kept out of globals.css so the teal/gold wash and the falling leaves
   exist on every route without each page having to opt in. */
export function AmbientBackdrop() {
  useEffect(() => {
    // ── aurora wash ──
    const aurora = document.createElement("div");
    aurora.className = "bg-aurora";
    aurora.setAttribute("aria-hidden", "true");
    aurora.innerHTML = '<i class="a1"></i><i class="a2"></i><i class="a3"></i>';

    // ── falling leaves ──
    const motes = document.createElement("div");
    motes.id = "motes";
    motes.className = "motes";
    motes.setAttribute("aria-hidden", "true");

    document.body.append(aurora, motes);

    const COUNT = 14;
    const TEAL = [0, 245, 212];
    const GOLD = [255, 184, 0];
    const BLUE = [56, 150, 210];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("span");
      el.className = "mote";

      const rgb =
        Math.random() < 0.62
          ? TEAL
          : Math.random() < 0.5
            ? GOLD
            : BLUE;

      const w = rand(6, 15);
      el.style.width = `${w}px`;
      el.style.height = `${w * rand(1.5, 2.3)}px`;
      el.style.left = `${rand(-2, 100)}%`;
      el.style.borderRadius =
        Math.random() < 0.5
          ? "0 100% 0 100%"
          : "60% 40% 55% 45% / 50% 60% 40% 50%";
      el.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      el.style.filter = `blur(${rand(1.4, 2.8).toFixed(1)}px)`;
      el.style.setProperty("--o", rand(0.16, 0.38).toFixed(2));
      el.style.setProperty("--sway", `${rand(-6, 6).toFixed(1)}vw`);
      el.style.transform = `rotate(${rand(-40, 40).toFixed(0)}deg)`;
      el.style.animation = `fall ${rand(24, 42).toFixed(0)}s linear ${rand(
        -42,
        0,
      ).toFixed(0)}s infinite`;

      motes.appendChild(el);
    }

    return () => {
      aurora.remove();
      motes.remove();
    };
  }, []);

  return null;
}