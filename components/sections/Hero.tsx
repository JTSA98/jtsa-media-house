import Image from "next/image";
import type { SiteView } from "@/lib/settings";

export function Hero({ site }: { site: SiteView }) {
  return (
    <header id="top" className="pt-12 pb-20 overflow-hidden">
      <div className="wrap">
        
        {/* Top Sub-Brand Tagline Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kraft-2 border border-green/30 text-green-2 text-xs font-bold">
            <span className="size-2 rounded-full bg-green animate-ping" />
            <span>COMMERCIAL CREATIVE & ADVERTISING POWERHOUSE</span>
          </div>
          <div className="text-xs font-bold text-yellow tracking-wider uppercase flex items-center gap-2">
            <span>✦</span>
            <span>JEWELLERY • GYMS • MEGA RETAIL • BIG CORPORATES</span>
            <span>✦</span>
          </div>
        </div>

        {/* MASSIVE MONUMENTAL HEADLINE (UNMISSABLE BRANDING) */}
        <div className="mb-12">
          <h1 className="font-brand font-black text-5xl sm:text-7xl lg:text-9xl tracking-tight text-white uppercase leading-[0.9] text-glow">
            JTSA<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green via-emerald-300 to-yellow">
              MEDIA HOUSE
            </span>
          </h1>
          
          <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6 border-t border-white/10">
            <p className="text-base sm:text-xl text-ink-2 max-w-2xl font-normal leading-relaxed">
              Dhanbad’s dedicated growth agency for <strong className="text-white">Gold & Jewellery Showrooms</strong>, <strong className="text-white">Fitness Centers & Gyms</strong>, <strong className="text-white">Automobile Dealers</strong>, and <strong className="text-green">Mega Retail Brands</strong>. High-impact road hoardings, 4K viral reels, and targeted footfall campaigns.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-ink-3 uppercase tracking-widest">Guaranteed Speed:</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-kraft-2 border border-green/40 text-green font-mono text-xs font-bold">
                ⚡ Free Campaign Draft within 24 Hours
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
             BENTO MEDIA CANVAS (THE DESIGN THE USER LOVED)
             ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/*  BENTO 1: LIVE 4K COMMERCIAL REEL SHOWCASE  */}
          <div className="md:col-span-5 lg:col-span-4 bento-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-green bg-kraft-3 px-3 py-1 rounded-full border border-green/30">
                COMMERCIAL 4K REELS
              </span>
              <span className="text-xs text-ink-3 font-mono">₹4,999 / reel</span>
            </div>

            {/*  Smartphone Mockup with Real Reel Poster  */}
            <div className="relative my-4 perspective-mockup flex justify-center">
              <div className="phone-tilt w-56 rounded-[2.5rem] bg-black p-2.5 border-4 border-green/40 shadow-2xl shadow-green/20 relative">
                <div className="w-full aspect-[9/16] rounded-[2rem] overflow-hidden relative group">
                  <Image
                    src="/images/real-win.jpg"
                    alt="Reel Sample"
                    fill
                    sizes="220px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex justify-between items-center text-[10px] text-white">
                      <span className="bg-red-600 px-2 py-0.5 rounded-full font-bold">● REC 4K</span>
                      <span className="font-mono">00:30</span>
                    </div>
                    <div>
                      <div className="size-9 rounded-full bg-green text-black flex items-center justify-center font-bold text-sm mx-auto mb-2 shadow-lg animate-bounce">
                        ▶
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">Jewellery & Gym Festive Campaign</p>
                      <p className="text-[10px] text-green mt-0.5">Hindi Voiceover • 52K Views in Dhanbad</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white">30s High-Energy Vertical Video</h4>
              <p className="text-xs text-ink-3 mt-1">Shot on-location in Bank More & Saraidhela. Macro jewellery, gym workouts & showroom walkthroughs.</p>
            </div>
          </div>

          {/*  BENTO 2: MEGA OUTDOOR HOARDINGS & HIGHWAY FLEX  */}
          <div className="md:col-span-7 lg:col-span-5 bento-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow bg-kraft-3 px-3 py-1 rounded-full border border-yellow/30">
                MEGA ROADSIDE HOARDINGS
              </span>
              <span className="text-xs text-yellow font-mono font-bold">₹35 / sq.ft (Design Included)</span>
            </div>

            {/*  Print Work Mockup  */}
            <div className="relative my-3 h-52 rounded-2xl overflow-hidden border border-white/15 shadow-xl group">
              <Image
                src="/images/campaign-poster.jpeg"
                alt="Campaign Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-green uppercase">Commercial Print Output</span>
                  <h4 className="text-sm font-bold text-white">Bank More & Highway Prime Billboards</h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-kraft-3 border border-white/20 text-xs font-bold text-white">
                  Frontlit / Backlit
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-ink-3 block text-[10px]">Showroom Standee (6x2.5 ft)</span>
                <span className="font-bold text-white text-sm">₹1,799 Complete</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-ink-3 block text-[10px]">Festive Promo Print</span>
                <span className="font-bold text-white text-sm">₹499 Print + Design</span>
              </div>
            </div>
          </div>

          {/*  BENTO 3: COMMERCIAL METRICS & VERIFICATION  */}
          <div className="md:col-span-12 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            
            <div className="bento-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-kraft-3 border border-green/40 flex items-center justify-center font-bold text-green text-lg mb-4">
                  💎
                </div>
                <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider">COMMERCIAL FOOTFALL</span>
                <div className="text-3xl font-brand font-black text-white mt-1">₹40L+</div>
                <p className="text-xs text-ink-2 mt-1">Client revenue generated through festive campaigns & showroom launches in Dhanbad.</p>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-green font-semibold">
                ✔ 85+ Commercial Campaigns Delivered
              </div>
            </div>

            <div className="bento-card rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-kraft-2 to-kraft">
              <div>
                <div className="size-10 rounded-xl bg-kraft-3 border border-yellow/40 flex items-center justify-center font-bold text-yellow text-lg mb-4">
                  ⚡
                </div>
                <span className="text-[11px] font-bold text-ink-3 uppercase tracking-wider">SPEED TO MARKET</span>
                <div className="text-3xl font-brand font-black text-white mt-1">48 Hours</div>
                <p className="text-xs text-ink-2 mt-1">From initial campaign brief to high-resolution billboard print and live ad dispatch.</p>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-yellow font-semibold">
                ✔ GST & Udyam Verified Invoicing
              </div>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}