"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/site-config";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div key={item.q} className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-6 px-1.5 py-6 text-left"
            >
              <span
                className={`text-[16px] leading-[1.45] font-semibold transition-colors ${
                  isOpen ? "text-green" : "text-ink hover:text-green"
                }`}
              >
                {item.q}
              </span>
              <span
                aria-hidden
                className={`shrink-0 text-[24px] leading-none font-light text-green transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-1.5 pr-11 pb-6 text-[14.5px] leading-[1.82] text-ink-2">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}