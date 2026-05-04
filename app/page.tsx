"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Radio, ScanFace, Waves, Sparkles, Zap } from "lucide-react";
import { gsap } from "gsap";

import { localizedCopy, moodCollections } from "@/lib/product-upgrade-data";
import { landingPageCopy } from "@/lib/vietnamese-home-copy";
import { cn } from "@/lib/tienIch";
import { DanhSachBaiHatTuApi } from "@/components/DanhSachBaiHatTuApi";

// =================================================================
// 1. ADVANCED COSMIC ATMOSPHERE (6-LAYER VOLUMETRIC SYSTEM)
// =================================================================

function CosmicCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(starfieldRef.current, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 1.5,
        });

        gsap.to(nebulaRef.current, {
          x: -x * 1.2,
          y: -y * 1.2,
          duration: 2,
        });

        gsap.to(coreRef.current, {
          x: -x * 0.8,
          y: -y * 0.8,
          duration: 1.8,
        });

        gsap.to(shardsRef.current, {
          x: x * 2.5,
          y: y * 2.5,
          duration: 2.2,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      gsap.to(".core-pulse", {
        scale: 1.15,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glass-shard", {
        y: "random(-40, 40)",
        rotation: "random(-20, 20)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.3,
      });

      return () => window.removeEventListener("mousemove", handleMouseMove);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#020202]"
    >
      {/* LAYER 1: DEEP NEBULA */}
      <div ref={nebulaRef} className="absolute inset-[-15%] opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,139,235,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(79,172,254,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />
      </div>

      {/* LAYER 2: STARFIELD CLUSTERS */}
      <div ref={starfieldRef} className="absolute inset-[-5%] opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)",
            backgroundSize: "120px 120px",
            backgroundPosition: "30px 30px",
          }}
        />
      </div>

      {/* LAYER 3: CENTRAL ENERGY CORE */}
      <div
        ref={coreRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="core-pulse absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(var(--brand-accent-rgb,30,215,96),0.15)_0%,transparent_70%)] blur-[80px]" />

        <div className="absolute w-[800px] h-[800px] rounded-full border border-white/[0.03] animate-spin-slow opacity-20" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-white/[0.05] animate-spin-slow-reverse opacity-30" />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[var(--brand-accent)]/10 via-transparent to-white/5 blur-[40px]"
        />
      </div>

      {/* LAYER 4: GLASS SHARDS */}
      <div ref={shardsRef} className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="glass-shard absolute rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 80}%`,
              opacity: 0.1 + Math.random() * 0.2,
              rotate: `${Math.random() * 360}deg`,
            }}
          />
        ))}
      </div>

      {/* LAYER 5: FRONT DUST PARTICLES */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -200],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
            style={{ left: `${Math.random() * 100}%`, top: "110%" }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[2px]" />
    </div>
  );
}

// =================================================================
// 2. REUSABLE UI COMPONENTS
// =================================================================

function GlowCta({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative px-10 py-5 rounded-full font-black uppercase tracking-[0.25em] text-[0.65rem] transition-all duration-500 active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden",
        variant === "primary"
          ? "bg-white text-black hover:bg-white/90"
          : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30",
        className,
      )}
    >
      <div className="relative z-10 flex items-center gap-2">{children}</div>

      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </Link>
  );
}

// =================================================================
// 3. MAIN LANDING PAGE
// =================================================================

export default function Page() {
  const copy = landingPageCopy;

  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(headlineRef.current, {
      y: 60,
      opacity: 0,
      filter: "blur(20px) brightness(2)",
      duration: 1.5,
      ease: "expo.out",
    })
      .from(
        subTextRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1",
      )
      .from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8",
      );
  }, []);

  return (
    <div className="relative min-h-screen bg-[#010102] text-white antialiased overflow-x-hidden selection:bg-[var(--brand-accent)] selection:text-black">
      <CosmicCore />

      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 inset-x-0 z-50 p-6 md:p-8 pointer-events-none">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <Radio className="h-5 w-5 text-[var(--brand-accent)]" />
            </div>

            <div>
              <p className="text-[0.5rem] font-black uppercase tracking-[0.3em] text-white/30 leading-none mb-1">
                {copy.brandEyebrow}
              </p>
              <h4 className="text-sm font-black tracking-tighter text-white">
                MoodSync AI
              </h4>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <Link
              href="/app"
              className="px-6 py-2.5 rounded-full bg-white text-black text-[0.65rem] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Vào app
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative h-[650px] flex flex-col items-center justify-center text-center gap-8 px-6 overflow-hidden pt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)] shadow-[0_0_10px_var(--brand-accent)] animate-pulse" />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-white/60">
              {copy.heroBadge}
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white max-w-5xl"
          >
            {copy.heroTitle}
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-accent)] via-white to-[#4facfe] bg-[length:200%_auto] animate-gradient-slow pb-2">
              {copy.heroTitleAccent}
            </span>
          </h1>

          <p
            ref={subTextRef}
            className="max-w-xl text-[1rem] leading-relaxed text-white/40 font-medium italic"
          >
            {copy.heroDescription}
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 pt-4">
            <GlowCta
              href="/app"
              className="px-14 py-6 shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
            >
              <Play className="h-4 w-4 fill-current mr-2" />
              {copy.primaryCta}
            </GlowCta>

            <GlowCta
              href="/nhanDienCamXuc"
              variant="secondary"
              className="px-10 py-6"
            >
              <ScanFace className="h-4 w-4 mr-2 text-[var(--brand-accent)]" />
              {copy.secondaryCta}
            </GlowCta>
          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 opacity-20"
          >
            <div className="h-10 w-[1px] bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        <div className="mx-auto max-w-[1400px] px-6 md:px-12 space-y-24 pb-40 -mt-10">
          {/* SECTION: MOOD DISCOVERY */}
          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Waves className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                    Vũ trụ Mood
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  {copy.landingSections.emotions.title}
                </h2>
              </div>

              <p className="max-w-xs text-xs leading-relaxed text-white/40 italic">
                {copy.landingSections.emotions.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {moodCollections.map((mood) => (
                <motion.div
                  key={mood.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative p-8 h-60 rounded-[2.5rem] border border-white/10 bg-[#080808] overflow-hidden flex flex-col justify-end shadow-2xl transition-all"
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-30 transition-opacity",
                      mood.accent,
                    )}
                  />

                  <p className="text-[0.7rem] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                    {localizedCopy(mood.title, "vi")}
                  </p>

                  <h4 className="text-lg font-black tracking-tight text-white/80">
                    {localizedCopy(mood.title, "vi")}
                  </h4>
                </motion.div>
              ))}

              <div className="col-span-2 p-10 rounded-[3rem] bg-white text-black flex flex-col justify-center gap-4 relative overflow-hidden shadow-[0_30px_70px_rgba(255,255,255,0.1)]">
                <Sparkles className="h-8 w-8 text-black/20 absolute -right-4 -top-4 scale-150 rotate-12" />

                <h3 className="text-2xl font-black tracking-tighter leading-tight italic">
                  Cảm xúc là mã nguồn âm nhạc.
                </h3>

                <p className="text-[0.75rem] font-medium leading-relaxed opacity-60">
                  MoodSync AI học từ cảm xúc của bạn để kiến tạo danh sách phát
                  cá nhân hóa tuyệt đối.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: SONGS FROM BACKEND DATABASE */}
          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[var(--brand-accent)]">
                    Thư viện nhạc
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  Bài hát từ database
                </h2>
              </div>

              <p className="max-w-xs text-xs leading-relaxed text-white/40 italic">
                Danh sách này được lấy trực tiếp từ backend API{" "}
                <span className="text-white/70">/tracks/</span>.
              </p>
            </div>

            <div className="rounded-[3rem] border border-white/10 bg-white/[0.03] p-5 md:p-8 backdrop-blur-xl">
              <DanhSachBaiHatTuApi />
            </div>
          </section>

          {/* SECTION: UNIFIED EXPERIENCE */}
          <section className="relative p-12 md:p-20 rounded-[3.5rem] border border-white/5 bg-[#0a0a0c] overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--brand-accent-rgb,30,215,96),transparent)] opacity-[0.03]" />

            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <Zap className="h-4 w-4 text-[var(--brand-accent)]" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">
                    {copy.landingSections.personalization.eyebrow}
                  </span>
                </div>

                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  {copy.landingSections.personalization.title}
                </h2>

                <p className="text-[1.05rem] text-white/40 leading-relaxed italic">
                  {copy.landingSections.personalization.description}
                </p>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <p className="text-4xl font-black tracking-tighter text-white">
                      520+
                    </p>
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/20">
                      Nghệ sĩ liên kết
                    </p>
                  </div>

                  <div>
                    <p className="text-4xl font-black tracking-tighter text-white">
                      Neural
                    </p>
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/20">
                      Công nghệ lõi
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-[3rem] bg-[#050505] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10 animate-spin-slow-reverse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-white/5 animate-spin-slow" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [20, 60, 20] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-[var(--brand-accent)]/40 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="text-center py-32 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">
                {copy.landingSections.final.title}
              </h2>

              <p className="max-w-2xl mx-auto text-white/30 text-[1rem] font-medium leading-relaxed italic">
                {copy.landingSections.final.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <GlowCta
                href="/app"
                className="px-16 py-6 scale-110 shadow-[0_0_60px_rgba(30,215,96,0.2)]"
              >
                Vào vũ trụ ngay
              </GlowCta>

              <GlowCta
                href="/nhanDienCamXuc"
                variant="secondary"
                className="px-10 py-6 scale-110"
              >
                Tìm hiểu thêm
              </GlowCta>
            </div>
          </section>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes gradient-slow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            .animate-gradient-slow {
              background-size: 200% auto;
              animation: gradient-slow 8s ease infinite;
            }

            .animate-spin-slow {
              animation: spin 15s linear infinite;
            }

            .animate-spin-slow-reverse {
              animation: spin-rev 20s linear infinite;
            }

            @keyframes spin {
              from {
                transform: translate(-50%, -50%) rotate(0deg);
              }
              to {
                transform: translate(-50%, -50%) rotate(360deg);
              }
            }

            @keyframes spin-rev {
              from {
                transform: translate(-50%, -50%) rotate(360deg);
              }
              to {
                transform: translate(-50%, -50%) rotate(0deg);
              }
            }

            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }

            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />
    </div>
  );
}
